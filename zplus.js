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

/* "11-20" style dates, a range can wrap past new year */
function zpDayNumber(dayText) {
  var dayParts = String(dayText).split("-");
  return (parseInt(dayParts[0], 10) || 0) * 100 + (parseInt(dayParts[1], 10) || 0);
}

function zpSeasonOn(seasonInfo, todayNumber) {
  var fromNumber = zpDayNumber(seasonInfo.from);
  var toNumber = zpDayNumber(seasonInfo.to);
  if (fromNumber <= toNumber) return todayNumber >= fromNumber && todayNumber <= toNumber;
  return todayNumber >= fromNumber || todayNumber <= toNumber;
}

/* ?season=name forces one on for testing, ?season=none turns them all off */
function zpFindSeason() {
  var seasonList = zpConfig.seasons || [];
  var forcedSeason = zpParam("season");
  var nowDate = new Date();
  var todayNumber = (nowDate.getMonth() + 1) * 100 + nowDate.getDate();
  for (var s = 0; s < seasonList.length; s++) {
    var oneSeason = seasonList[s];
    if (forcedSeason !== "") {
      if (oneSeason.name === forcedSeason) return oneSeason;
    } else if (zpSeasonOn(oneSeason, todayNumber)) {
      return oneSeason;
    }
  }
  return null;
}

var zpSeason = null;

