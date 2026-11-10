# Z+ MOTD addon

Opens the MOTD page in game and sends it the player's stats, a leaderboard and what's happening on the server right now.

## Install

Copy this `addon` folder into `garrysmod/addons/` on the server and rename it (for example `garrysmod/addons/zplus`). If ULX shows its own MOTD, turn that off with `ulx_showMotd 0` so players don't get two.

## Settings (server.cfg)

| Setting | Default | What it does |
| --- | --- | --- |
| `zplus_motd_url` | `https://nonoppeonoonpoe.github.io/zplusloading/motd/` | Address of the MOTD page |
| `zplus_motd_onjoin` | `always` | `always`, `rules` (only until the player clicks "I've read the rules") or `never` |
| `zplus_motd_rules_version` | `1` | Raise it when the rules change, so everyone sees them again |

Players open it again with `!motd`, `/motd` or the `zplus_motd` console command.

## Filling in stats

On its own the addon sends the player's name, the map, player count and who's online. A gamemode adds more by replacing these on the server:

- `ZPlus.FillCard(ply, card, done)`: set `card.level`, `card.prestige`, `card.title`, `card.stats` (a list of `{label, value}`) and `card.modes`, then call `done()`.
- `ZPlus.FillStatus(status)`: set `status.mode`, `status.subtype`, `status.round`, `status.roundState`, `status.timeLeft` (seconds).
- `ZPlus.FillLeaderboard(done)`: call `done({columns = {...}, rows = {{name, steamid, values = {...}}}})`.

Z-City does this in `libraries/sv_zplus_motd.lua`. The MOTD tabs that show this data (`server`, `stats`, `leaderboard` in `config.js`) stay hidden until the data arrives, so they never show up empty.
