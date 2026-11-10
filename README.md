Z-City+ loading screen and MOTD. Click the spinning Z!

## Setting it up for your server

1. Fork this repo and turn on GitHub Pages (Settings > Pages, branch `main`). Any static web host works too.
2. Edit `config.js`. Everything the two pages show comes from there: logo, theme, colors, fonts, facts, game modes, which panels show, and every MOTD tab.
3. Put your backgrounds in `bg/` as `1.jpg`, `2.jpg`, `3.jpg`... (no gaps, jpg only).
4. In `server.cfg`: `sv_loadingurl "https://<you>.github.io/zplusloading/?steamid=%s"` (`%s` becomes the joining player's SteamID, so their card can load right away).
5. The MOTD lives at `.../zplusloading/motd/`.

`configs/example-plain.js` is a config for a server that isn't running Z-City (no modes, no arcade, its own tabs). Try it with `?config=configs/example-plain.js`.

## Themes

`zcity-red` (default), `zplus-cyan`, `zplus-green` and `christmas` are in `themes/`. Pick one with `theme:` in `config.js`, or try one with `?theme=zplus-cyan` on the address. A theme is just a list of colors, so copying one and changing the colors makes a new one. Single colors can also be changed in `config.js` under `colors:` (accent, accentDark, accentText, glow, panel, border, text, dimText, background, hover, active, selected).

### Seasons

`seasons:` in `config.js` switches settings on between two dates every year, using each player's own date. The Christmas season runs from Nov 20 to Jan 1 and turns on the `christmas` theme, lights along the top, falling snow and the snowy spinner. Set `spinnerStyle: "normal"` inside its `set:` to keep the regular Z, or remove the season to turn it off.

- `lights: true`: Christmas lights along the top.
- `snow: true` and `snowAmount: 70`: falling snow.
- `spinnerStyle: "snow"`: a light blue Z with snow on top (`"normal"` is the regular one).

Add `?season=christmas` to the address to preview it any time of year, or `?season=none` to turn seasons off.

## MOTD tabs

Each entry in `motd.pages` is one tab. Types: `cards`, `rules`, `keys`, `modes`, `html`, plus `server`, `stats` and `leaderboard`, which only show in game when the addon sends data. A card with a `url` gets a button (`button:` sets its text).

## Map pictures

Put `maps/<mapname>.jpg` (or .png) here, 16:9. Without one the page tries the game's own map thumbnail, and hides the picture if that fails too.

## In-game MOTD

`addon/` is the Lua addon that opens the MOTD in game with the player's stats, see `addon/README.md`. Add `?demo=1` to the MOTD address to preview the stats tabs with made-up data.

## Stats API

`worker/` has the Cloudflare Worker for player stats and live server info, see `worker/README.md`. Put its address in `config.js` as `api:` and the loading screen shows a "Right now" panel and the joining player's card (level, title and the stats listed in `playerCardStats`). The addon's `zplus_api_url` and `zplus_api_key` settings keep it filled.

## GMod browser notes

The loading screen runs in GMod's old Chromium: keep the JavaScript ES5 (no `let`, arrow functions or template strings), don't use the CSS `inset` shorthand, and don't count on WebGL. The loading screen can't be clicked in game, so nothing on it may need a click.
