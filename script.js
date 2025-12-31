const chart = document.getElementById("chart");
const svg = document.getElementById("lineLayer");
const patternList = document.getElementById("patternList");

let data = [];
let clicks = [];
let patterns = [];

/* CUT-ANK MAP */
const cutMap = {
  0:5, 5:0,
  1:6, 6:1,
  2:7, 7:2,
  3:8, 8:3,
  4:9, 9:4
};

document.getElementById("csvFile").addEventListener("change", e=>{
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = ev => parseCSV(ev.target.result);
  reader.readAsText(file);
});

document.getElementById("resetBtn").onclick = ()=>{
  clicks = [];
  patterns = [];
  svg.innerHTML = "";
  patternList.innerHTML = "";
  document.querySelectorAll("td").forEach(td=>td.classList.remove("selected"));
};

/* ---------- CSV ---------- */
function parseCSV(text){
  data = text.trim().split("\n").map(r=>r.split(","));
  renderChart();
}

function renderChart(){
  chart.innerHTML = "";
  data.forEach((row,r)=>{
    const tr = document.createElement("tr");
    row.forEach((val,c)=>{
      const td = document.createElement("td");
      td.textContent = val;
      td.onclick = ()=>cellClick(td,r,c,val);
      tr.appendChild(td);
    });
    chart.appendChild(tr);
  });
  resizeSVG();
}

function resizeSVG(){
  svg.setAttribute("width", chart.offsetWidth);
  svg.setAttribute("height", chart.offsetHeight);
}

/* ---------- CLICK ---------- */
function cellClick(td,r,c,val){
  td.classList.add("selected");
  clicks.push({ r, c, val, td });

  if(clicks.length >= 2){
    drawUserLine();     // REAL chart par line
    detectPattern();   // pattern find
  }
}

/* ---------- FAMILY + CUT-ANK ---------- */
function family(j){
  const a = Math.floor(j/10);
  const b = j % 10;
  return [
    `${a}${b}`,
    `${b}${a}`,
    `${cutMap[a]}${cutMap[b]}`,
    `${cutMap[b]}${cutMap[a]}`
  ];
}

/* ---------- AUTO PATTERN ---------- */
function detectPattern(){
  const fam = family(Number(clicks[0].val));
  const seq = clicks.map(x=>Number(x.val));

  const matches = [];
  data.forEach((row,r)=>{
    row.forEach((v,c)=>{
      if(fam.includes(v)){
        matches.push({ r, c, val:v });
      }
    });
  });

  if(matches.length >= 2){
    const id = patterns.length + 1;
    patterns.push({ id, seq, points: matches });
    addPatternUI(id, seq, matches);
  }
}

/* ---------- UI LIST ---------- */
function addPatternUI(id, seq, points){
  const div = document.createElement("div");
  div.className = "pattern-item";
  div.textContent = `Pattern ${id}: ${seq.join(" → ")}`;
  div.onclick = ()=>showPattern(points);
  patternList.appendChild(div);
}

/* ---------- DRAW ON REAL CHART ---------- */
function drawUserLine(){
  if(clicks.length < 2) return;

  const p1 = clicks[clicks.length-2];
  const p2 = clicks[clicks.length-1];

  const x1 = p1.td.offsetLeft + p1.td.offsetWidth/2;
  const y1 = p1.td.offsetTop  + p1.td.offsetHeight/2;
  const x2 = p2.td.offsetLeft + p2.td.offsetWidth/2;
  const y2 = p2.td.offsetTop  + p2.td.offsetHeight/2;

  const l = document.createElementNS("http://www.w3.org/2000/svg","line");
  l.setAttribute("x1", x1);
  l.setAttribute("y1", y1);
  l.setAttribute("x2", x2);
  l.setAttribute("y2", y2);
  l.setAttribute("stroke", "#1e7f2d");
  l.setAttribute("stroke-width", "3");
  svg.appendChild(l);
}

/* ---------- POPUP (PATTERN + 1 EXTRA ROW) ---------- */
function showPattern(points){
  const popup = document.getElementById("popup");
  const canvas = document.getElementById("popupCanvas");
  const ctx = canvas.getContext("2d");

  // rows to show = pattern rows + 1 niche wali
  const rows = new Set();
  points.forEach(p=>{
    rows.add(p.r);
    if(p.r + 1 < data.length) rows.add(p.r + 1);
  });
  const rowArr = Array.from(rows).sort((a,b)=>a-b);

  // layout
  const rowH = 40;
  const colW = 70;
  canvas.width  = data[0].length * colW + 40;
  canvas.height = rowArr.length * rowH + 40;

  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.font = "12px Arial";

  // draw table cells
  rowArr.forEach((r,ri)=>{
    data[r].forEach((v,c)=>{
      const x = 20 + c*colW;
      const y = 20 + ri*rowH;
      ctx.strokeRect(x,y,colW,rowH);
      ctx.fillText(v, x+colW/2-8, y+rowH/2+4);
    });
  });

  // draw same pattern line (mini version)
  ctx.strokeStyle = "#1e7f2d";
  ctx.lineWidth = 3;
  points.forEach((p,i)=>{
    const ri = rowArr.indexOf(p.r);
    const cx = 20 + p.c*colW + colW/2;
    const cy = 20 + ri*rowH + rowH/2;

    ctx.beginPath();
    ctx.arc(cx,cy,8,0,Math.PI*2);
    ctx.stroke();

    if(i>0){
      const prev = points[i-1];
      const pri = rowArr.indexOf(prev.r);
      const px = 20 + prev.c*colW + colW/2;
      const py = 20 + pri*rowH + rowH/2;
      ctx.beginPath();
      ctx.moveTo(px,py);
      ctx.lineTo(cx,cy);
      ctx.stroke();
    }
  });

  popup.classList.remove("hidden");
}

/* ---------- CLOSE POPUP ---------- */
function closePopup(){
  document.getElementById("popup").classList.add("hidden");
}
