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
  reader.onload = ev=>{
    parseCSV(ev.target.result);
  };
  reader.readAsText(file);
});

document.getElementById("resetBtn").onclick = ()=>{
  clicks = [];
  patterns = [];
  svg.innerHTML = "";
  patternList.innerHTML = "";
  document.querySelectorAll("td").forEach(td=>td.classList.remove("selected"));
};

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

function cellClick(td,r,c,val){
  td.classList.add("selected");
  clicks.push({r,c,val,td});

  if(clicks.length>=2){
    detectPattern();
    drawUserLine();
  }
}

function family(j){
  const a = Math.floor(j/10);
  const b = j%10;
  return [
    `${a}${b}`,
    `${b}${a}`,
    `${cutMap[a]}${cutMap[b]}`,
    `${cutMap[b]}${cutMap[a]}`
  ];
}

function detectPattern(){
  const fam = family(Number(clicks[0].val));
  const seq = clicks.map(x=>Number(x.val));

  const matches = [];
  data.forEach((row,r)=>{
    row.forEach((v,c)=>{
      if(fam.includes(v)){
        matches.push({r,c,val:v});
      }
    });
  });

  if(matches.length>=2){
    const id = patterns.length+1;
    patterns.push({id, seq, matches});
    addPatternUI(id,seq);
  }
}

function addPatternUI(id,seq){
  const div = document.createElement("div");
  div.className="pattern-item";
  div.textContent=`Pattern ${id}: ${seq.join(" → ")}`;
  div.onclick = ()=>showPattern(id);
  patternList.appendChild(div);
}

function drawUserLine(){
  if(clicks.length<2) return;
  const p1 = clicks[clicks.length-2];
  const p2 = clicks[clicks.length-1];

  const l = document.createElementNS("http://www.w3.org/2000/svg","line");
  l.setAttribute("x1",p1.td.offsetLeft+30);
  l.setAttribute("y1",p1.td.offsetTop+20);
  l.setAttribute("x2",p2.td.offsetLeft+30);
  l.setAttribute("y2",p2.td.offsetTop+20);
  l.setAttribute("stroke","green");
  l.setAttribute("stroke-width","3");
  svg.appendChild(l);
}

function showPattern(id){
  const pat = patterns.find(p=>p.id===id);
  const canvas = document.getElementById("popupCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0,0,400,300);

  ctx.strokeStyle="green";
  ctx.lineWidth=3;

  pat.seq.forEach((v,i)=>{
    const x = 60+i*100;
    const y = 150-i*30;
    ctx.beginPath();
    ctx.arc(x,y,10,0,Math.PI*2);
    ctx.stroke();
    ctx.fillText(v,x-6,y-15);
    if(i>0){
      ctx.beginPath();
      ctx.moveTo(60+(i-1)*100,150-(i-1)*30);
      ctx.lineTo(x,y);
      ctx.stroke();
    }
  });

  document.getElementById("popup").classList.remove("hidden");
}

function closePopup(){
  document.getElementById("popup").classList.add("hidden");
}
