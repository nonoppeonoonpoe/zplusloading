--[[
	sends live server info and player cards to the stats api (the cloudflare worker in worker/),
	so the loading screen can show them before the player has even loaded in.
	does nothing until zplus_api_url and zplus_api_key are set.
]]

local apiUrlCvar = CreateConVar("zplus_api_url", "", FCVAR_ARCHIVE, "address of the zplus stats api, empty turns it off")
local apiKeyCvar = CreateConVar("zplus_api_key", "", bit.bor(FCVAR_ARCHIVE, FCVAR_PROTECTED, FCVAR_DONTRECORD), "the API_KEY secret set on the worker")
local statusSecsCvar = CreateConVar("zplus_api_status_secs", "30", FCVAR_ARCHIVE, "seconds between live server info updates")
local cardSecsCvar = CreateConVar("zplus_api_card_secs", "300", FCVAR_ARCHIVE, "seconds between player card updates")

local function zplusApiOn()
	return apiUrlCvar:GetString() ~= "" and apiKeyCvar:GetString() ~= ""
end

local function zplusApiPost(apiPath, bodyTable)
	if not zplusApiOn() then return end

	local baseUrl = apiUrlCvar:GetString()
	if string.sub(baseUrl, -1) ~= "/" then baseUrl = baseUrl .. "/" end

	HTTP({
		method = "POST",
		url = baseUrl .. apiPath,
		body = util.TableToJSON(bodyTable),
		type = "application/json",
		headers = {["X-ZPlus-Key"] = apiKeyCvar:GetString()},
		success = function(httpCode, replyText)
			if httpCode ~= 200 then
				print("[zplus] api said " .. httpCode .. " to " .. apiPath .. ": " .. tostring(replyText))
			end
		end,
		failed = function(errorText)
			print("[zplus] couldn't reach the api: " .. tostring(errorText))
		end
	})
end

local lastStatusPush = 0

function ZPlus.PushStatus()
	if not zplusApiOn() then return end
	if lastStatusPush > CurTime() - 2 then return end
	lastStatusPush = CurTime()

	zplusApiPost("server", ZPlus.BuildStatus())
end

-- builds cards one after another, then sends them all in one go
function ZPlus.PushCards(plyList)
	if not zplusApiOn() then return end

	local cardBatch = {}
	local playerQueue = {}
	for _, onePly in ipairs(plyList) do
		if IsValid(onePly) and not onePly:IsBot() then playerQueue[#playerQueue + 1] = onePly end
	end
	if #playerQueue == 0 then return end

	local queueSpot = 0
	local function nextCard()
		queueSpot = queueSpot + 1
		local cardPly = playerQueue[queueSpot]

		if not cardPly then
			zplusApiPost("players", {cards = cardBatch})
			return
		end
		if not IsValid(cardPly) then return nextCard() end

		local cardSteamId = cardPly:SteamID64()
		local cardInfo = {name = cardPly:Nick(), steamid = cardSteamId}
		ZPlus.FillCard(cardPly, cardInfo, function()
			cardBatch[cardSteamId] = cardInfo
			nextCard()
		end)
	end
	nextCard()
end

local function zplusStartTimers()
	timer.Create("zplus_api_status", math.max(statusSecsCvar:GetInt(), 10), 0, ZPlus.PushStatus)
	timer.Create("zplus_api_cards", math.max(cardSecsCvar:GetInt(), 60), 0, function()
		ZPlus.PushCards(player.GetHumans())
	end)
end

hook.Add("InitPostEntity", "zplus_api_start", function()
	zplusStartTimers()
	timer.Simple(5, ZPlus.PushStatus)
end)

cvars.AddChangeCallback("zplus_api_status_secs", zplusStartTimers, "zplus_api")
cvars.AddChangeCallback("zplus_api_card_secs", zplusStartTimers, "zplus_api")

hook.Add("PlayerInitialSpawn", "zplus_api_join", function(ply)
	if ply:IsBot() then return end
	timer.Simple(3, ZPlus.PushStatus)
end)

hook.Add("PlayerDisconnected", "zplus_api_leave", function(ply)
	if ply:IsBot() then return end
	ZPlus.PushCards({ply})
	timer.Simple(1, ZPlus.PushStatus)
end)
