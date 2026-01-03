let grid=[];

/* ===== CSV LOAD ===== */
document.getElementById("csv").onchange=e=>{
  let r=new FileReader();
  r.onload=()=>{
    grid=r.result.trim().split("\n").map(l=>l.split(","));
    save(); render();
  };
  r.readAsText(e.target.files[0]);
};

/* ===== TABLE ===== */
function render(){
  let t=document.getElementById("table");
  let html="";
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
  save(); render();
}

/* ===== SAVE ===== */
function save(){
  localStorage.setItem("jodiData",JSON.stringify(grid));
}
(function load(){
  let d=localStorage.getItem("jodiData");
  if(d){grid=JSON.parse(d); render();}
})();

/* ===== AI ANALYZE ===== */
function analyze(){

  let last=null, lr=null, ll=null, lu=null;

  for(let i=grid.length-1;i>=0;i--){
    for(let j=0;j<grid[i].length;j++){
      if(/^\d{2}$/.test(grid[i][j])){
        last={r:i,c:j,v:grid[i][j]};
        break;
      }
    }
    if(last)break;
  }

  if(!last){
    result.innerHTML="No jodi found";
    return;
  }

  lu = grid[last.r-1]?.[last.c];
  ll = grid[last.r]?.[last.c-1];
  lr = grid[last.r]?.[last.c+1];

  let digits={};

  [last.v,lu,ll,lr].forEach(v=>{
    if(/^\d{2}$/.test(v)){
      digits[v[0]]=(digits[v[0]]||0)+1;
      digits[v[1]]=(digits[v[1]]||0)+1;
    }
  });

  let singles=Object.entries(digits)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,3)
    .map(x=>x[0]);

  if(singles.length<3){
    result.innerHTML="Not enough data";
    return;
  }

  let [a,b,c]=singles;

  let jodi=[
    a+b,b+a,
    a+c,c+a,
    b+c,c+b,
    a+a,c+c
  ];

  result.innerHTML=`
  <b>Last Jodi:</b> ${last.v}<br><br>

  <b>Used Jodi:</b><br>
  ${[lu,ll,lr].filter(Boolean).join(" , ")}<br><br>

  <b>3 Single Ank:</b><br>
  ${singles.join(" , ")}<br><br>

  <b>🎯 8 Suggested Jodi:</b><br>
  ${jodi.join(" , ")}
  `;
}

/* ===== CLEAR ===== */
function clearAll(){
  if(!confirm("Clear all data?"))return;
  localStorage.removeItem("jodiData");
  grid=[];
  render();
  result.innerHTML="Cleared";
}
