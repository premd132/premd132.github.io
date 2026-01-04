const csv = document.getElementById("csv");
const grid = document.getElementById("grid");
const cv = document.getElementById("cv");
const ctx = cv.getContext("2d");
const panel = document.getElementById("panel");

let data = [];
let MODE = "basic"; // 👈 DEFAULT MODE

/* ================= MODE SWITCH ================= */
function setMode(m){
  MODE = m;
  panel.innerHTML = `<b>Mode Selected:</b> ${m}<br>Blank cell par click karo`;
}

/* ================= SAVE / LOAD ================= */
function saveData(){
  localStorage.setItem("pattern_data", JSON.stringify(data));
}

function loadSaved(){
  const saved = localStorage.getItem("pattern_data");
  if(saved){
    data = JSON.parse(saved);
    render();
  }
}

/* ================= CSV UPLOAD ================= */
csv.onchange = e=>{
  const r = new FileReader();
  r.onload = ()=>{
    data = r.result.trim().split("\n").map(l=>l.split(","));
    render();
    saveData();
  };
  r.readAsText(e.target.files[0]);
};

/* ================= RENDER GRID ================= */
function render(){
  grid.innerHTML="";

  data.forEach((row,r)=>{
    const tr=document.createElement("tr");

    row.forEach((val,c)=>{
      const td=document.createElement("td");
      td.innerText = val || "";
      td.dataset.r = r;
      td.dataset.c = c;

      if(!val || val==="**") td.classList.add("blank");

      /* CLICK → pattern */
      td.onclick = ()=> clickCell(r,c);

      /* EDIT (mobile + desktop) */
      let pressTimer;
      td.addEventListener("touchstart",()=>{
        pressTimer = setTimeout(()=>enableEdit(td),500);
      });
      td.addEventListener("touchend",()=>clearTimeout(pressTimer));
      td.addEventListener("dblclick",()=>enableEdit(td));

      tr.appendChild(td);
    });

    grid.appendChild(tr);
  });

  cv.width = grid.offsetWidth;
  cv.height = grid.offsetHeight;
}

/* ================= ENABLE EDIT ================= */
function enableEdit(td){
  td.contentEditable = true;
  td.focus();

  td.onblur = ()=>{
    td.contentEditable = false;
    const r = td.dataset.r;
    const c = td.dataset.c;
    data[r][c] = td.innerText.trim();
    saveData();
  };
}

/* ================= ADD ROW ================= */
function addRow(){
  data.push(["","","","","",""]);
  render();
  saveData();
}

/* ================= CLICK CELL ================= */
function clickCell(r,c){
  if(data[r][c]) return; // only blank cell

  ctx.clearRect(0,0,cv.width,cv.height);

  let res;

  if(MODE==="basic"){
    res = basicEngine(data,r,c);
  }
  else if(MODE==="family"){
    res = familyEngine(data,r,c);
  }
  else if(MODE==="photo"){
    res = photoEngine(data,r,c);
  }

  draw(res.points);
  panel.innerHTML = res.html;
}

/* ================= DRAW ================= */
function draw(points){
  if(!points) return;
  ctx.strokeStyle="red";
  ctx.lineWidth=2;

  points.forEach((p,i)=>{
    const td = grid.rows[p.r].cells[p.c];
    const x = td.offsetLeft + td.offsetWidth/2;
    const y = td.offsetTop + td.offsetHeight/2;

    ctx.beginPath();
    ctx.arc(x,y,10,0,Math.PI*2);
    ctx.stroke();

    if(i>0){
      const pr = points[i-1];
      const td2 = grid.rows[pr.r].cells[pr.c];
      ctx.beginPath();
      ctx.moveTo(td2.offsetLeft+td2.offsetWidth/2,
                 td2.offsetTop+td2.offsetHeight/2);
      ctx.lineTo(x,y);
      ctx.stroke();
    }
  });
}

/* ================= INIT ================= */
loadSaved();
