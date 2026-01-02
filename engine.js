const days=["Mon","Tue","Wed","Thu","Fri","Sat"];
let grid=[];

/* ---------- GENERATE ---------- */
function generate(){
  grid=[];
  dataInput.value.trim().split("\n").forEach(r=>{
    let row=r.trim().split(/\s+/);
    while(row.length<6) row.push("**");
    grid.push(row);
  });
  drawTable();
}

/* ---------- DRAW TABLE ---------- */
function drawTable(){
  chart.innerHTML="";
  let tr=document.createElement("tr");
  days.forEach(d=>{
    let th=document.createElement("th");
    th.textContent=d;
    tr.appendChild(th);
  });
  chart.appendChild(tr);

  grid.forEach((r,i)=>{
    let tr=document.createElement("tr");
    r.forEach((v,j)=>{
      let td=document.createElement("td");
      td.textContent=v;
      if(v==="**") td.classList.add("blank");
      td.onclick=()=>cellClick(i,j);
      tr.appendChild(td);
    });
    chart.appendChild(tr);
  });
}

function addBlankRow(){
  grid.push(["**","**","**","**","**","**"]);
  drawTable();
}

/* ---------- FAMILY ---------- */
function family(n){
  if(n.length!==2) return [];
  let a=+n[0],b=+n[1];
  return [
    n,
    ""+((a+9)%10)+((b+9)%10),
    ""+((a+1)%10)+((b+1)%10)
  ];
}

/* ---------- CLICK ---------- */
function cellClick(r,c){
  clearMarks();
  if(grid[r][c]==="**") findPattern(r,c);
}

/* ---------- FIND PATTERN ---------- */
function findPattern(row,col){
  let base=[];
  for(let i=row-1;i>=0 && base.length<10;i--){
    if(grid[i][col]!=="**") base.push(grid[i][col]);
  }
  if(base.length<4){alert("Pattern kam hai");return;}

  for(let r=0;r<grid.length-base.length;r++){
    let ok=true;
    for(let k=0;k<base.length;k++){
      let g=grid[r+k][col];
      if(g==="**"){ok=false;break;}
      if(!family(base[k]).some(x=>family(g).includes(x))){
        ok=false;break;
      }
    }
    if(ok){
      markLine(r,col,base.length);
    }
  }
}

/* ---------- MARK + POPUP CLICK ---------- */
function markLine(sr,col,len){
  for(let i=0;i<len;i++){
    let td=chart.rows[sr+i+1].cells[col];
    td.classList.add("mark","line");
    td.onclick=()=>openPopup(sr,col,len);
  }
}

/* ---------- POPUP ---------- */
function openPopup(sr,col,len){
  popup.style.display="block";
  popupBody.innerHTML=chart.outerHTML;

  let t=popupBody.querySelector("table");
  for(let i=0;i<len;i++){
    t.rows[sr+i+1].cells[col].classList.add("mark","line");
  }
}

function closePopup(){
  popup.style.display="none";
}

/* ---------- CLEAR ---------- */
function clearMarks(){
  document.querySelectorAll(".mark,.line").forEach(e=>{
    e.classList.remove("mark","line");
  });
}
