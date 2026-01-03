let headers = ["A","B","C","D"];
let grid = [];

/* ================= LOAD CSV ================= */
document.getElementById("csv").onchange = e=>{
  let r = new FileReader();
  r.onload = ()=>{
    parseCSV(r.result);
    save();
    render();
  };
  r.readAsText(e.target.files[0]);
};

function parseCSV(txt){
  let lines = txt.trim().split("\n");
  grid = lines.map(l=>l.split(","));
}

/* ================= TABLE ================= */
function render(){
  let t = document.getElementById("dataTable");
  let html="<tr>";
  headers.forEach(h=>html+=`<th>${h}</th>`);
  html+="</tr>";

  grid.forEach((r,i)=>{
    html+="<tr>";
    r.forEach((v,j)=>{
      html+=`<td contenteditable onblur="edit(${i},${j},this.innerText)">${v}</td>`;
    });
    html+="</tr>";
  });
  t.innerHTML=html;
}

function edit(r,c,v){
  grid[r][c]=v.trim();
  save();
}

function addRow(){
  grid.push(["","","",""]);
  save();
  render();
}

/* ================= SAVE ================= */
function save(){
  localStorage.setItem("jodiData",JSON.stringify(grid));
}

function load(){
  let d=localStorage.getItem("jodiData");
  if(d){
    grid=JSON.parse(d);
    render();
  }
}
load();

/* ================= FAMILY ================= */
function family(j){
  let a=j[0], b=j[1];
  return [
    a+b, b+a,
    a+a, b+b,
    (9-a)+""+(9-b)
  ];
}

/* ================= AI ANALYZE ================= */
function analyze(){

  let digitFreq={};

  grid.forEach(r=>{
    r.forEach(v=>{
      if(/^\d{2}$/.test(v)){
        digitFreq[v[0]]=(digitFreq[v[0]]||0)+1;
        digitFreq[v[1]]=(digitFreq[v[1]]||0)+1;
      }
    });
  });

  let singles = Object.entries(digitFreq)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,3)
    .map(x=>x[0]);

  let [x,y,z]=singles;

  /* ===== ONLY 8 JODI ===== */
  let jodi = [
    x+y, y+x,
    x+z, z+x,
    y+z, z+y,
    x+x, z+z
  ];

  let html = `
  <b>🤖 AI Single Ank:</b><br>
  ${singles.join(" , ")}<br><br>

  <b>🎯 Only 8 Suggested Jodi:</b><br>
  ${jodi.join(" , ")}<br><br>

  <i>Logic: frequency + controlled family</i>
  `;

  document.getElementById("result").innerHTML=html;
}

/* ================= CLEAR ================= */
function clearAll(){
  if(!confirm("Clear all data?"))return;
  localStorage.removeItem("jodiData");
  grid=[];
  render();
  document.getElementById("result").innerHTML="Cleared";
}
