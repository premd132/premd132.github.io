const days=["Mon","Tue","Wed","Thu","Fri","Sat"];
let grid=[];
let rows=0, cols=6;

function generate(){
  const raw=document.getElementById("dataInput").value.trim().split("\n");
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
  const c=document.getElementById("lines");
  const t=document.getElementById("chart");
  c.width=t.offsetWidth;
  c.height=t.offsetHeight;
}

function cellClick(r,c){
  clearMarks();
  if(grid[r][c]==="**"){
    blankPattern(r,c);
  }else{
    showPopup(r,c);
  }
}

function blankPattern(r,c){
  let base=[];
  for(let i=r-1;i>=0 && base.length<9;i--){
    if(grid[i][c]!=="**") base.push(grid[i][c]);
  }
  if(base.length<4) return alert("Pattern kam hai");

  for(let i=0;i<rows;i++){
    let ok=true;
    for(let k=0;k<base.length;k++){
      if(!grid[i+k]||grid[i+k][c]==="**"){ok=false;break;}
      if(!sameFamily(base[k],grid[i+k][c])){ok=false;break;}
    }
    if(ok) markLine(i,c,base.length);
  }

  aiSuggest(base);
}

function sameFamily(a,b){
  a=a.toString(); b=b.toString();
  return a[0]===b[0] || a[1]===b[1];
}

function markLine(r,c,len){
  for(let i=0;i<len;i++){
    let td=document.getElementById("chart").rows[r+i+1].cells[c];
    td.classList.add("mark");
  }
}

function clearMarks(){
  document.querySelectorAll("td").forEach(td=>td.classList.remove("mark"));
}

function showPopup(r,c){
  const p=document.getElementById("popup");
  document.getElementById("popupTitle").textContent=
    `Jodi ${grid[r][c]} | ${days[c]} | Row ${r+1}`;
  document.getElementById("popupBody").innerHTML=
    document.getElementById("chart").outerHTML;
  p.style.display="block";
}

function closePopup(){
  document.getElementById("popup").style.display="none";
}

function aiSuggest(base){
  let set=new Set();
  base.forEach(v=>{
    let a=parseInt(v[0]),b=parseInt(v[1]);
    set.add(`${a}${(b+1)%10}`);
    set.add(`${(a+1)%10}${b}`);
  });
  let res=[...set].slice(0,4).join(", ");
  setTimeout(()=>alert("🤖 AI Strong Jodi: "+res),100);
}

function addBlankRow(){
  grid.push(["**","**","**","**","**","**"]);
  rows++;
  drawTable();
  resizeCanvas();
}

function saveData(){
  localStorage.setItem("ismartData",document.getElementById("dataInput").value);
  alert("Saved");
}

window.onload=()=>{
  let d=localStorage.getItem("ismartData");
  if(d){document.getElementById("dataInput").value=d;generate();}
};
