const days=["Mon","Tue","Wed","Thu","Fri","Sat"];
let grid=[];
let rows=0, cols=6;

function generate(){
  let raw=document.getElementById("dataInput").value.trim().split("\n");
  grid=[];
  raw.forEach(r=>{
    let row=r.trim().split(/\s+/);
    while(row.length<6) row.push("**");
    grid.push(row);
  });
  rows=grid.length;
  drawTable();
  resizeCanvas();
}

function drawTable(){
  const t=document.getElementById("chart");
  t.innerHTML="";

  let tr=document.createElement("tr");
  days.forEach(d=>{
    let th=document.createElement("th");
    th.textContent=d;
    tr.appendChild(th);
  });
  t.appendChild(tr);

  grid.forEach((r,i)=>{
    let tr=document.createElement("tr");
    r.forEach((v,j)=>{
      let td=document.createElement("td");
      td.textContent=v;
      if(v==="**") td.classList.add("blank");
      td.onclick=()=>cellClick(i,j);
      tr.appendChild(td);
    });
    t.appendChild(tr);
  });
}

function resizeCanvas(){
  let c=document.getElementById("lineCanvas");
  let t=document.getElementById("chart");
  c.width=t.offsetWidth;
  c.height=t.offsetHeight;
}

function cellClick(r,c){
  clearMarks();
  clearCanvas();

  if(grid[r][c]==="**"){
    blankPatternSearch(r,c);
  }else{
    openPopup(`Jodi ${grid[r][c]} | ${days[c]} | Row ${r+1}`, r, c);
  }
}

/* ===== CORE PHOTO-STYLE LOGIC ===== */

function blankPatternSearch(r,c){
  let basePattern=[];

  for(let i=r-1;i>=0 && basePattern.length<9;i--){
    if(grid[i][c]!=="**"){
      basePattern.push(grid[i][c]);
      markCell(i,c);
    }
  }

  if(basePattern.length<4){
    alert("Pattern ke liye data kam hai");
    return;
  }

  // search same pattern everywhere
  for(let start=0; start<rows-9; start++){
    let match=true;
    for(let k=0;k<basePattern.length;k++){
      if(grid[start+k][c]==="**" ||
         !sameFamily(grid[start+k][c], basePattern[k])){
        match=false; break;
      }
    }
    if(match){
      drawVerticalLine(start,c,start+basePattern.length-1,c);
      for(let k=0;k<basePattern.length;k++){
        markCell(start+k,c);
      }
    }
  }
}

function sameFamily(a,b){
  let A=[+a[0],+a[1]];
  let B=[+b[0],+b[1]];
  return ( (A[0]+A[1])%10 === (B[0]+B[1])%10 );
}

/* ===== VISUAL ===== */

function cellCenter(r,c){
  let t=document.getElementById("chart");
  let cell=t.rows[r+1].cells[c];
  let rect=cell.getBoundingClientRect();
  let base=t.getBoundingClientRect();
  return{
    x:rect.left-base.left+rect.width/2,
    y:rect.top-base.top+rect.height/2
  };
}

function drawVerticalLine(r1,c1,r2,c2){
  let ctx=lineCanvas.getContext("2d");
  let p1=cellCenter(r1,c1);
  let p2=cellCenter(r2,c2);
  ctx.strokeStyle="blue";
  ctx.lineWidth=3;
  ctx.beginPath();
  ctx.moveTo(p1.x,p1.y);
  ctx.lineTo(p2.x,p2.y);
  ctx.stroke();
}

function markCell(r,c){
  document.getElementById("chart").rows[r+1].cells[c].classList.add("mark");
}

function clearMarks(){
  document.querySelectorAll(".mark").forEach(e=>e.classList.remove("mark"));
}

function clearCanvas(){
  let c=lineCanvas;
  c.getContext("2d").clearRect(0,0,c.width,c.height);
}

/* ===== POPUP ===== */

function openPopup(title,r,c){
  popup.style.display="block";
  popupTitle.textContent=title;
  popupBody.innerHTML=document.getElementById("chart").outerHTML;
}

function closePopup(){
  popup.style.display="none";
}

/* ===== UTIL ===== */

function addBlankRow(){
  grid.push(["**","**","**","**","**","**"]);
  rows++;
  drawTable();
  resizeCanvas();
}

function saveData(){
  localStorage.setItem("ismartData",dataInput.value);
  alert("Saved");
}

window.onload=()=>{
  let d=localStorage.getItem("ismartData");
  if(d){
    dataInput.value=d;
    generate();
  }
}
