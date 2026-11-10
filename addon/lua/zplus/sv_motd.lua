--[[
	opens the zplus motd page in game and hands it the player's stats and live server info.
	other addons can fill in more by replacing ZPlus.FillCard, ZPlus.FillStatus and ZPlus.FillLeaderboard.
]]

util.AddNetworkString("zplus_motd_open")
util.AddNetworkString("zplus_motd_ready")
util.AddNetworkString("zplus_motd_ask")
util.AddNetworkString("zplus_motd_rulesread")

local motdUrlCvar = CreateConVar("zplus_motd_url", "https://nonoppeonoonpoe.github.io/zplusloading/motd/", FCVAR_ARCHIVE, "address of the motd page")
local motdJoinCvar = CreateConVar("zplus_motd_onjoin", "always", FCVAR_ARCHIVE, "when the motd opens on join: always, rules (until they read the rules) or never")
local rulesVersionCvar = CreateConVar("zplus_motd_rules_version", "1", FCVAR_ARCHIVE, "raise this when the rules change so everyone sees them again")

ZPlus.FillCard = ZPlus.FillCard or function(ply, card, done) done() end
ZPlus.FillStatus = ZPlus.FillStatus or function(status) end
ZPlus.FillLeaderboard = ZPlus.FillLeaderboard or function(done) done({}) end

local function zplusRulesRead(ply)
	local readVersion = tonumber(ply:GetPData("zplus_rules_read", "0")) or 0
	return readVersion >= rulesVersionCvar:GetInt()
end

local function zplusServerStatus()
	local humanCount = #player.GetHumans()
	local botCount = #player.GetBots()
	local onlineList = {}

	for _, onePly in player.Iterator() do
		if not onePly:IsBot() then
			onlineList[#onlineList + 1] = {name = onePly:Nick(), steamid = onePly:SteamID64()}
		end
	end

	local statusInfo = {
		hostname = GetHostName(),
		map = game.GetMap(),
		players = humanCount,
		bots = botCount,
		maxPlayers = game.MaxPlayers(),
		mapTime = math.floor(CurTime()),
		online = onlineList
	}

	ZPlus.FillStatus(statusInfo)
	return statusInfo
end

local function zplusSendMotd(ply, showRulesButton)
	local cardInfo = {name = ply:Nick(), steamid = ply:SteamID64()}

	ZPlus.FillCard(ply, cardInfo, function()
		ZPlus.FillLeaderboard(function(topList)
			if not IsValid(ply) then return end

			local motdData = {
				player = cardInfo,
				server = zplusServerStatus(),
				leaderboard = topList or {},
				rulesButton = showRulesButton
			}

			local packedData = util.Compress(util.TableToJSON(motdData))
			if not packedData then return end

			net.Start("zplus_motd_open")
				net.WriteString(motdUrlCvar:GetString())
				net.WriteUInt(#packedData, 16)
				net.WriteData(packedData, #packedData)
			net.Send(ply)
		end)
	end)
end

function ZPlus.OpenMotd(ply)
	if not IsValid(ply) then return end
	zplusSendMotd(ply, not zplusRulesRead(ply))
end

net.Receive("zplus_motd_ready", function(len, ply)
	if ply.zplusMotdShown then return end
	ply.zplusMotdShown = true

	local joinMode = motdJoinCvar:GetString()
	if joinMode == "never" then return end
	if joinMode == "rules" and zplusRulesRead(ply) then return end

	ZPlus.OpenMotd(ply)
end)

net.Receive("zplus_motd_ask", function(len, ply)
	if (ply.zplusMotdWait or 0) > CurTime() then return end
	ply.zplusMotdWait = CurTime() + 3
	ZPlus.OpenMotd(ply)
end)

net.Receive("zplus_motd_rulesread", function(len, ply)
	ply:SetPData("zplus_rules_read", rulesVersionCvar:GetInt())
end)

hook.Add("PlayerSay", "zplus_motd_command", function(ply, chatText)
	local lowerText = string.lower(string.Trim(chatText))
	if lowerText == "!motd" or lowerText == "/motd" then
		if (ply.zplusMotdWait or 0) <= CurTime() then
			ply.zplusMotdWait = CurTime() + 3
			ZPlus.OpenMotd(ply)
		end
		return ""
	end
end)
