const days = ["Mon","Tue","Wed","Thu","Fri","Sat"];
let grid = [];

/* ---------- GENERATE TABLE ---------- */
function generate(){
  const raw = dataInput.value.trim().split("\n");
  grid = [];

  raw.forEach(r=>{
    let row = r.trim().split(/\s+/);
    while(row.length < 6) row.push("**");
    grid.push(row);
  });

  drawTable();
}

function drawTable(){
  const t = document.getElementById("chart");
  t.innerHTML = "";

  let tr = document.createElement("tr");
  days.forEach(d=>{
    let th = document.createElement("th");
    th.textContent = d;
    tr.appendChild(th);
  });
  t.appendChild(tr);

  grid.forEach((r,i)=>{
    let tr = document.createElement("tr");
    r.forEach((v,j)=>{
      let td = document.createElement("td");
      td.textContent = v;
      if(v==="**") td.classList.add("blank");
      td.onclick = ()=>cellClick(i,j,td);
      tr.appendChild(td);
    });
    t.appendChild(tr);
  });
}

/* ---------- BLANK ROW ---------- */
function addBlankRow(){
  grid.push(["**","**","**","**","**","**"]);
  drawTable();
}

/* ---------- CLICK LOGIC ---------- */
function cellClick(r,c,td){
  clearMarks();

  if(grid[r][c] === "**"){
    blankPattern(r,c);
  }
}

/* ---------- FAMILY / CUT LOGIC ---------- */
function family(n){
  if(n.length!==2) return [];
  let a=parseInt(n[0]), b=parseInt(n[1]);
  return [
    n,
    ""+((a+9)%10)+((b+9)%10),
    ""+((a+1)%10)+((b+1)%10)
  ];
}

/* ---------- MAIN PHOTO-STYLE LINE LOGIC ---------- */
function blankPattern(row,col){
  let basePattern = [];

  // 🔍 नीचे के 8–10 rows का pattern
  for(let i=row-1; i>=0 && basePattern.length<10; i--){
    if(grid[i][col]!=="**"){
      basePattern.push(grid[i][col]);
    }
  }

  if(basePattern.length<4){
    alert("Pattern ke liye data kam hai");
    return;
  }

  // 🔁 पूरी history में वही pattern खोजो
  for(let r=0; r<grid.length-basePattern.length; r++){
    let match = true;

    for(let k=0; k<basePattern.length; k++){
      let cell = grid[r+k][col];
      if(cell==="**"){ match=false; break; }

      let f1 = family(basePattern[k]);
      let f2 = family(cell);
      if(!f1.some(x=>f2.includes(x))){
        match=false; break;
      }
    }

    if(match){
      applyLine(r,col,basePattern.length);
    }
  }
}

/* ---------- APPLY PHOTO-STYLE MARK ---------- */
function applyLine(startRow,col,len){
  for(let i=0;i<len;i++){
    let td = chart.rows[startRow+i+1].cells[col];
    td.classList.add("mark","line");
  }
}

/* ---------- CLEAR ---------- */
function clearMarks(){
  document.querySelectorAll(".mark,.line").forEach(e=>{
    e.classList.remove("mark","line");
  });
  }
