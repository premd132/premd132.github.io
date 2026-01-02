console.clear();
alert("🔥 NEW Phase-2 ACTIVE");

let tableData = [];

function generate(){
  const input = document.getElementById("dataInput").value.trim();
  const rows = input.split("\n");

  const table = document.getElementById("chart");
  table.innerHTML = "";
  tableData = [];

  rows.forEach((rowText, r)=>{
    const tr = document.createElement("tr");
    const cells = rowText.trim().split(/\s+/);
    while(cells.length < 6) cells.push("**");

    tableData[r] = [];

    cells.forEach((val, c)=>{
      const td = document.createElement("td");
      td.textContent = val;
      td.dataset.row = r;
      td.dataset.col = c;

      if(val === "**") td.classList.add("blank");

      td.onclick = ()=>{
        console.log("CLICK:", r, c, val);
        cellClick(r,c,val);
      };

      tableData[r][c] = td;
      tr.appendChild(td);
    });

    table.appendChild(tr);
  });
}

/* ------------ CLICK ------------ */

function cellClick(r,c,val){
  clearMarks();

  if(val === "**"){
    blankClick(r,c);
  } else {
    alert("Jodi clicked: " + val);
  }
}

/* ------------ BLANK LOGIC ------------ */

function blankClick(r,c){
  let families = new Set();

  for(let i=r-1; i>=0 && i>=r-10; i--){
    let v = tableData[i][c].textContent;
    if(v !== "**"){
      families.add(v[0]);
    }
  }

  console.log("Families found:", [...families]);
  drawMarks(c, families);
}

/* ------------ MARK ------------ */

function drawMarks(col, families){
  families.forEach(fam=>{
    for(let r=0; r<tableData.length; r++){
      let td = tableData[r][col];
      let v = td.textContent;
      if(v !== "**" && v.startsWith(fam)){
        td.classList.add("mark");
      }
    }
  });
}

/* ------------ CLEAR ------------ */

function clearMarks(){
  document.querySelectorAll(".mark").forEach(td=>{
    td.classList.remove("mark");
  });
}
