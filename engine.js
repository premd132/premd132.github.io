// ================= ELEMENTS =================
const csv = document.getElementById("csv");
const grid = document.getElementById("grid");
const panel = document.getElementById("panel");
const cv = document.getElementById("cv");
const ctx = cv.getContext("2d");

// ================= STATE =================
let data = [];
let currentMode = "basic";
let editMode = false;

// ================= MODE =================
function setMode(mode) {
  currentMode = mode;
  document.getElementById("modeLabel").innerText = mode.toUpperCase();
  ctx.clearRect(0, 0, cv.width, cv.height);
}
window.setMode = setMode;

// ================= EDIT MODE =================
function toggleEdit() {
  editMode = !editMode;
  alert(editMode ? "Edit Mode ON" : "Edit Mode OFF");
}
window.toggleEdit = toggleEdit;

// ================= SAVE / LOAD =================
function saveData() {
  localStorage.setItem("pattern_data", JSON.stringify(data));
}

function loadSaved() {
  const saved = localStorage.getItem("pattern_data");
  if (saved) {
    try {
      data = JSON.parse(saved);
    } catch (e) {
      data = [];
    }
  }
}

// ================= MANUAL SAVE =================
function manualSave() {
  saveData();
  alert("Data Saved Successfully ✅");
}
window.manualSave = manualSave;

// ================= CSV LOAD =================
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

// ================= RENDER GRID =================
function render() {
  grid.innerHTML = "";

  data.forEach((row, r) => {
    const tr = document.createElement("tr");

    row.forEach((val, c) => {
      const td = document.createElement("td");
      td.innerText = val || "";
      if (!val) td.classList.add("blank");

      td.onclick = () => {
        if (editMode) {
          td.contentEditable = true;
          td.focus();
        } else {
          if (!data[r][c]) {
            clickCell(r, c);
          }
        }
      };

      td.onblur = () => {
        if (editMode) {
          td.contentEditable = false;
          data[r][c] = td.innerText.trim();
          saveData();
        }
      };

      tr.appendChild(td);
    });

    grid.appendChild(tr);
  });

  cv.width = grid.offsetWidth;
  cv.height = grid.offsetHeight;
}

// ================= ADD / DELETE ROW =================
function addRow() {
  data.push(["", "", "", "", "", ""]);
  saveData();
  render();
}
window.addRow = addRow;

function deleteLastRow() {
  if (data.length === 0) return;
  if (confirm("Last row delete kare?")) {
    data.pop();
    saveData();
    render();
  }
}
window.deleteLastRow = deleteLastRow;

// ================= CLEAR =================
function clearGrid() {
  if (!confirm("Clear full grid?")) return;
  data = [];
  localStorage.removeItem("pattern_data");
  initEmptyGrid();
}
window.clearGrid = clearGrid;

// ================= ANALYSIS =================
function clickCell(r, c) {
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

  panel.innerHTML =
    `<b>Mode:</b> ${currentMode.toUpperCase()}<br><br>` +
    `<b>Singles:</b><br>${result.singles.join(" ")}<br><br>` +
    `<b>Final Jodi:</b><br>${result.jodi.join(" ")}`;
}

// ================= DRAW =================
function draw(points) {
  ctx.clearRect(0, 0, cv.width, cv.height);

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

// ================= INIT GRID =================
function initEmptyGrid(rows = 25, cols = 6) {
  data = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) row.push("");
    data.push(row);
  }
  saveData();
  render();
}

// ================= START (IMPORTANT) =================
loadSaved();
if (data.length === 0) {
  initEmptyGrid();
} else {
  render();
}
