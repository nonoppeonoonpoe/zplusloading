/* shared by the loading screen and the arcade page: sounds, z-snake and the jstouhou tab */
var zcVolume = 0.6;
var zcAudio = null;
function zcTone(type, startHz, endHz, length, loud, wait) {
  setTimeout(function () {
    try {
      if (!zcAudio) zcAudio = new (window.AudioContext || window.webkitAudioContext)();
      var t = zcAudio.currentTime;
      var osc = zcAudio.createOscillator();
      var gain = zcAudio.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(startHz, t);
      if (endHz !== startHz) osc.frequency.exponentialRampToValueAtTime(endHz, t + length * 0.4);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(loud * zcVolume + 0.0001, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + length);
      osc.connect(gain);
      gain.connect(zcAudio.destination);
      osc.start(t);
      osc.stop(t + length + 0.05);
    } catch (err) {}
  }, wait || 0);
}
function zcChime() {
  var notes = [523, 659, 784, 1047];
  for (var n = 0; n < notes.length; n++) zcTone("triangle", notes[n], notes[n], 0.35, 0.2, n * 90);
}

function zcArcadeOn() {
  var overlayBox = document.getElementById("snakebox");
  return !overlayBox || overlayBox.classList.contains("open");
}

var zcCanvas = document.getElementById("snake");
var zcPen = zcCanvas.getContext("2d");
var zcCells = 20;
var zcCellSize = zcCanvas.width / zcCells;
var zcSnake = [];
var zcDir = { x: 1, y: 0 };
var zcNextDir = { x: 1, y: 0 };
var zcFood = { x: 10, y: 10 };
var zcScore = 0;
var zcBest = 0;
var zcSnakeLoop = null;
var zcSnakeAlive = false;
var zcHueShift = 0;
try { zcBest = parseInt(localStorage.getItem("zplus_snake_best") || "0", 10) || 0; } catch (err) {}
document.getElementById("snakebest").textContent = zcBest;

