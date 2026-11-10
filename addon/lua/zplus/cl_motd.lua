local zplusMotdFrame = nil

local function zplusUrlPart(rawText)
	local cleanText = string.gsub(tostring(rawText or ""), "[^%w%-%._~]", function(oneChar)
		return string.format("%%%02X", string.byte(oneChar))
	end)
	return cleanText
end

local function zplusOpenFrame(pageUrl, jsonText)
	if IsValid(zplusMotdFrame) then zplusMotdFrame:Remove() end

	local frameWide = math.min(ScrW() - 40, 1600)
	local frameTall = math.min(ScrH() - 40, 900)

	local motdFrame = vgui.Create("DFrame")
	motdFrame:SetTitle("")
	motdFrame:SetSize(frameWide, frameTall)
	motdFrame:Center()
	motdFrame:MakePopup()
	motdFrame:SetDraggable(false)
	motdFrame.Paint = function(self, w, h)
		draw.RoundedBox(0, 0, 0, w, h, Color(10, 10, 12, 245))
	end
	zplusMotdFrame = motdFrame

	local pageView = vgui.Create("DHTML", motdFrame)
	pageView:Dock(FILL)
	pageView:DockMargin(0, 0, 0, 0)

	pageView:AddFunction("zplus", "close", function()
		if IsValid(motdFrame) then motdFrame:Close() end
	end)
	pageView:AddFunction("zplus", "rulesRead", function()
		net.Start("zplus_motd_rulesread")
		net.SendToServer()
	end)

	local sendData = function()
		if not IsValid(pageView) then return end
		pageView:QueueJavascript("if (window.ZPlus && ZPlus.setData) { ZPlus.setData(" .. jsonText .. "); }")
	end
	pageView.OnDocumentReady = function()
		sendData()
		timer.Simple(1, sendData)
	end

	local joinChar = string.find(pageUrl, "?", 1, true) and "&" or "?"
	local fullUrl = pageUrl .. joinChar .. "ingame=1&map=" .. zplusUrlPart(game.GetMap()) .. "&name=" .. zplusUrlPart(GetHostName()) .. "&id=" .. zplusUrlPart(LocalPlayer():SteamID64())
	pageView:OpenURL(fullUrl)
end

net.Receive("zplus_motd_open", function()
	local pageUrl = net.ReadString()
	local dataSize = net.ReadUInt(16)
	local packedData = net.ReadData(dataSize)
	local jsonText = util.Decompress(packedData or "") or "{}"

	zplusOpenFrame(pageUrl, jsonText)
end)

hook.Add("InitPostEntity", "zplus_motd_ready", function()
	timer.Simple(2, function()
		net.Start("zplus_motd_ready")
		net.SendToServer()
	end)
end)

concommand.Add("zplus_motd", function()
	net.Start("zplus_motd_ask")
	net.SendToServer()
end)
