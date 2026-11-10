ZPlus = ZPlus or {}

if SERVER then
	AddCSLuaFile("zplus/cl_motd.lua")
	include("zplus/sv_motd.lua")
	include("zplus/sv_bridge.lua")
else
	include("zplus/cl_motd.lua")
end
