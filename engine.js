const csv = document.getElementById("csv");
const grid = document.getElementById("grid");
const panel = document.getElementById("panel");
const cv = document.getElementById("cv");
const ctx = cv.getContext("2d");

let data = [];
let MODE = "basic";

// ===== MODE SWITCH =====
function setMode(m){
  MODE = m;
  panel.innerHTML = "<b>Mode:</b> "+m;
}

// ===== SAVE / LOAD =====
function save(){
  localStorage.setItem("final_data", JSON.stringify(data));
}

function load(){
  const d = localStorage.getItem("final_data");
  if(d){ data = JSON.parse(d); render(); }
}

// ===== CSV =====
csv.onchange = e=>{
  const r = new FileReader();
  r.onload = ()=>{
    data = r.result.trim().split("\n").map(r=>r.split(","));
    render();
    save();
  }
  r.readAsText(e.target.files[0]);
};

// ===== RENDER GRID =====
function render(){
  grid.innerHTML="";
  data.forEach((row,r)=>{
    const tr = document.createElement("tr");
    row.forEach((v,c)=>{
      const td = document.createElement("td");
      td.innerText = v;
      if(!v) td.classList.add("blank");

      // CLICK
      td.onclick = ()=> clickCell(r,c);

      // EDIT MODE
      td.ondblclick = ()=>{
        td.contentEditable=true;
        td.focus();
      };
      td.onblur = ()=>{
        td.contentEditable=false;
        data[r][c]=td.innerText.trim();
        save();
      };

      tr.appendChild(td);
    });
    grid.appendChild(tr);
  });
  cv.width = grid.offsetWidth;
  cv.height = grid.offsetHeight;
}

// ===== ADD ROW =====
function addRow(){
  data.push(["","","","","",""]);
  render(); save();
}

// ===== CLEAR =====
function clearAll(){
  if(confirm("Clear all?")){
    data=[];
    save();
    render();
  }
}

// ===== CELL CLICK =====
function clickCell(r,c){
  if(data[r][c]) return;

  ctx.clearRect(0,0,cv.width,cv.height);

  let res;
  if(MODE==="basic") res = basicEngine(data,r,c);
  if(MODE==="family") res = familyEngine(data,r,c);
  if(MODE==="photo") res = photoEngine(data,r,c);

  draw(res.points);
  panel.innerHTML = res.html;
}

// ===== DRAW =====
function draw(points){
  ctx.strokeStyle="red";
  ctx.beginPath();
  points.forEach(p=>{
    const td = grid.rows[p.r].cells[p.c];
    ctx.lineTo(td.offsetLeft+20, td.offsetTop+14);
  });
  ctx.stroke();
}

load();
