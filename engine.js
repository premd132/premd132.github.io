let grid = [];
const table = document.getElementById("table");
const result = document.getElementById("result");
const csv = document.getElementById("csv");

/* CSV LOAD */
csv.onchange = e => {
  let r = new FileReader();
  r.onload = () => {
    localStorage.setItem("recordCSV", r.result);
    loadCSV(r.result);
  };
  r.readAsText(e.target.files[0]);
};

window.onload = () => {
  let s = localStorage.getItem("recordCSV");
  if (s) loadCSV(s);
};

function loadCSV(txt) {
  grid = txt.trim().split("\n").map(r => r.split(","));
  draw();
}

function draw() {
  table.innerHTML = "";
  grid.forEach((r,i)=>{
    let tr = document.createElement("tr");
    r.forEach((v,j)=>{
      let td = document.createElement("td");
      td.contentEditable = true;
      td.innerText = v;
      td.onblur = ()=>{ grid[i][j]=td.innerText.trim(); save(); };
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });
}

function addRow(){
  if(grid.length===0) return;
  grid.push(new Array(grid[0].length).fill(""));
  draw(); save();
}

function save(){
  localStorage.setItem("recordCSV", grid.map(r=>r.join(",")).join("\n"));
}

function clearAll(){
  if(!confirm("Clear all data?")) return;
  grid=[]; table.innerHTML=""; result.innerHTML="Upload record";
  localStorage.removeItem("recordCSV");
}

/* ================= AI LOGIC ================= */

function getLastJodi(){
  for(let i=grid.length-1;i>=0;i--){
    for(let j=grid[i].length-1;j>=0;j--){
      let v=String(grid[i][j]).trim();
      if(/^\d{2}$/.test(v)) return v;
    }
  }
  return null;
}

function analyze(){
  let last = getLastJodi();
  if(!last){
    result.innerHTML="Last jodi not found";
    return;
  }

  let a=+last[0], b=+last[1];
  let freq={};

  grid.flat().forEach(v=>{
    if(/^\d{2}$/.test(v)){
      freq[v]=(freq[v]||0)+1;
    }
  });

  let digits=[a,b];
  Object.keys(freq).forEach(j=>{
    if(j.includes(a)||j.includes(b)){
      digits.push(+j[0],+j[1]);
    }
  });

  let dCount={};
  digits.forEach(d=>dCount[d]=(dCount[d]||0)+1);

  let topSingles=Object.entries(dCount)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,3)
    .map(x=>+x[0]);

  let set=new Set();
  topSingles.forEach(d=>{
    [(d+3)%10,(d+6)%10,d].forEach(x=>{
      set.add(""+d+x);
      set.add(""+x+d);
    });
  });

  let final=[...set].slice(0,8);

  let html=`<b>Last Jodi:</b> ${last}<br><br>`;
  html+=`<b>Top 3 Single Ank:</b> ${topSingles.join(", ")}<br><br>`;
  html+=`<b>Suggested Jodi (Only 8):</b><br>`;
  final.forEach(j=>html+=`🔹 ${j}<br>`);

  result.innerHTML=html;
}
