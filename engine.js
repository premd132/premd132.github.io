/**********************
 CORE ENGINE – FINAL
**********************/

const csv = document.getElementById("csv");
const grid = document.getElementById("grid");
const panel = document.getElementById("panel");
const cv = document.getElementById("cv");
const ctx = cv.getContext("2d");

let data = [];
let currentMode = "basic";

/* =====================
   MODE SWITCH
===================== */
function setMode(mode) {
  currentMode = mode;
  document.getElementById("modeLabel").innerText = mode.toUpperCase();
  panel.innerHTML = `<b>Mode:</b> ${mode.toUpperCase()}<br>Blank cell पर click करो`;
  ctx.clearRect(0,0,cv.width,cv.height);
}

/* =====================
   SAVE / LOAD
===================== */
function saveData() {
  localStorage.setItem("pattern_data", JSON.stringify(data));
}

function loadSaved() {
  const saved = localStorage.getItem("pattern_data");
  if (saved) {
    data = JSON.parse(saved);
    render();
  }
}

/* =====================
   CSV LOAD
===================== */
csv.onchange = e => {
  const reader = new FileReader();
  reader.onload = () => {
    data = reader.result
      .trim()
      .split("\n")
      .map(r => r.split(","));
    render();
    saveData();
  };
  reader.readAsText(e.target.files[0]);
};

/* =====================
   GRID RENDER
===================== */
function render() {
  grid.innerHTML = "";

  data.forEach((row, r) => {
    const tr = document.createElement("tr");

    row.forEach((val, c) => {
      const td = document.createElement("td");
      td.innerText = val || "";

      if (!val) td.classList.add("blank");

      /* CLICK = ANALYZE */
      td.onclick = () => clickCell(r, c);

      /* DOUBLE CLICK = EDIT */
      td.ondblclick = () => {
        td.contentEditable = true;
        td.focus();
      };

      /* BLUR = SAVE */
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

/* =====================
   ADD ROW
===================== */
function addRow() {
  if (data.length === 0) return;
  data.push(new Array(data[0].length).fill(""));
  render();
  saveData();
}

/* =====================
   CLEAR
===================== */
function clearGrid() {
  if (!confirm("Clear all data?")) return;
  data = [];
  saveData();
  render();
  panel.innerHTML = "Cleared";
  ctx.clearRect(0,0,cv.width,cv.height);
}

/* =====================
   CELL CLICK HANDLER
===================== */
function clickCell(r, c) {
  if (data[r][c]) return; // only blank cell

  ctx.clearRect(0,0,cv.width,cv.height);

  let result = null;

  if (currentMode === "basic") {
    result = basicEngine(data, r, c);
  }
  else if (currentMode === "family") {
    result = familyEngine(data, r, c);
  }
  else if (currentMode === "photo") {
    result = photoEngine(data, r, c);
  }
  else if (currentMode === "hp80") {
    result = hp80Engine(data, r, c);
  }

  if (!result) {
    panel.innerHTML = "No pattern found";
    return;
  }

  draw(result.points);

  panel.innerHTML = `
    <b>Mode:</b> ${currentMode}<br><br>
    <b>Strong Singles:</b><br>${result.singles.join(", ")}<br><br>
    <b>Final Jodi:</b><br>${result.jodi.join(", ")}
  `;
}

/* =====================
   DRAW PATTERN
===================== */
function draw(points) {
  points.forEach(p => {
    const cell = grid.rows[p.r].cells[p.c];
    const x = cell.offsetLeft + cell.offsetWidth / 2;
    const y = cell.offsetTop + cell.offsetHeight / 2;

    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.stroke();
  });
}
window.setMode = setMode;
window.addRow = addRow;
window.clearGrid = clearGrid;
/* LOAD SAVED ON START */
loadSaved();
// ===== INIT GRID ON LOAD =====
function initEmptyGrid(rows = 30, cols = 6) {
  data = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) row.push("");
    data.push(row);
  }
  render();
}

// First time load
if (data.length === 0) {
  initEmptyGrid();
}
// ================= FORCE GRID INIT =================
function forceInit() {
  if (!data || data.length === 0) {
    data = [];
    for (let i = 0; i < 25; i++) {
      data.push(["", "", "", "", "", ""]);
    }
  }
  render();
}

// Run on load
setTimeout(forceInit, 100);
