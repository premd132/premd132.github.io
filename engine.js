const csv = document.getElementById("csv");
const grid = document.getElementById("grid");
const cv = document.getElementById("cv");
const ctx = cv.getContext("2d");
const panel = document.getElementById("panel");

let data = [];

/* ---------------- SAVE / LOAD ---------------- */
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

/* ---------------- CSV UPLOAD ---------------- */
csv.onchange = (e) => {
  const r = new FileReader();
  r.onload = () => {
    data = r.result.trim().split("\n").map(l => l.split(","));
    render();
    saveData();
  };
  r.readAsText(e.target.files[0]);
};

/* ---------------- RENDER GRID ---------------- */
function render() {
  grid.innerHTML = "";

  data.forEach((row, r) => {
    const tr = document.createElement("tr");

    row.forEach((val, c) => {
      const td = document.createElement("td");
      td.innerText = val || "";
      td.dataset.r = r;
      td.dataset.c = c;

      if (!val || val === "**") td.classList.add("blank");

      /* ---------- CLICK (pattern) ---------- */
      td.addEventListener("click", () => clickCell(r, c));

      /* ---------- EDIT MODE (MOBILE + PC) ---------- */
      let pressTimer;

      td.addEventListener("touchstart", () => {
        pressTimer = setTimeout(() => enableEdit(td), 500);
      });

      td.addEventListener("touchend", () => clearTimeout(pressTimer));

      td.addEventListener("dblclick", () => enableEdit(td));

      tr.appendChild(td);
    });

    grid.appendChild(tr);
  });

  cv.width = grid.offsetWidth;
  cv.height = grid.offsetHeight;
}

/* ---------------- ENABLE EDIT ---------------- */
function enableEdit(td) {
  td.contentEditable = true;
  td.classList.add("editing");
  td.focus();

  const range = document.createRange();
  range.selectNodeContents(td);
  range.collapse(false);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);

  td.onblur = () => {
    td.contentEditable = false;
    td.classList.remove("editing");

    const r = td.dataset.r;
    const c = td.dataset.c;
    data[r][c] = td.innerText.trim();
    saveData();
  };
}

/* ---------------- ADD ROW ---------------- */
function addRow() {
  data.push(["", "", "", "", "", ""]);
  render();
  saveData();
}

/* ---------------- CLEAR ---------------- */
function clearGrid() {
  if (!confirm("Clear all data?")) return;
  data = [];
  saveData();
  render();
}

/* ---------------- CLICK CELL (PATTERN) ---------------- */
function clickCell(r, c) {
  ctx.clearRect(0, 0, cv.width, cv.height);

  const res = detectPattern(data, r, c);

  panel.innerHTML =
    `<b>Pattern Found</b><br>
     Strong Singles: ${res.topSingles.join(", ")}<br><br>
     <b>Final 8 Jodi</b><br>
     ${res.jodi.join(", ")}`;
}

/* ---------------- INIT ---------------- */
loadSaved();
