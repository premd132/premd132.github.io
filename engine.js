const days = ["Mon","Tue","Wed","Thu","Fri","Sat"];
let grid = [];
let selectedCell = null;

const table = document.getElementById("grid");
const result = document.getElementById("result");
const csvInput = document.getElementById("csvFile");

// ========== CSV LOAD ==========
csvInput.addEventListener("change", e=>{
  const file = e.target.files[0];
  if(!file) return;

  const reader = new FileReader();
  reader.onload = evt=>{
    const lines = evt.target.result.trim().split("\n");
    grid = [];
    lines.forEach(line=>{
      const cols = line.split(",").slice(0,6);
      grid.push(cols);
    });
    render();
  };
  reader.readAsText(file);
});

// ========== GRID ==========
function render(){
  table.innerHTML="";
  grid.forEach((row,r)=>{
    const tr=document.createElement("tr");
    row.forEach((val,c)=>{
      const td=document.createElement("td");
      td.textContent=val;
      if(val==="") td.classList.add("blank");
      td.onclick=()=>onCellClick(r,c);
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });
}

function onCellClick(r,c){
  clearMarks();
  selectedCell={r,c};

  if(grid[r][c]===""){
    onBlankCellClick(r,c);
  }else{
    highlightUpward(r,c,10);
    updatePanel(r,c,grid[r][c]);
  }
}

function updatePanel(r,c,val){
  result.innerHTML=`
  <b>Selected Cell</b><br>
  Row: ${r}<br>
  Day: ${days[c]}<br>
  Value: ${val}
  `;
}

function highlightUpward(r,c,n){
  for(let i=1;i<=n;i++){
    if(r-i>=0){
      table.rows[r-i].cells[c].classList.add("pattern");
    }
  }
}

function onBlankCellClick(r,c){
  const patterns = scanPatterns(grid,r,c);
  const matches = searchPatternInRecord(grid,patterns);

  if(matches.length===0){
    result.innerHTML="❌ No pattern found";
    return;
  }

  matches.forEach(m=>{
    table.rows[m.r].cells[m.c].classList.add("hit");
  });

  result.innerHTML=
    "<b>Pattern Found</b><br>"+
    "Check Lines: "+matches.length+
    "<br>(Photo style logic)";
}

function clearMarks(){
  document.querySelectorAll("td").forEach(td=>{
    td.classList.remove("pattern","hit","selected");
  });
}

function addRow(){
  grid.push(["","","","","",""]);
  render();
}

function clearGrid(){
  grid=[];
  render();
}
