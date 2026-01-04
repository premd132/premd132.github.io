const grid = document.getElementById("grid");
const csv = document.getElementById("csv");
const panel = document.getElementById("panel");
const cv = document.getElementById("cv");
const ctx = cv.getContext("2d");

let data = [];
let currentMode = "basic";

/* -------- MODE -------- */
function setMode(m){
  currentMode = m;
  document.getElementById("modeLabel").innerText = m.toUpperCase();
  ctx.clearRect(0,0,cv.width,cv.height);
}
window.setMode = setMode;

/* -------- CSV LOAD -------- */
csv.onchange = e =>{
  const r = new FileReader();
  r.onload = ()=>{
    data = r.result.trim().split("\n").map(r=>r.split(","));
    saveData();
    render();
  };
  r.readAsText(e.target.files[0]);
};

/* -------- SAVE / LOAD -------- */
function saveData(){
  localStorage.setItem("pattern_data",JSON.stringify(data));
}
function loadData(){
  const s = localStorage.getItem("pattern_data");
  if(s){
    data = JSON.parse(s);
    render();
  }
}

/* -------- GRID -------- */
function render(){
  grid.innerHTML="";
  data.forEach((row,r)=>{
    const tr=document.createElement("tr");
    row.forEach((val,c)=>{
      const td=document.createElement("td");
      td.innerText = val || "";
      if(!val) td.classList.add("blank");

      // click = analysis
      td.onclick=()=>clickCell(r,c);

      // ✅ DOUBLE CLICK = EDIT
      td.ondblclick=()=>{
        td.contentEditable=true;
        td.focus();
      };

      td.onblur=()=>{
        td.contentEditable=false;
        data[r][c]=td.innerText.trim();
        saveData();
      };

      tr.appendChild(td);
    });
    grid.appendChild(tr);
  });

  cv.width = grid.offsetWidth;
  cv.height = grid.offsetHeight;
}

function addRow(){
  data.push(["","","","","",""]);
  saveData();
  render();
}
window.addRow = addRow;

function clearGrid(){
  data=[];
  saveData();
  render();
}
window.clearGrid = clearGrid;

/* -------- ANALYSIS -------- */
function clickCell(r,c){
  if(data[r][c]) return;

  ctx.clearRect(0,0,cv.width,cv.height);

  let res=null;
  if(currentMode==="basic") res = basicEngine(data,r,c);
  if(currentMode==="family") res = familyEngine(data,r,c);
  if(currentMode==="photo") res = photoEngine(data,r,c);
  if(currentMode==="hp80") res = hp80Engine(data,r,c);

  if(!res){
    panel.innerHTML="No pattern found";
    return;
  }

  draw(res.points);

  panel.innerHTML =
    `<b>Mode:</b> ${currentMode}<br><br>
     <b>Singles:</b> ${res.singles.join(", ")}<br><br>
     <b>Final Jodi:</b><br>${res.jodi.join(", ")}`;
}

/* -------- DRAW -------- */
function draw(points){
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

/* INIT */
loadData();
if(data.length===0){
  for(let i=0;i<25;i++) data.push(["","","","","",""]);
  render();
}
