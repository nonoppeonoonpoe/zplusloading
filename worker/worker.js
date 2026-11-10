/*
  Z-City+ stats API (Cloudflare Worker + D1)

  GET  /server               live server status (public)
  GET  /player/<steamid64>   one player's card (public)
  POST /server               game server sends its status (needs the key)
  POST /players              game server sends cards: { "cards": { "<steamid64>": {...} } } (needs the key)

  bindings: DB (D1 database), secret API_KEY, optional secret STEAM_KEY for avatars
*/

var tablesReady = false;

async function makeTables(env) {
  if (tablesReady) return;
  await env.DB.batch([
    env.DB.prepare("CREATE TABLE IF NOT EXISTS cards (sid TEXT PRIMARY KEY, data TEXT NOT NULL, updated INTEGER NOT NULL, avatar TEXT, avatar_at INTEGER)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS status (id INTEGER PRIMARY KEY, data TEXT NOT NULL, updated INTEGER NOT NULL)")
  ]);
  tablesReady = true;
}

function sendJson(bodyData, statusCode, cacheSeconds) {
  var headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": cacheSeconds ? "public, max-age=" + cacheSeconds : "no-store"
  };
  return new Response(JSON.stringify(bodyData), { status: statusCode || 200, headers: headers });
}

function keyOk(request, env) {
  var givenKey = request.headers.get("X-ZPlus-Key") || "";
  return env.API_KEY && givenKey.length > 0 && givenKey === env.API_KEY;
}

function isSteamId(sidText) {
  return /^7656\d{13}$/.test(sidText);
}

async function readBody(request, maxBytes) {
  var rawText = await request.text();
  if (rawText.length > maxBytes) return null;
  try { return JSON.parse(rawText); } catch (err) { return null; }
}

// steam avatar, cached for a day so we don't ask steam on every load
async function findAvatar(env, sidText, cardRow) {
  if (!env.STEAM_KEY) return null;
  var nowTime = Date.now();
  if (cardRow && cardRow.avatar_at && nowTime - cardRow.avatar_at < 86400000) return cardRow.avatar;
  var avatarUrl = null;
  try {
    var steamReply = await fetch("https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=" + env.STEAM_KEY + "&steamids=" + sidText);
    var steamData = await steamReply.json();
    var steamPlayers = steamData && steamData.response && steamData.response.players;
    if (steamPlayers && steamPlayers.length > 0) avatarUrl = steamPlayers[0].avatarfull || null;
  } catch (err) {
    return cardRow ? cardRow.avatar : null;
  }
  if (cardRow) {
    await env.DB.prepare("UPDATE cards SET avatar = ?, avatar_at = ? WHERE sid = ?").bind(avatarUrl, nowTime, sidText).run();
  }
  return avatarUrl;
}

async function getPlayer(env, sidText) {
  if (!isSteamId(sidText)) return sendJson({ error: "bad steamid" }, 400);
  var cardRow = await env.DB.prepare("SELECT data, updated, avatar, avatar_at FROM cards WHERE sid = ?").bind(sidText).first();
  if (!cardRow) return sendJson({ found: false }, 200, 30);
  var avatarUrl = await findAvatar(env, sidText, cardRow);
  return sendJson({ found: true, updated: cardRow.updated, avatar: avatarUrl, card: JSON.parse(cardRow.data) }, 200, 30);
}

async function getServer(env) {
  var statusRow = await env.DB.prepare("SELECT data, updated FROM status WHERE id = 1").first();
  if (!statusRow) return sendJson({ found: false }, 200, 10);
  var ageSeconds = Math.floor((Date.now() - statusRow.updated) / 1000);
  return sendJson({ found: true, updated: statusRow.updated, age: ageSeconds, status: JSON.parse(statusRow.data) }, 200, 10);
}

async function postServer(request, env) {
  var statusData = await readBody(request, 65536);
  if (!statusData) return sendJson({ error: "bad body" }, 400);
  await env.DB.prepare("INSERT INTO status (id, data, updated) VALUES (1, ?, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated = excluded.updated")
    .bind(JSON.stringify(statusData), Date.now()).run();
  return sendJson({ ok: true });
}

async function postPlayers(request, env) {
  var bodyData = await readBody(request, 262144);
  if (!bodyData || typeof bodyData.cards !== "object") return sendJson({ error: "bad body" }, 400);
  var nowTime = Date.now();
  var writeList = [];
  for (var sidText in bodyData.cards) {
    if (!isSteamId(sidText)) continue;
    var cardText = JSON.stringify(bodyData.cards[sidText]);
    if (cardText.length > 8192) continue;
    writeList.push(env.DB.prepare("INSERT INTO cards (sid, data, updated) VALUES (?, ?, ?) ON CONFLICT(sid) DO UPDATE SET data = excluded.data, updated = excluded.updated").bind(sidText, cardText, nowTime));
  }
  if (writeList.length > 0) await env.DB.batch(writeList);
  return sendJson({ ok: true, saved: writeList.length });
}

export default {
  async fetch(request, env) {
    var pageUrl = new URL(request.url);
    var pathParts = pageUrl.pathname.split("/").filter(function (onePart) { return onePart !== ""; });

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET", "Access-Control-Max-Age": "86400" } });
    }

    await makeTables(env);

    if (request.method === "GET") {
      if (pathParts.length === 0) return sendJson({ ok: true, name: "zplus-api" });
      if (pathParts[0] === "server" && pathParts.length === 1) return getServer(env);
      if (pathParts[0] === "player" && pathParts.length === 2) return getPlayer(env, pathParts[1]);
      return sendJson({ error: "not found" }, 404);
    }

    if (request.method === "POST") {
      if (!keyOk(request, env)) return sendJson({ error: "wrong key" }, 403);
      if (pathParts[0] === "server" && pathParts.length === 1) return postServer(request, env);
      if (pathParts[0] === "players" && pathParts.length === 1) return postPlayers(request, env);
      return sendJson({ error: "not found" }, 404);
    }

    return sendJson({ error: "method not allowed" }, 405);
  }
};
