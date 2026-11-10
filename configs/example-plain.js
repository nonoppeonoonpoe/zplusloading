/*
  a plain example for a server that isn't running Z-City: no modes, no arcade, its own rules.
  try it with ?config=configs/example-plain.js on the end of the loading screen or motd address.
*/
var zpConfig = {
  serverName: "",
  theme: "zplus-cyan",
  logo: { image: "", accent: "", main: "MY SERVER", plus: "" },
  versionLine: "",
  spinnerLetter: "S",
  arcade: false,
  backgrounds: { folder: "bg/", seconds: 15, max: 50, transition: "fade" },
  panels: { modes: false },
  factsTitle: "Tip",
  facts: [
    "Read the rules in the MOTD, type !motd to open it again.",
    "Be nice to new players."
  ],
  modes: [],
  motd: {
    welcome: "Welcome to",
    background: "bg/1.jpg",
    closeHint: "",
    pages: [
      {
        id: "welcome", tab: "Welcome", type: "cards",
        title: "Welcome",
        lede: "Have fun and look out for each other.",
        cards: [
          { tag: "Staff", title: "Need help?", text: "Type <b>@</b> before a message to reach staff." }
        ]
      },
      {
        id: "rules", tab: "Rules", type: "rules",
        title: "Rules",
        rules: [
          { title: "No cheating", text: "Exploits and hacks get a permanent ban." },
          { title: "Be respectful", text: "No harassment or hate speech." }
        ]
      },
      {
        id: "links", tab: "Links", type: "cards",
        title: "Links",
        cards: [
          { tag: "Discord", title: "Join the Discord", text: "News and support.", url: "https://discord.com", button: "Open Discord" }
        ]
      },
      {
        id: "about", tab: "About", type: "html",
        title: "About",
        html: "<p>Any html you like can go in an html page.</p>"
      }
    ]
  }
};
