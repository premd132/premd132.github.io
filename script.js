const chart = document.getElementById("chart");
const svg = document.getElementById("lineLayer");
const patternList = document.getElementById("patternList");

let data = [];
let clicks = [];
let patterns = [];

/* CUT-ANK MAP */
const cutMap = {
  0:5,5:0, 1:6,6:1, 2:7,7:2, 3:8,8:3, 4:9,9:4
};

/* ========== CSV LOAD ========== */
document.getElementById("csvFile").addEventListener("change", e=>{
  const file=e.target.files[0];
  if(!file) return;
  const r=new FileReader();
  r.onload=ev=>parseCSV(ev.target.result);
  r.readAsText(file);
});

document.getElementById("resetBtn").onclick=()=>{
  clicks=[]; patterns=[];
  svg.innerHTML="";
  patternList.innerHTML="";
  document.querySelectorAll("td").forEach(td=>td.classList.remove("selected"));
};

/* ========== PARSE CSV ========== */
function parseCSV(text){
  data=text.trim().split("\n").map(r=>r.split(","));
  renderChart();
}

/* ========== RENDER CHART ========== */
function renderChart(){
  chart.innerHTML="";
  data.forEach((row,r)=>{
    const tr=document.createElement("tr");
    row.forEach((val,c)=>{
      const td=document.createElement("td");
      td.textContent=val;
      td.onclick=()=>cellClick(td,r,c,val);
      tr.appendChild(td);
    });
    chart.appendChild(tr);
  });
  resizeSVG();
}
function resizeSVG(){
  svg.setAttribute("width",chart.offsetWidth);
  svg.setAttribute("height",chart.offsetHeight);
}

/* ========== FAMILY + CUT ========== */
function family(j){
  const a=Math.floor(j/10), b=j%10;
  return [
    `${a}${b}`,`${b}${a}`,
    `${cutMap[a]}${cutMap[b]}`,
    `${cutMap[b]}${cutMap[a]}`
  ];
}

/* ========== CLICK ========== */
function cellClick(td,r,c,val){
  td.classList.add("selected");
  clicks.push({r,c,val,td});

  if(clicks.length>=2){
    drawUserLine(clicks);
    findExactPattern(); // 🔒 EXACT user pattern
  }
}

/* ========== DRAW REAL LINE ========== */
function drawUserLine(arr){
  if(arr.length<2) return;
  const p1=arr[arr.length-2];
  const p2=arr[arr.length-1];

  const x1=p1.td.offsetLeft+p1.td.offsetWidth/2;
  const y1=p1.td.offsetTop +p1.td.offsetHeight/2;
  const x2=p2.td.offsetLeft+p2.td.offsetWidth/2;
  const y2=p2.td.offsetTop +p2.td.offsetHeight/2;

  const l=document.createElementNS("http://www.w3.org/2000/svg","line");
  l.setAttribute("x1",x1); l.setAttribute("y1",y1);
  l.setAttribute("x2",x2); l.setAttribute("y2",y2);
  l.setAttribute("stroke","#1e7f2d");
  l.setAttribute("stroke-width","3");
  svg.appendChild(l);
}

/* ========== EXACT USER PATTERN SEARCH ========== */
function findExactPattern(){
  patterns=[]; patternList.innerHTML="";

  if(clicks.length<2) return;

  // calculate gaps from user drawing
  let rowGaps=[], colGaps=[];
  for(let i=1;i<clicks.length;i++){
    rowGaps.push(clicks[i].r - clicks[i-1].r);
    colGaps.push(clicks[i].c - clicks[i-1].c);
  }

  for(let br=0;br<data.length;br++){
    for(let bc=0;bc<data[0].length;bc++){
      let pts=[], ok=true;

      for(let i=0;i<clicks.length;i++){
        const rr = br + rowGaps.slice(0,i).reduce((a,b)=>a+b,0);
        const cc = bc + colGaps.slice(0,i).reduce((a,b)=>a+b,0);

        if(!data[rr] || !data[rr][cc] ||
           !family(Number(clicks[i].val)).includes(data[rr][cc])){
          ok=false; break;
        }
        pts.push({r:rr,c:cc,val:data[rr][cc]});
      }

      if(ok){
        patterns.push(pts);
      }
    }
  }

  renderPatternList();
}

/* ========== CHECK LINES ========== */
function renderPatternList(){
  patterns.forEach((p,i)=>{
    const d=document.createElement("div");
    d.className="pattern-item";
    d.textContent=`Pattern ${i+1}: ${p.map(x=>x.val).join(" → ")}`;
    d.onclick=()=>showPattern(p);
    patternList.appendChild(d);
  });
}

/* ========== POPUP (BOLD NUMBERS) ========== */
function showPattern(points){
  const popup=document.getElementById("popup");
  const canvas=document.getElementById("popupCanvas");
  const ctx=canvas.getContext("2d");

  const rows=new Set();
  points.forEach(p=>{
    rows.add(p.r);
    if(p.r+1<data.length) rows.add(p.r+1);
    if(p.r+2<data.length) rows.add(p.r+2);
  });
  const rowArr=[...rows].sort((a,b)=>a-b);

  const rowH=42, colW=72;
  canvas.width=data[0].length*colW+40;
  canvas.height=rowArr.length*rowH+40;

  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.font="bold 14px Arial";   // 🔥 BOLD numbers

  rowArr.forEach((r,ri)=>{
    data[r].forEach((v,c)=>{
      const x=20+c*colW;
      const y=20+ri*rowH;
      ctx.strokeRect(x,y,colW,rowH);
      ctx.fillText(v,x+colW/2-10,y+rowH/2+6);
    });
  });

  ctx.strokeStyle="#1e7f2d";
  ctx.lineWidth=3;

  points.forEach((p,i)=>{
    const ri=rowArr.indexOf(p.r);
    const cx=20+p.c*colW+colW/2;
    const cy=20+ri*rowH+rowH/2;

    ctx.beginPath();
    ctx.arc(cx,cy,9,0,Math.PI*2);
    ctx.stroke();

    if(i>0){
      const pr=points[i-1];
      const pri=rowArr.indexOf(pr.r);
      const px=20+pr.c*colW+colW/2;
      const py=20+pri*rowH+rowH/2;
      ctx.beginPath();
      ctx.moveTo(px,py);
      ctx.lineTo(cx,cy);
      ctx.stroke();
    }
  });

  popup.classList.remove("hidden");
}

/* ========== CLOSE POPUP ========== */
function closePopup(){
  document.getElementById("popup").classList.add("hidden");
}
