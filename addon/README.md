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

## Loading screen data (stats API)

The addon also keeps the stats API (`worker/`) up to date, so the loading screen can show live server info and each player's card. It stays off until both of these are set:

| Setting | Default | What it does |
| --- | --- | --- |
| `zplus_api_url` | empty | The Worker address, for example `https://zplus-api.<you>.workers.dev/` |
| `zplus_api_key` | empty | The `API_KEY` secret you set on the Worker |
| `zplus_api_status_secs` | `30` | Seconds between live info updates (also sent on joins, leaves, and round start and end in Z-City) |
| `zplus_api_card_secs` | `300` | Seconds between player card updates (also sent when a player leaves) |

## Filling in stats

On its own the addon sends the player's name, the map, player count and who's online. A gamemode adds more by replacing these on the server:

- `ZPlus.FillCard(ply, card, done)`: set `card.level`, `card.prestige`, `card.title`, `card.stats` (a list of `{label, value}`) and `card.modes`, then call `done()`.
- `ZPlus.FillStatus(status)`: set `status.mode`, `status.subtype`, `status.round`, `status.roundState`, `status.timeLeft` (seconds).
- `ZPlus.FillLeaderboard(done)`: call `done({columns = {...}, rows = {{name, steamid, values = {...}}}})`.

Z-City does this in `libraries/sv_zplus_motd.lua`. The MOTD tabs that show this data (`server`, `stats`, `leaderboard` in `config.js`) stay hidden until the data arrives, so they never show up empty.
