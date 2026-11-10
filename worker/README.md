# Z-City+ stats API

A small Cloudflare Worker that holds player cards and the live server status for the loading screen. The game server writes to it, the loading screen reads from it. It stores data in a D1 database (Cloudflare's free SQL database) and makes its own tables on the first request.

| Call | Who | What |
| --- | --- | --- |
| `GET /server` | loading screen | live server status, with `age` in seconds |
| `GET /player/<steamid64>` | loading screen | one player's card, plus avatar if a Steam key is set |
| `POST /server` | game server | new status, needs the `X-ZPlus-Key` header |
| `POST /players` | game server | `{ "cards": { "<steamid64>": { ... } } }`, needs the `X-ZPlus-Key` header |

## Setup in the Cloudflare dashboard

1. Make a free account at https://dash.cloudflare.com/sign-up.
2. Make the database: **Storage & Databases > D1 SQL Database > Create**, name it `zplus`.
3. Make the Worker: **Compute (Workers) > Workers & Pages > Create > Start with Hello World**, name it `zplus-api`, then **Deploy**.
4. Open the Worker, click **Edit code**, replace everything with the contents of `worker.js`, then **Deploy**.
5. Connect the database: Worker **Settings > Bindings > Add > D1 database**, variable name `DB`, database `zplus`.
6. Add the server's key: Worker **Settings > Variables and Secrets > Add**, type **Secret**, name `API_KEY`, value a long random password (32+ characters). Keep it, it goes into `server.cfg` later.
7. Optional avatars: get a key at https://steamcommunity.com/dev/apikey and add it as another **Secret** named `STEAM_KEY`.
8. Check it works: open `https://zplus-api.<your-subdomain>.workers.dev/server`. It should show `{"found":false}` until the game server sends its first status.

Menu names in the dashboard move around now and then, so if one doesn't match, look for the same words nearby.

## Setup with the command line (optional)

With Node installed: `npx wrangler login`, `npx wrangler d1 create zplus`, paste the printed `database_id` into `wrangler.toml`, then `npx wrangler secret put API_KEY` and `npx wrangler deploy` from this folder.

## Limits

The free plan is plenty for one server: a status every 30 seconds is about 2,900 database writes a day, and the loading screen's reads are cached for 10 to 30 seconds.