/* runs right after config is in, still inside <head>, so the theme is there before the page shows */
function zpStart() {
  zpSeason = zpFindSeason();
  if (zpSeason) {
    var seasonSettings = zpSeason.set || {};
    for (var settingKey in seasonSettings) zpConfig[settingKey] = seasonSettings[settingKey];
    if (zpSeason.addFacts && zpSeason.addFacts.length) zpConfig.facts = (zpConfig.facts || []).concat(zpSeason.addFacts);
  }
  if (zpConfig.lights || zpConfig.snow || zpConfig.logoStyle === "snow") {
    document.write('<link rel="stylesheet" href="' + zpRoot + 'decor.css">');
    document.addEventListener("DOMContentLoaded", zpDecorate);
  }
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
  if (zpConfig.logoStyle === "snow") logoBox.className = logoBox.className + " snowlogo";
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

/* christmas lights along the top and falling snow, turned on by lights / snow in config.js */
function zpDecorate() {
  if (zpConfig.lights) zpAddLights();
  if (zpConfig.snow) zpAddSnow();
}

var zpBulbColors = ["#3fb54a", "#7fd3e6", "#ff5b5b", "#ffc93c", "#3fb54a", "#8e5bb5", "#ff5b5b", "#ffc93c", "#3fb54a", "#ff8a3d", "#ff5b5b", "#ffc93c", "#7fd3e6", "#8e5bb5"];

function zpWireY(wireX) {
  return 13 + 7 * Math.sin(wireX * Math.PI * 2 / 260);
}

function zpDrawLights(lightsBox) {
  var stripWidth = Math.max(window.innerWidth, 320);
  var svgText = '<svg width="' + stripWidth + '" height="60" viewBox="0 0 ' + stripWidth + ' 60"><defs>';
  for (var c = 0; c < zpBulbColors.length; c++) {
    svgText += '<radialGradient id="zpglow' + c + '"><stop offset="0" stop-color="' + zpBulbColors[c] + '" stop-opacity="0.75"/><stop offset="1" stop-color="' + zpBulbColors[c] + '" stop-opacity="0"/></radialGradient>';
  }
  svgText += '</defs>';

  var wirePath = "M-10," + zpWireY(-10).toFixed(1);
  for (var wireX = 0; wireX <= stripWidth + 10; wireX += 8) wirePath += " L" + wireX + "," + zpWireY(wireX).toFixed(1);
  svgText += '<path d="' + wirePath + '" fill="none" stroke="#1d5e27" stroke-width="2.4" stroke-linecap="round"/>';

  var bulbNumber = 0;
  for (var bulbX = 22; bulbX < stripWidth; bulbX += 44) {
    var colorSpot = bulbNumber % zpBulbColors.length;
    var bulbY = zpWireY(bulbX);
    var bulbTilt = (bulbNumber % 2 === 0 ? -1 : 1) * (4 + (bulbNumber * 7) % 5);
    var twinkleDelay = ((bulbNumber * 0.73) % 2.8).toFixed(2);
    svgText += '<g class="zpbulb" transform="translate(' + bulbX + ',' + bulbY.toFixed(1) + ') rotate(' + bulbTilt + ')" style="animation-delay:-' + twinkleDelay + 's">';
    svgText += '<circle class="glow" cx="0" cy="18" r="17" fill="url(#zpglow' + colorSpot + ')"/>';
    svgText += '<path class="glass" d="M-5.5,6 C-8.8,13 -6.4,23 0,31 C6.4,23 8.8,13 5.5,6 Z" fill="' + zpBulbColors[colorSpot] + '"/>';
    svgText += '<ellipse cx="-2.4" cy="14" rx="1.5" ry="4.2" fill="#fff" opacity="0.55"/>';
    svgText += '<rect x="-4.2" y="-1" width="8.4" height="8" rx="1.6" fill="#24302a"/>';
    svgText += '</g>';
    bulbNumber = bulbNumber + 1;
  }
  lightsBox.innerHTML = svgText + '</svg>';
}

function zpAddLights() {
  var lightsBox = document.createElement("div");
  lightsBox.className = "zplights";
  lightsBox.setAttribute("aria-hidden", "true");
  document.body.appendChild(lightsBox);
  document.body.className = document.body.className + " zp-lights";
  zpDrawLights(lightsBox);
  var lightsResizeTimer = null;
  window.addEventListener("resize", function () {
    clearTimeout(lightsResizeTimer);
    lightsResizeTimer = setTimeout(function () { zpDrawLights(lightsBox); }, 200);
  });
}

function zpAddSnow() {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var snowCanvas = document.createElement("canvas");
  snowCanvas.className = "zpsnow";
  snowCanvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(snowCanvas);
  var snowPen = snowCanvas.getContext("2d");
  if (!snowPen) return;

  var flakeList = [];
  var flakeCount = Math.max(0, Math.min(300, zpPick(zpConfig.snowAmount, 70)));
  function sizeSnow() {
    snowCanvas.width = window.innerWidth;
    snowCanvas.height = window.innerHeight;
  }
  function newFlake(anywhere) {
    return {
      x: Math.random() * snowCanvas.width,
      y: anywhere ? Math.random() * snowCanvas.height : -6,
      size: 1 + Math.random() * 2.6,
      fall: 22 + Math.random() * 38,
      sway: 0.4 + Math.random() * 0.8,
      swayStart: Math.random() * 6.3,
      see: 0.45 + Math.random() * 0.45
    };
  }
  sizeSnow();
  for (var f = 0; f < flakeCount; f++) flakeList.push(newFlake(true));
  window.addEventListener("resize", sizeSnow);

  var lastTime = 0;
  var wasPaused = false;
  function snowStep(nowTime) {
    window.requestAnimationFrame(snowStep);
    var stepSecs = lastTime ? Math.min((nowTime - lastTime) / 1000, 0.1) : 0;
    lastTime = nowTime;
    if (document.body.className.indexOf("arcadeopen") !== -1) {
      if (!wasPaused) snowPen.clearRect(0, 0, snowCanvas.width, snowCanvas.height);
      wasPaused = true;
      return;
    }
    wasPaused = false;
    snowPen.clearRect(0, 0, snowCanvas.width, snowCanvas.height);
    snowPen.fillStyle = "#ffffff";
    var timeSecs = nowTime / 1000;
    for (var i = 0; i < flakeList.length; i++) {
      var flake = flakeList[i];
      flake.y += flake.fall * stepSecs;
      flake.x += Math.sin(timeSecs * flake.sway + flake.swayStart) * 12 * stepSecs;
      if (flake.y > snowCanvas.height + 6) flakeList[i] = newFlake(false);
      snowPen.globalAlpha = flake.see;
      snowPen.beginPath();
      snowPen.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
      snowPen.fill();
    }
    snowPen.globalAlpha = 1;
  }
  window.requestAnimationFrame(snowStep);
}
