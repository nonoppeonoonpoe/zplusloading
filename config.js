/*
  settings for the loading screen and the motd, this is the file to edit for your server.
  anything left out falls back to a default, and a panel set to false is hidden.
  text in the motd can use simple html like <b>bold</b>.
*/
var zpConfig = {
  serverName: "",
  theme: "zcity-red",
  colors: {},
  fonts: {},
  fontLink: "",

  logo: { image: "", accent: "Z-", main: "CITY", plus: "+" },
  versionLine: "Z-City Release v1.0 &middot; ZBots 10.25",
  spinnerLetter: "Z",
  spinnerStyle: "normal",

  lights: false,
  snow: false,
  snowAmount: 70,

  /*
    seasons switch things on between two dates (month-day) every year, using the player's own date.
    "set" replaces those settings while the season is on, "addFacts" adds facts to the list.
    spinnerStyle can be "normal" or "snow" (a light blue Z with snow on top).
  */
  seasons: [
    {
      name: "christmas", from: "11-20", to: "01-01",
      set: { theme: "christmas", lights: true, snow: true, spinnerStyle: "snow" },
      addFacts: [
        "Merry Christmas from Z-City+!",
        "It's cold out there. Stay alive long enough to open your presents."
      ]
    }
  ],
  arcade: true,

  backgrounds: { folder: "bg/", seconds: 12, max: 50, transition: "slide" },
  mapPictures: "maps/",

  api: "https://zplus-api.z-plus.workers.dev/",
  apiRefresh: 15,
  liveTitle: "Right now",
  liveNames: 8,
  liveMaxAge: 120,
  playerCardStats: ["Wins", "Playtime", "Best mode"],
  newPlayerText: "First time here? Welcome!",

  panels: {
    server: true,
    version: true,
    map: true,
    mapPicture: true,
    player: true,
    live: true,
    modes: true,
    facts: true,
    status: true,
    spinner: true
  },

  modesTitle: "Game modes",
  modes: zcModeGroups,

  factsTitle: "Did you know",
  facts: [
    "Spectating a bot? Press G to take over its body.",
    "Being carried off? Press Space to break free. The more hurt you are, the harder it gets.",
    "Ragdolled and stuck? Ask a bot to carry you from the radial menu.",
    "Bots take errands. Tell one to buy you something, or to pick that up.",
    "Levels, prestige and daily challenges count in every mode.",
    "Walls and doors muffle sound. If you hear it clearly, it's close.",
    "Dead? Look at a prop while spectating and press V to possess it.",
    "Fall from high enough and you won't get back up.",
    "Carrying someone? Use the radial menu to put them down gently.",
    "Things can be hidden on a body. A pat-down won't always find them.",
    "With a weapon sling you can carry a melee weapon on your back.",
    "Some guns can be loaded with mixed ammo. Mix rounds into a magazine for the right job.",
    "You can stack several grenades of the same kind in one slot.",
    "In Team Deathmatch you can double-click an item to buy it right away.",
    "During freeze time, teammates can buy gear for you.",
    "Your team can see your claymores and planted explosives through walls. The enemy can't.",
    "Bots will flank where you aim if you ask them to.",
    "Bots can hide or hold an angle if you tell them to.",
    "Bots smash boards, crates and other breakable props that are in their way.",
    "Shoot a bot teammate and it might say sorry. Keep doing it and it might shoot back.",
    "Bots pick up gun attachments they find and put them on their guns.",
    "Bots fight NPCs too, not just players.",
    "Combine and Metrocops can throw out manhacks from the radial menu.",
    "Fear builds up in the dark. Stay close to others in zombie modes and Stalker.",
    "Each mode has its own level, on top of your main level.",
    "Locked door? Hit it enough times and it won't be locked anymore.",
    "Cuffed people can still be searched.",
    "Want a bot's gun? Ask it to trade with you.",
    "In Homicide, the police always come eventually. Stay alive until then.",
    "Patience wins more Homicide rounds than guns do.",
    "If the lights go out, you're probably not alone.",
    "Losing a lot? Try losing in a different mode.",
    "Arms Race ends on a revolver. Make the last shot count.",
    "The arcade is hiding in game too. Click the version number on the Tab menu a few times."
  ],

  motd: {
    welcome: "Welcome to",
    background: "bg/1.jpg",
    closeHint: "",
    rulesButton: "I've read the rules",
    pages: [
    {
      id: "start", tab: "Start here", type: "cards",
      title: "Start here",
      lede: "Z-City+ is a round-based gamemode. Every round picks a different mode, so one round you're hunting a murderer and the next you're holding off zombies or storming a building. Injuries are realistic, and most rounds give you one life.",
      cards: [
        { tag: "Rounds", title: "A new mode every round", text: "When the round ends, the next mode is picked. Check the Game modes tab to see what each one asks of you. Players can vote on what comes next." },
        { tag: "Your role", title: "Read the role screen", text: "At the start of each round a screen tells you your team, role and goal. Read it, because the goal changes from mode to mode." },
        { tag: "Dead?", title: "Spectate and wait", text: "Dead players spectate until the next round. In some modes you can take over a bot or possess props while you wait." },
        { tag: "Bots", title: "Bots fill the server", text: "Bots play every mode with you. Teammate bots follow orders from the radial menu and chat, like follow me, cover me, hold here or medic." },
        { tag: "Menu", title: "Press Esc for the Z-City menu", text: "Settings, key binds, your character's appearance, achievements, stats and votes all live there." },
        { tag: "Content", title: "Missing textures or errors?", text: "Subscribe to the server's workshop collection (see Community) so models and sounds load properly." }
      ]
    },
    {
      id: "now", tab: "Right now", type: "server",
      title: "Right now",
      lede: "What's happening on the server."
    },
    {
      id: "you", tab: "Your stats", type: "stats",
      title: "Your stats",
      lede: "Everything you've done here, across every mode."
    },
    {
      id: "top", tab: "Leaderboard", type: "leaderboard",
      title: "Leaderboard",
      lede: "The highest levels on the server."
    },
    {
      id: "rules", tab: "Rules", type: "rules",
      title: "Rules",
      lede: "Breaking these can get you kicked or banned. Staff have the final say.",
      badge: "Placeholder",
      rules: [
        { title: "Try not to RDM", text: "RDM is bound to happen (its gmod) but try not to make it a reoccuring event." },
        { title: "Keep it cool with everyone", text: "You can fuck around with your friends, but if someone is asking you not to do something, then stop. Racism won't be tolerated." },
        { title: "Keep voice and chat usable", text: "No micspamming or soundboards." }
      ]
    },
    {
      id: "modes", tab: "Game modes", type: "modes",
      title: "Game modes",
      lede: "Pick a mode to read what it's about. Modes with a red number have subtypes that change the rules for that round."
    },
    {
      id: "controls", tab: "Controls", type: "keys",
      title: "Controls",
      lede: "Keys in white are defaults. Keys in yellow aren't bound until you set them in <b>Esc &rsaquo; Binds</b>, so do that before your first round.",
      groups: [
        { title: "Everyday", keys: [
          { key: "Q", text: "<b>Radial menu.</b> Orders for bots, voice lines, drop items, put down carried people and more." },
          { key: "Tab", text: "<b>Scoreboard.</b> Players, levels, round history and a recap of how you died." },
          { key: "Esc", text: "<b>Z-City menu.</b> Settings, binds, appearance, achievements, stats and votes." },
          { key: "E", text: "<b>Use.</b> Doors, pick-ups, searching bodies, vehicles." },
          { key: "Shift", text: "<b>Sprint.</b> Stamina runs out, so pace yourself." },
          { key: "Alt + Enter", text: "<b>Whisper</b> in chat. Hold left Alt and press Enter." }
        ] },
        { title: "Bind these yourself", keys: [
          { key: "Ragdoll", text: "<b>Go limp</b> on purpose, to dive, play dead or fall safely." },
          { key: "Lean", text: "<b>Lean left and right</b> around corners." },
          { key: "Kick", text: "<b>Kick</b> doors and people." },
          { key: "Zoom", text: "<b>Zoom in</b> while held." },
          { key: "Hold breath", text: "<b>Steady your aim</b> and avoid gas." },
          { key: "Drop weapon", text: "<b>Drop</b> what you're holding." },
          { key: "Free look", text: "<b>Look around</b> without turning your body." },
          { key: "Posture", text: "<b>Change how you hold your gun.</b>" },
          { key: "Laser", text: "<b>Toggle</b> a fitted laser." },
          { key: "B", text: "<b>Seatbelt</b> in vehicles. Without it, a bad crash throws you out." }
        ] },
        { title: "Situational", keys: [
          { key: "Space", text: "<b>Break free</b> when someone carries you. Hurt players have to mash it." },
          { key: "G", text: "<b>Take over a bot</b> you're spectating." },
          { key: "V", text: "<b>Possess a prop</b> while dead and spectating." },
          { key: "F3 / C", text: "<b>Shop</b> in Trouble in Z-City." },
          { key: "F4", text: "<b>Change class</b> in Day of Defeat." },
          { key: "Alt + E", text: "<b>Quiet body search</b> in Trouble in Z-City. Hold walk while searching so nobody is told." }
        ] },
        { title: "Chat commands", keys: [
          { key: "!zvote", text: "<b>Open the vote menu.</b>" },
          { key: "!votemode", text: "<b>Vote</b> on the next mode." },
          { key: "!yes / !no", text: "<b>Answer</b> a running vote." },
          { key: "!drop", text: "<b>Drop</b> your weapon." }
        ] }
      ]
    },
    {
      id: "survive", tab: "Staying alive", type: "cards",
      title: "Staying alive",
      lede: "There's no simple health bar to watch. Your body takes damage in parts, and what happens depends on where you were hit.",
      cards: [
        { tag: "Bleeding", title: "Stop the bleeding first", text: "Wounds keep bleeding until you treat them. Bandages and other medical items are in your inventory or the shop. Lose too much blood and you pass out, then die." },
        { tag: "Pain", title: "Pain knocks you down", text: "Too much pain and you collapse or pass out. Painkillers help you keep going." },
        { tag: "Bones", title: "Broken legs, broken aim", text: "Broken legs slow you down and broken arms make aiming harder. Falls from high up can kill outright." },
        { tag: "Ragdolls", title: "Getting knocked over", text: "Big hits and explosions can ragdoll you. While down you can grab things with your hands and get back up once you're able." },
        { tag: "Help", title: "Carry the wounded", text: "Downed teammates can be dragged or carried to safety. Ask a bot to carry you from the radial menu if you're stuck." }
      ]
    },
    {
      id: "progress", tab: "Progression", type: "cards",
      title: "Progression",
      lede: "Everything you do counts toward your profile, whatever mode is on.",
      cards: [
        { tag: "Levels", title: "Level up by playing", text: "Kills, wins, objectives and surviving all earn XP. Your level shows on the scoreboard." },
        { tag: "Prestige", title: "Prestige and titles", text: "Hit the cap, prestige, and start again with something to show for it. Titles and name colors unlock along the way." },
        { tag: "Dailies", title: "Daily challenges", text: "New challenges every day for bonus XP." },
        { tag: "Modes", title: "Mode levels", text: "Each mode tracks its own level, so you can see what you're best at." },
        { tag: "Achievements", title: "Achievements", text: "Some are obvious, some are hidden. Check Esc &rsaquo; Achievements." },
        { tag: "Stats", title: "Your stats", text: "Kills, deaths, wins and more in Esc &rsaquo; Stats." }
      ]
    },
    {
      id: "links", tab: "Community", type: "cards",
      title: "Community",
      lede: "Join the community, grab the content, and get in touch with staff.",
      cards: [
        { tag: "Discord", title: "Join the Discord", text: "Announcements, reports, appeals and finding people to play with.", url: "" },
        { tag: "Workshop", title: "Workshop collection", text: "Subscribe so the server's models, sounds and maps are ready before you join.", url: "" },
        { tag: "Staff", title: "Need an admin?", text: "Use <b>@</b> before a chat message to reach staff online, or report it in the Discord.", url: "" }
      ]
    }
    ]
  }
};
