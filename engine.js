let grid=[];

/* ===== CUT & FAMILY ===== */
const cut = {
  1:6,6:1, 2:7,7:2, 3:8,8:3, 4:9,9:4, 5:0,0:5
};

function family(j){
  let a=parseInt(j[0]), b=parseInt(j[1]);
  if(isNaN(a)||isNaN(b)) return [];
  return [
    `${a}${b}`,
    `${b}${a}`,
    `${cut[a]}${cut[b]}`,
    `${cut[b]}${cut[a]}`
  ];
}

/* ===== CSV LOAD ===== */
document.getElementById("csv").onchange=e=>{
  let r=new FileReader();
  r.onload=()=>parseCSV(r.result);
  r.readAsText(e.target.files[0]);
};

function parseCSV(txt){
  let lines=txt.trim().split("\n");
  lines.shift(); // remove header
  grid=lines.map(l=>l.split(","));
}

/* ===== MAIN ANALYSIS ===== */
function analyze(){
  if(!grid.length){alert("Upload CSV first");return;}

  // find last jodi
  let lastJodi=null;
  for(let r=grid.length-1;r>=0;r--){
    for(let c=5;c>=0;c--){
      if(grid[r][c] && grid[r][c]!="--"){
        lastJodi=grid[r][c];
        break;
      }
    }
    if(lastJodi) break;
  }

  if(!lastJodi){alert("No jodi found");return;}

  document.getElementById("last").innerText =
    "Last Jodi: "+lastJodi;

  let fam=family(lastJodi);
  let freq={};

  // history scan
  for(let r=0;r<grid.length-1;r++){
    for(let c=0;c<6;c++){
      if(fam.includes(grid[r][c])){
        let nextRow=grid[r+1];
        if(nextRow){
          for(let nc=0;nc<6;nc++){
            let nj=nextRow[nc];
            if(nj && nj!="--"){
              freq[nj]=(freq[nj]||0)+1;
            }
          }
        }
      }
    }
  }

  // sort top 4
  let top=Object.entries(freq)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,4);

  let list=document.getElementById("suggestions");
  list.innerHTML="";
  top.forEach(t=>{
    let li=document.createElement("li");
    li.innerText=`${t[0]}  (strength ${t[1]})`;
    list.appendChild(li);
  });
}