function zcResetSnake() {
  zcSnake = [{ x: 8, y: 10 }, { x: 7, y: 10 }, { x: 6, y: 10 }];
  zcDir = { x: 1, y: 0 };
  zcNextDir = { x: 1, y: 0 };
  zcScore = 0;
  document.getElementById("snakescore").textContent = "0";
  zcPlaceFood();
  zcDrawSnake();
}
function zcPlaceFood() {
  var spotFree = false;
  while (!spotFree) {
    zcFood = { x: Math.floor(Math.random() * zcCells), y: Math.floor(Math.random() * zcCells) };
    spotFree = true;
    for (var p = 0; p < zcSnake.length; p++) {
      if (zcSnake[p].x === zcFood.x && zcSnake[p].y === zcFood.y) spotFree = false;
    }
  }
}
function zcDrawSnake() {
  zcPen.clearRect(0, 0, zcCanvas.width, zcCanvas.height);
  zcPen.fillStyle = "rgba(255,255,255,0.03)";
  for (var gx = 0; gx < zcCells; gx++) {
    for (var gy = 0; gy < zcCells; gy++) {
      if ((gx + gy) % 2 === 0) zcPen.fillRect(gx * zcCellSize, gy * zcCellSize, zcCellSize, zcCellSize);
    }
  }
  zcPen.fillStyle = "#ffffff";
  zcPen.font = Math.floor(zcCellSize * 0.95) + "px 'Russo One', sans-serif";
  zcPen.textAlign = "center";
  zcPen.textBaseline = "middle";
  zcPen.fillText("+", zcFood.x * zcCellSize + zcCellSize / 2, zcFood.y * zcCellSize + zcCellSize / 2 + 1);
  for (var s = 0; s < zcSnake.length; s++) {
    var segHue = (zcHueShift + s * 14) % 360;
    zcPen.fillStyle = "hsl(" + segHue + ", 90%, 55%)";
    zcPen.fillRect(zcSnake[s].x * zcCellSize + 1, zcSnake[s].y * zcCellSize + 1, zcCellSize - 2, zcCellSize - 2);
  }
}
function zcSnakeStep() {
  zcDir = zcNextDir;
  var headNow = zcSnake[0];
  var newHead = { x: headNow.x + zcDir.x, y: headNow.y + zcDir.y };
  var hitWall = newHead.x < 0 || newHead.y < 0 || newHead.x >= zcCells || newHead.y >= zcCells;
  var hitSelf = false;
  for (var q = 0; q < zcSnake.length - 1; q++) {
    if (zcSnake[q].x === newHead.x && zcSnake[q].y === newHead.y) hitSelf = true;
  }
  if (hitWall || hitSelf) {
    zcSnakeOver();
    return;
  }
  zcSnake.unshift(newHead);
  if (newHead.x === zcFood.x && newHead.y === zcFood.y) {
    zcScore++;
    document.getElementById("snakescore").textContent = zcScore;
    zcTone("square", 500 + zcScore * 15, 900 + zcScore * 15, 0.12, 0.15);
    if (zcScore > zcBest) {
      zcBest = zcScore;
      document.getElementById("snakebest").textContent = zcBest;
      try { localStorage.setItem("zplus_snake_best", String(zcBest)); } catch (err) {}
    }
    zcPlaceFood();
  } else {
    zcSnake.pop();
  }
  zcHueShift = (zcHueShift + 6) % 360;
  zcDrawSnake();
}
function zcSnakeOver() {
  clearInterval(zcSnakeLoop);
  zcSnakeLoop = null;
  zcSnakeAlive = false;
  zcTone("sawtooth", 220, 70, 0.5, 0.2);
  document.getElementById("snakehint").textContent = "Game over. Press any arrow to go again.";
}
function zcTurn(dirName) {
  if (!zcArcadeOn() || zcArcade !== "snake") return;
  var want = null;
  if (dirName === "up") want = { x: 0, y: -1 };
  if (dirName === "down") want = { x: 0, y: 1 };
  if (dirName === "left") want = { x: -1, y: 0 };
  if (dirName === "right") want = { x: 1, y: 0 };
  if (!want) return;
  if (!zcSnakeAlive) {
    zcResetSnake();
    zcSnakeAlive = true;
    zcNextDir = (want.x === -1) ? { x: 1, y: 0 } : want;
    document.getElementById("snakehint").textContent = "Eat the + signs. Don't hit the walls or yourself.";
    zcSnakeLoop = setInterval(zcSnakeStep, 110);
    return;
  }
  if (want.x === -zcDir.x && want.y === -zcDir.y) return;
  zcNextDir = want;
}
/* jstouhou tab, the game runs from its own github pages site (my-touhou) inside a frame */
var zcDanmakuUrl = "https://nonoppeonoonpoe.github.io/my-touhou/index.html?embed";
var zcArcade = "danmaku";
var zcArcadeTabs = document.querySelectorAll(".arcadetabs button");
function zcStopSnake() {
  if (zcSnakeLoop) clearInterval(zcSnakeLoop);
  zcSnakeLoop = null;
  zcSnakeAlive = false;
}
function zcStopDanmaku() {
  document.getElementById("danmakuframe").innerHTML = "";
}
function zcShowArcade(gameName) {
  zcArcade = gameName;
  for (var t = 0; t < zcArcadeTabs.length; t++) {
    zcArcadeTabs[t].classList.toggle("on", zcArcadeTabs[t].getAttribute("data-game") === gameName);
  }
  var isDanmaku = gameName === "danmaku";
  document.getElementById("snakepane").hidden = isDanmaku;
  document.getElementById("danmakupane").hidden = !isDanmaku;
  document.querySelector(".snakewin").classList.toggle("wide", isDanmaku);
  document.getElementById("arcadetitle").innerHTML = isDanmaku ? 'JS<span class="r">TOUHOU</span>' : 'Z-<span class="r">SNAKE</span>';
  if (isDanmaku) {
    zcStopSnake();
    var frameBox = document.getElementById("danmakuframe");
    if (!frameBox.firstChild) {
      var gameFrame = document.createElement("iframe");
      gameFrame.src = zcDanmakuUrl;
      gameFrame.title = "JSTouhou";
      gameFrame.setAttribute("scrolling", "no");
      gameFrame.setAttribute("allow", "autoplay");
      gameFrame.addEventListener("load", function () { try { gameFrame.contentWindow.focus(); } catch (err) {} });
      frameBox.appendChild(gameFrame);
    }
  } else {
    zcStopDanmaku();
    if (!zcSnakeAlive) {
      zcResetSnake();
      document.getElementById("snakehint").textContent = "Arrow keys or WASD. Press any arrow to start.";
    }
  }
}
for (var at = 0; at < zcArcadeTabs.length; at++) {
  zcArcadeTabs[at].addEventListener("click", function () { zcShowArcade(this.getAttribute("data-game")); });
}
var zcPadBtns = document.querySelectorAll(".pad button");
for (var pb = 0; pb < zcPadBtns.length; pb++) {
  zcPadBtns[pb].addEventListener("click", function () { zcTurn(this.getAttribute("data-dir")); });
}
document.addEventListener("keydown", function (ev) {
  if (!zcArcadeOn()) return;
  var keyName = ev.key;
  var dirName = null;
  if (keyName === "ArrowUp" || keyName === "w" || keyName === "W") dirName = "up";
  if (keyName === "ArrowDown" || keyName === "s" || keyName === "S") dirName = "down";
  if (keyName === "ArrowLeft" || keyName === "a" || keyName === "A") dirName = "left";
  if (keyName === "ArrowRight" || keyName === "d" || keyName === "D") dirName = "right";
  if (keyName === "Escape") { if (window.zcCloseSnake) zcCloseSnake(); return; }
  if (dirName && zcArcade === "snake") { ev.preventDefault(); zcTurn(dirName); }
});
