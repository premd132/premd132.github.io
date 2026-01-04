const grid = document.getElementById("grid");
const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext("2d");
const result = document.getElementById("result");

let data = [];
const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat"];

function resizeCanvas() {
  canvas.width = grid.offsetWidth;
  canvas.height = grid.offsetHeight;
}
window.onload = resizeCanvas;

document.getElementById("csvFile").addEventListener("change", e=>{
  const reader = new FileReader();
  reader.onload = () => {
    data = reader.result.trim().split("\n").map(r=>r.split(","));
    render();
  };
  reader.readAsText(e.target.files[0]);
});

function render(){
  grid.innerHTML = "";
  resizeCanvas();
  data.forEach((row,r)=>{
    const tr = document.createElement("tr");
    row.forEach((v,c)=>{
      const td = document.createElement("td");
      td.innerText = v || "";
      if(!v) td.classList.add("blank");
      td.onclick = ()=>cellClick(r,c);
      tr.appendChild(td);
    });
    grid.appendChild(tr);
  });
}

function addRow(){
  data.push(["","","","","",""]);
  render();
}

function clearGrid(){
  data=[];
  ctx.clearRect(0,0,canvas.width,canvas.height);
  render();
}

function cellClick(r,c){
  if(data[r][c]) return;

  ctx.clearRect(0,0,canvas.width,canvas.height);

  const pattern = analyzePattern(data,r,c);
  drawPattern(pattern);

  result.innerHTML = `
    <b>Check Lines</b><br>
    Pattern 1: ${pattern.line1.join(" → ")}<br>
    Pattern 2: ${pattern.line2.join(" → ")}<br>
    Pattern 3: ${pattern.line3.join(" → ")}<br><br>
    <b>Suggestion</b><br>
    ${pattern.suggestion.join(", ")}
  `;
}

function drawPattern(p){
  ctx.strokeStyle="red";
  ctx.lineWidth=2;

  p.points.forEach(pt=>{
    const td = grid.rows[pt.r].cells[pt.c];
    const x = td.offsetLeft + td.offsetWidth/2;
    const y = td.offsetTop + td.offsetHeight/2;

    ctx.beginPath();
    ctx.arc(x,y,12,0,Math.PI*2);
    ctx.stroke();
  });

  for(let i=0;i<p.points.length-1;i++){
    const a=p.points[i], b=p.points[i+1];
    const ta=grid.rows[a.r].cells[a.c];
    const tb=grid.rows[b.r].cells[b.c];
    ctx.beginPath();
    ctx.moveTo(ta.offsetLeft+27, ta.offsetTop+15);
    ctx.lineTo(tb.offsetLeft+27, tb.offsetTop+15);
    ctx.stroke();
  }
}
