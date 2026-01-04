const csv = document.getElementById("csv");
const grid = document.getElementById("grid");
const panel = document.getElementById("panel");
const cv = document.getElementById("cv");
const ctx = cv.getContext("2d");

let data = [];
let currentMode = "basic";

/* ===== MODE ===== */
function setMode(mode){
  currentMode = mode;
  document.getElementById("modeLabel").innerText = mode.toUpperCase();
  ctx.clearRect(0,0,cv.width,cv.height);
}

/* ===== SAVE / LOAD ===== */
function saveData(){
  localStorage.setItem("pattern_data", JSON.stringify(data));
}

function loadSaved(){
  const s = localStorage.getItem("pattern_data");
  if(s){
    data = JSON.parse(s);
    render();
  }
}

/* ===== CSV LOAD ===== */
csv.onchange = e =>{
  const r = new FileReader();
  r.onload = ()=>{
    data = r.result.trim().split("\n").map(r=>r.split(","));
    render();
    saveData();
  };
  r.readAsText(e.target.files[0]);
};

/* ===== RENDER GRID ===== */
function render(){
  grid.innerHTML = "";
  data.forEach((row,r)=>{
    const tr = document.createElement("tr");
    row.forEach((val,c)=>{
      const td = document.createElement("td");
      td.innerText = val || "";
      if(!val) td.classList.add("blank");

      /* single click = analysis */
      td.onclick = ()=> clickCell(r,c);

      /* double tap = edit */
      /* CLICK */
td.onclick = ()=>{
  if(!data[r][c]) {
    // blank = analysis
    clickCell(r,c);
  } else {
    // filled = edit
    td.contentEditable = true;
    td.focus();
  }
};
      };

      /* save after edit */
      td.onblur = ()=>{
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

/* ===== ADD ROW ===== */
function addRow(){
  data.push(["","","","","",""]);
  render();
  saveData();
}

/* ===== CLEAR ===== */
function clearGrid(){
  data = [];
  initGrid();
  saveData();
  ctx.clearRect(0,0,cv.width,cv.height);
}

/* ===== CLICK CELL ===== */
function clickCell(r,c){
  if(data[r][c]) return; // only blank

  ctx.clearRect(0,0,cv.width,cv.height);
  let result = null;

  if(currentMode==="basic") result = basicEngine(data,r,c);
  if(currentMode==="family") result = familyEngine(data,r,c);
  if(currentMode==="photo") result = photoEngine(data,r,c);
  if(currentMode==="hp80") result = hp80Engine(data,r,c);

  if(!result){
    panel.innerHTML="No pattern";
    return;
  }

  draw(result.points);

  panel.innerHTML =
    `<b>Mode:</b> ${currentMode}<br><br>
     <b>Strong Singles:</b><br>${result.singles.join(" ")}<br><br>
     <b>Final Jodi:</b><br>${result.jodi.join(" ")}`;
}

/* ===== DRAW ===== */
function draw(points){
  ctx.clearRect(0,0,cv.width,cv.height);
  points.forEach(p=>{
    const cell = grid.rows[p.r].cells[p.c];
    const x = cell.offsetLeft + cell.offsetWidth/2;
    const y = cell.offsetTop + cell.offsetHeight/2;
    ctx.beginPath();
    ctx.arc(x,y,10,0,Math.PI*2);
    ctx.strokeStyle="red";
    ctx.lineWidth=2;
    ctx.stroke();
  });
}

/* ===== INIT ===== */
function initGrid(){
  data=[];
  for(let i=0;i<25;i++){
    data.push(["","","","","",""]);
  }
  render();
}

loadSaved();
if(data.length===0) initGrid();

window.setMode=setMode;
window.addRow=addRow;
window.clearGrid=clearGrid;
