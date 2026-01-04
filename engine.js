const csv = document.getElementById("csv");
const grid = document.getElementById("grid");
const panel = document.getElementById("panel");
const cv = document.getElementById("cv");
const ctx = cv.getContext("2d");

let data = [];
let currentMode = "basic";
let clickTimer = null;

/* ================= MODE ================= */

function setMode(mode) {
  currentMode = mode;
  document.getElementById("modeLabel").innerText = mode.toUpperCase();
  ctx.clearRect(0, 0, cv.width, cv.height);
}

window.setMode = setMode;

/* ================= SAVE / LOAD ================= */

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

/* ================= CSV LOAD ================= */

csv.onchange = (e) => {
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

/* ================= GRID RENDER ================= */

function render() {
  grid.innerHTML = "";

  data.forEach((row, r) => {
    const tr = document.createElement("tr");

    row.forEach((val, c) => {
      const td = document.createElement("td");
      td.innerText = val || "";
      if (!val) td.classList.add("blank");

      let tapCount = 0;

      td.addEventListener("click", () => {
        tapCount++;
        if (tapCount === 1) {
          clickTimer = setTimeout(() => {
            tapCount = 0;
            if (!td.isContentEditable) {
              analyzeCell(r, c);
            }
          }, 300);
        }
      });

      td.addEventListener("dblclick", () => {
        clearTimeout(clickTimer);
        tapCount = 0;
        enableEdit(td, r, c);
      });

      td.addEventListener("touchstart", () => {
        tapCount++;
        if (tapCount === 2) {
          clearTimeout(clickTimer);
          tapCount = 0;
          enableEdit(td, r, c);
        } else {
          clickTimer = setTimeout(() => {
            tapCount = 0;
            analyzeCell(r, c);
          }, 300);
        }
      });

      tr.appendChild(td);
    });

    grid.appendChild(tr);
  });

  cv.width = grid.offsetWidth;
  cv.height = grid.offsetHeight;
}

/* ================= EDIT ================= */

function enableEdit(td, r, c) {
  td.contentEditable = "true";
  td.focus();

  td.onblur = () => {
    td.contentEditable = "false";
    data[r][c] = td.innerText.trim();
    saveData();
  };
}

/* ================= ANALYZE ================= */

function analyzeCell(r, c) {
  ctx.clearRect(0, 0, cv.width, cv.height);

  let result = null;

  if (currentMode === "basic") result = basicEngine(data, r, c);
  if (currentMode === "family") result = familyEngine(data, r, c);
  if (currentMode === "photo") result = photoEngine(data, r, c);
  if (currentMode === "hp80") result = hp80Engine(data, r, c);

  if (!result) {
    panel.innerHTML = "No pattern found";
    return;
  }

  draw(result.points);

  panel.innerHTML = `
    <b>Mode:</b> ${currentMode}<br><br>
    <b>Singles:</b><br>${result.topSingles.join(", ")}<br><br>
    <b>Final Jodi:</b><br>${result.jodi.join(", ")}
  `;
}

/* ================= DRAW ================= */

function draw(points) {
  points.forEach(p => {
    const cell = grid.rows[p.r].cells[p.c];
    const x = cell.offsetLeft + cell.offsetWidth / 2;
    const y = cell.offsetTop + cell.offsetHeight / 2;

    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.stroke();
  });
}

/* ================= ROW / CLEAR ================= */

function addRow() {
  data.push(["", "", "", "", "", ""]);
  render();
  saveData();
}

function clearGrid() {
  if (!confirm("Clear all data?")) return;
  data = [];
  saveData();
  render();
}

window.addRow = addRow;
window.clearGrid = clearGrid;

/* ================= INIT ================= */

if (data.length === 0) {
  for (let i = 0; i < 25; i++) {
    data.push(["", "", "", "", "", ""]);
  }
}

loadSaved();
render();
