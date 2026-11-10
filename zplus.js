/* shared setup for the loading screen and the motd: url overrides, theme, colors, little helpers */
var zpScriptTag = document.currentScript || document.scripts[document.scripts.length - 1];
var zpRoot = zpScriptTag.src.replace(/zplus\.js(\?.*)?$/, "");

function zpParam(paramName) {
  var foundParam = new RegExp("[?&]" + paramName + "=([^&#]*)").exec(window.location.search);
  if (!foundParam) return "";
  try { return decodeURIComponent(foundParam[1].replace(/\+/g, " ")); } catch (err) { return foundParam[1]; }
}

/* only plain files from this site, so a link can't load someone else's script */
function zpSafePath(pathText) {
  return /^[A-Za-z0-9_\-\/]+\.js$/.test(pathText) && pathText.indexOf("//") === -1 && pathText.charAt(0) !== "/";
}

if (typeof zpConfig !== "object" || zpConfig === null) zpConfig = {};

var zpOtherConfig = zpParam("config");
if (zpOtherConfig !== "" && zpSafePath(zpOtherConfig)) {
  document.write('<script src="' + zpRoot + zpOtherConfig + '"><\/script>');
}

function zpPick(someValue, fallbackValue) {
  return (someValue === undefined || someValue === null) ? fallbackValue : someValue;
}

/* panels default to on, set one to false in config.js to hide it */
function zpPanelOn(panelName) {
  var panelList = zpConfig.panels || {};
  return panelList[panelName] !== false;
}

var zpColorVars = {
  accent: "--red", accentDark: "--red-dark", accentText: "--hot", glow: "--glow",
  panel: "--panel", border: "--edge", text: "--text", dimText: "--dim", background: "--bg",
  hover: "--hover", active: "--active", selected: "--pick"
};

/* runs right after config is in, still inside <head>, so the theme is there before the page shows */
function zpStart() {
  var themeName = zpParam("theme") || zpPick(zpConfig.theme, "zcity-red");
  if (/^[a-z0-9\-]+$/.test(themeName)) {
    document.write('<link rel="stylesheet" href="' + zpRoot + "themes/" + themeName + '.css">');
  }
  if (zpConfig.fontLink) {
    document.write('<link rel="stylesheet" href="' + String(zpConfig.fontLink).replace(/"/g, "") + '">');
  }
  var rootStyle = document.documentElement.style;
  var colorList = zpConfig.colors || {};
  for (var colorKey in colorList) {
    if (zpColorVars[colorKey]) rootStyle.setProperty(zpColorVars[colorKey], colorList[colorKey]);
  }
  var fontList = zpConfig.fonts || {};
  if (fontList.ui) rootStyle.setProperty("--ui", fontList.ui);
  if (fontList.logo) rootStyle.setProperty("--logo", fontList.logo);
}

/* logo: a picture, or text in three parts (accent, main, small accent) */
function zpFillLogo(logoBox) {
  var logoInfo = zpConfig.logo || {};
  logoBox.innerHTML = "";
  if (logoInfo.image) {
    var logoPic = document.createElement("img");
    logoPic.className = "logoimg";
    logoPic.alt = zpPick(logoInfo.main, "");
    logoPic.src = zpRoot + logoInfo.image;
    logoBox.appendChild(logoPic);
    logoBox.className = logoBox.className + " haspic";
    return;
  }
  var logoParts = [["z", zpPick(logoInfo.accent, "")], ["c", zpPick(logoInfo.main, "")], ["plus", zpPick(logoInfo.plus, "")]];
  for (var p = 0; p < logoParts.length; p++) {
    if (logoParts[p][1] === "") continue;
    var partSpan = document.createElement("span");
    partSpan.className = logoParts[p][0];
    partSpan.textContent = logoParts[p][1];
    logoBox.appendChild(partSpan);
  }
}

/* the modes list, empty when the server doesn't use one */
function zpModeGroups() {
  var modeData = zpConfig.modes;
  if (modeData && modeData.length) return modeData;
  return [];
}
