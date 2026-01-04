const csv = document.getElementById("csv");
const grid=document.getElementById("grid");
const cv=document.getElementById("cv");
const ctx=cv.getContext("2d");
const panel=document.getElementById("panel");
let data=[];
// ================= SAVE / LOAD DATA =================
function saveData(){
  localStorage.setItem("pattern_data", JSON.stringify(data));
}

function loadSaved(){
  const saved = localStorage.getItem("pattern_data");
  if(saved){
    data = JSON.parse(saved);
    render();
  }
}
// CSV
csv.onchange=e=>{
  const r=new FileReader();
  r.onload=()=>{
    data=r.result.trim().split("\n").map(l=>l.split(","));
    render();
  };
  r.readAsText(e.target.files[0]);
};

function render(){
  grid.innerHTML="";
  data.forEach((row,r)=>{
    const tr=document.createElement("tr");
    row.forEach((v,c)=>{
      const td=document.createElement("td");
      td.innerText=v||"";
      if(!v) td.classList.add("blank");
      td.onclick=()=>clickCell(r,c);
      tr.appendChild(td);
    });
    grid.appendChild(tr);
  });
  cv.width=grid.offsetWidth;
  cv.height=grid.offsetHeight;
}

function addRow(){
  data.push(["","","","","",""]);
  render();
}

function clickCell(r,c){
  if(data[r][c]) return;
  ctx.clearRect(0,0,cv.width,cv.height);

  const pat=detectPattern(data,r,c);
  const res=searchPast(data,pat.strongFam);

  pat.points.forEach(p=>{
    const td=grid.rows[p.r].cells[p.c];
    const x=td.offsetLeft+27;
    const y=td.offsetTop+15;
    ctx.beginPath();
    ctx.arc(x,y,10,0,Math.PI*2);
    ctx.strokeStyle="red";
    ctx.stroke();
  });

  panel.innerHTML=
    "<b>Pattern Found</b><br>"+
    "Strong Singles: "+res.topSingles.join(", ")+"<br><br>"+
    "<b>Final 8 Jodi</b><br>"+
    res.jodi.join(", ");
}
