const DAYS=["Mon","Tue","Wed","Thu","Fri","Sat"];
let grid=[];

/* ---------- helpers ---------- */
function log(msg){
  const l=document.getElementById("log");
  l.innerHTML+=msg+"<br>";
  l.scrollTop=l.scrollHeight;
}

/* ---------- generate ---------- */
function generate(){
  grid=[];
  const raw=document.getElementById("dataInput").value.trim().split("\n");
  raw.forEach(r=>{
    let row=r.trim().split(/\s+/);
    while(row.length<6) row.push("**");
    grid.push(row);
  });
  drawTable();
  resizeCanvas();
  log("Data loaded: "+grid.length+" rows");
}

/* ---------- draw table ---------- */
function drawTable(){
  const t=document.getElementById("chart");
  t.innerHTML="";
  let tr=document.createElement("tr");
  DAYS.forEach(d=>{
    let th=document.createElement("th");
    th.textContent=d;
    tr.appendChild(th);
  });
  t.appendChild(tr);

  grid.forEach((r,ri)=>{
    let tr=document.createElement("tr");
    r.forEach((v,ci)=>{
      let td=document.createElement("td");
      td.textContent=v;
      td.dataset.r=ri;
      td.dataset.c=ci;
      if(v==="**"){
        td.classList.add("blank");
        td.onclick=()=>blankClick(ri,ci);
      }
      tr.appendChild(td);
    });
    t.appendChild(tr);
  });
}

/* ---------- FLOW FORMULAS ---------- */
function flowOf(j){
  let a=parseInt(j[0]), b=parseInt(j[1]);
  return {
    cut: Math.abs(a-b),
    sum:(a+b)%10,
    rise: (a+b)>=10 ? 1:0,
    fam:[a,b,(a+5)%10,(b+5)%10]
  };
}

function rowFlow(row){
  let f=[];
  row.forEach(v=>{
    if(v==="**") f.push("X");
    else{
      let o=flowOf(v);
      f.push(o.cut+"-"+o.sum+"-"+o.rise);
    }
  });
  return f.join("|");
}

/* ---------- BLANK CLICK ---------- */
function blankClick(r,c){
  clearMarks();
  clearCanvas();
  document.getElementById("aiBox").innerHTML="";
  log("Blank click @ row "+r+" col "+c);

  let depth=9;
  let base=[];
  for(let i=r-1;i>=0 && base.length<depth;i--){
    if(grid[i][c]!=="**"){
      base.push(rowFlow(grid[i]));
    }
  }

  if(base.length<4){
    log("Pattern too small");
    return;
  }

  searchFlow(base,c);
}

/* ---------- SEARCH SAME FLOW ---------- */
function searchFlow(pattern,col){
  let aiCount={};
  for(let i=0;i<=grid.length-pattern.length;i++){
    let ok=true;
    for(let k=0;k<pattern.length;k++){
      if(rowFlow(grid[i+k])!==pattern[k]){
        ok=false; break;
      }
    }
    if(ok){
      markBlock(i,pattern.length,col);
      drawLine(i,i+pattern.length-1,col);
      let next=i+pattern.length;
      if(grid[next] && grid[next][col]!=="**"){
        aiCount[grid[next][col]]=(aiCount[grid[next][col]]||0)+1;
      }
    }
  }
  showAI(aiCount,col);
}

/* ---------- MARK + LINE ---------- */
function markBlock(start,len,col){
  const t=document.getElementById("chart");
  for(let i=0;i<len;i++){
    t.rows[start+i+1].cells[col].classList.add("mark");
  }
}

function resizeCanvas(){
  const c=document.getElementById("lineLayer");
  const t=document.getElementById("chart");
  c.width=t.offsetWidth;
  c.height=t.offsetHeight;
}
function clearCanvas(){
  const c=document.getElementById("lineLayer");
  c.getContext("2d").clearRect(0,0,c.width,c.height);
}
function drawLine(r1,r2,c){
  const ctx=document.getElementById("lineLayer").getContext("2d");
  const p1=center(r1,c), p2=center(r2,c);
  ctx.strokeStyle="blue";
  ctx.lineWidth=3;
  ctx.beginPath();
  ctx.moveTo(p1.x,p1.y);
  ctx.lineTo(p2.x,p2.y);
  ctx.stroke();
}
function center(r,c){
  const t=document.getElementById("chart");
  const cell=t.rows[r+1].cells[c].getBoundingClientRect();
  const base=t.getBoundingClientRect();
  return {
    x:cell.left-base.left+cell.width/2,
    y:cell.top-base.top+cell.height/2
  };
}
function clearMarks(){
  document.querySelectorAll(".mark").forEach(e=>e.classList.remove("mark"));
}

/* ---------- AI SUGGESTION ---------- */
function showAI(freq,col){
  let arr=Object.entries(freq)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,4)
    .map(x=>x[0]);
  if(arr.length){
    document.getElementById("aiBox").innerHTML=
      "🤖 AI Strong Jodi ("+DAYS[col]+"): "+arr.join(", ");
  }
}

/* ---------- storage ---------- */
function saveData(){
  localStorage.setItem("ismart_flow",document.getElementById("dataInput").value);
  alert("Saved");
}
function addBlankRow(){
  document.getElementById("dataInput").value+="\n** ** ** ** ** **";
}
window.onload=()=>{
  let d=localStorage.getItem("ismart_flow");
  if(d){document.getElementById("dataInput").value=d;generate();}
};
