/**************************************
 * PATTERN ENGINE – FINAL CORE FILE
 * engine.js
 **************************************/

const csv = document.getElementById("csv");
const grid = document.getElementById("grid");
const panel = document.getElementById("panel");
const cv = document.getElementById("cv");
const ctx = cv.getContext("2d");

let data = [];
let currentMode = "basic";

/* =========================
   MODE SWITCH
========================= */
function setMode(mode) {
  currentMode = mode;
  document.getElementById("modeLabel").innerText = mode.toUpperCase();
  panel.innerHTML =
    `<b>Mode:</b> ${mode.toUpperCase()}<br><br>` +
    `Blank cell पर click / double-click test करो`;
  ctx.clearRect(0, 0, cv.width, cv.height);
}

/* =========================
   SAVE / LOAD
========================= */
function saveData() {
  localStorage.setItem("pattern_data", JSON.stringify(data));
}

function loadSaved() {
  const saved = localStorage.getItem("pattern_data");
  if (saved) {
    data = JSON.parse(saved);
  }
}

/* =========================
   CSV LOAD
========================= */
csv.onchange = (e) => {
  const reader = new FileReader();
  reader.onload = () => {
    data = reader.result
      .trim()
      .split("\n")
      .map(r => r.split(","));
    saveData();
    render();
  };
  reader.readAsText(e.target.files[0]);
};

/* =========================
   GRID RENDER
========================= */
function render() {
  grid.innerHTML = "";

  data.forEach((row, r) => {
    const tr = document.createElement("tr");

    row.forEach((val, c) => {
      const td = document.createElement("td");
      td.innerText = val || "";

      if (!val) td.classList.add("blank");

      /* SINGLE CLICK → ANALYZE */
      td.onclick = () => clickCell(r, c);

      /* DOUBLE CLICK → EDIT */
      td.ondblclick = () => {
        td.contentEditable = true;
        td.focus();
      };

      /* BLUR → SAVE */
      td.onblur = () => {
        td.contentEditable = false;
        data[r][c] = td.innerText.trim();
        saveData();
      };

      tr.appendChild(td);
    });

    grid.appendChild(tr);
  });

  cv.width = grid.offsetWidth;
  cv.height = grid.offsetHeight;
}

/* =========================
   ADD ROW
========================= */
function addRow() {
  data.push(["", "", "", "", "", ""]);
  saveData();
  render();
}

/* =========================
   CLEAR GRID
========================= */
function clearGrid() {
  if (!confirm("Clear full data?")) return;
  localStorage.removeItem("pattern_data");
  data = [];
  initEmptyGrid();
}

/* =========================
   CLICK CELL → ENGINE
========================= */
function clickCell(r, c) {
  if (data[r][c]) return; // only blank cell

  ctx.clearRect(0, 0, cv.width, cv.height);

  let result = null;

  if (currentMode === "basic" && window.basicEngine)
    result = basicEngine(data, r, c);

  else if (currentMode === "family" && window.familyEngine)
    result = familyEngine(data, r, c);

  else if (currentMode === "photo" && window.photoEngine)
    result = photoEngine(data, r, c);

  else if (currentMode === "hp80" && window.hp80Engine)
    result = hp80Engine(data, r, c);

  if (!result) {
    panel.innerHTML = "<b>No pattern found</b>";
    return;
  }

  draw(result.points || []);

  panel.innerHTML =
    `<b>Mode:</b> ${currentMode.toUpperCase()}<br><br>` +
    `<b>Strong Singles:</b><br>${(result.singles || []).join(", ")}<br><br>` +
    `<b>Final Jodi:</b><br>${(result.jodi || []).join(", ")}`;
}

/* =========================
   DRAW PATTERN
========================= */
function draw(points) {
  points.forEach(p => {
    const cell = grid.rows[p.r]?.cells[p.c];
    if (!cell) return;

    const x = cell.offsetLeft + cell.offsetWidth / 2;
    const y = cell.offsetTop + cell.offsetHeight / 2;

    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.stroke();
  });
}

/* =========================
   INIT EMPTY GRID
========================= */
function initEmptyGrid() {
  data = [];
  for (let i = 0; i < 25; i++) {
    data.push(["", "", "", "", "", ""]);
  }
  saveData();
  render();
}

/* =========================
   FIRST LOAD
========================= */
window.onload = () => {
  loadSaved();
  if (!data || data.length === 0) {
    initEmptyGrid();
  } else {
    render();
  }
};

/* =========================
   EXPOSE BUTTON FUNCTIONS
========================= */
window.setMode = setMode;
window.addRow = addRow;
window.clearGrid = clearGrid;
