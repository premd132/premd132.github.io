const days=["Mon","Tue","Wed","Thu","Fri","Sat"];
let grid=[];

function generate(){
  grid=[];
  let rows=document.getElementById("dataInput").value.trim().split("\n");
  rows.forEach(r=>{
    let a=r.trim().split(/\s+/);
    while(a.length<6)a.push("**");
    grid.push(a);
  });
  draw();
}

function draw(){
  const t=document.getElementById("chart");
  t.innerHTML="";
  let h="<tr>"+days.map(d=>`<th>${d}</th>`).join("")+"</tr>";
  t.innerHTML+=h;

  grid.forEach((r,i)=>{
    let tr="<tr>";
    r.forEach((v,j)=>{
      tr+=`<td class="${v=="**"?"blank":""}" onclick="cellClick(${i},${j})">${v}</td>`;
    });
    tr+="</tr>";
    t.innerHTML+=tr;
  });
  resizeCanvas();
}

function cellClick(r,c){
  clearMarks();
  if(grid[r][c]=="**"){
    blankPattern(r,c);
  }else{
    openPopup(`Jodi ${grid[r][c]}`, buildPhoto(r,c));
  }
}

function blankPattern(r,c){
  let base=[];
  for(let i=r-1;i>=0 && base.length<9;i--){
    if(grid[i][c]!="**")base.push(grid[i][c]);
  }
  if(base.length<4){alert("Data kam hai");return;}
  searchHistory(base,c);
}

function family(j){
  let a=+j[0],b=+j[1];
  return [(a+b)%10,(a+9)%10,(b+9)%10];
}

function searchHistory(pat,col){
  const ctx=canvas.getContext("2d");
  grid.forEach((r,i)=>{
    let ok=true;
    for(let k=0;k<pat.length;k++){
      if(!grid[i+k]||grid[i+k][col]=="**"){ok=false;break;}
      let f1=family(pat[k]);
      let f2=family(grid[i+k][col]);
      if(!f1.some(x=>f2.includes(x))){ok=false;break;}
    }
    if(ok){
      drawLine(i,col,i+pat.length,col);
      markCells(i,col,pat.length);
    }
  });
}

function markCells(r,c,len){
  for(let i=0;i<len;i++){
    document.getElementById("chart").rows[r+i+1].cells[c].classList.add("mark");
  }
}

function drawLine(r1,c1,r2,c2){
  const ctx=canvas.getContext("2d");
  let a=center(r1,c1),b=center(r2,c2);
  ctx.strokeStyle="blue";ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
}

function center(r,c){
  let t=chart;
  let cell=t.rows[r+1].cells[c];
  let cr=cell.getBoundingClientRect();
  let tr=t.getBoundingClientRect();
  return{x:cr.left-tr.left+cr.width/2,y:cr.top-tr.top+cr.height/2};
}

function clearMarks(){
  document.querySelectorAll(".mark").forEach(e=>e.classList.remove("mark"));
  canvas.getContext("2d").clearRect(0,0,canvas.width,canvas.height);
}

function buildPhoto(r,c){
  let html="<table>";
  for(let i=r-5;i<=r+5;i++){
    if(grid[i]){
      html+="<tr>"+grid[i].map((v,j)=>{
        let m=(i==r && j==c)?"style='border:3px solid red'":"";
        return `<td ${m}>${v}</td>`;
      }).join("")+"</tr>";
    }
  }
  return html+"</table>";
}

function openPopup(t,b){
  popup.style.display="block";
  popupTitle.innerText=t;
  popupBody.innerHTML=b;
}
function closePopup(){popup.style.display="none"}

function addBlankRow(){
  grid.push(["**","**","**","**","**","**"]);
  draw();
}
function saveData(){
  localStorage.setItem("ismart",dataInput.value);
}
window.onload=()=>{
  let d=localStorage.getItem("ismart");
  if(d){dataInput.value=d;generate();}
}
function resizeCanvas(){
  canvas.width=chart.offsetWidth;
  canvas.height=chart.offsetHeight;
}
