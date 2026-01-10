// 1) Last 6 rows
function getLastRows(n = 6){
  const rows = [...document.querySelectorAll("#recordTable tbody tr")];
  return rows.slice(-n);
}

// 2) Palti + same
function sameOrPalti(a,b){
  if(!a || !b) return false;
  if(a === b) return true;
  return a === b.split("").reverse().join("");
}

// 3) Main analysis (button se chalega)
function runAnalysis(){
  clearDrawing();
  const rows = [...document.querySelectorAll("#recordTable tbody tr")];
  const last = rows.slice(-6);
  const box = document.getElementById("checkLines");
  box.innerHTML = "";

  let checkNo = 1;

  for(let col=1; col<=6; col++){
    let fams = last.map(r => getFamily(r.children[col].innerText.trim()));
    let used = {};

    fams.forEach((f,i)=>{
      fams.forEach((g,j)=>{
        if(i!==j && f===g){
          if(!used[f]){
            used[f]=true;
            makeCheck(col,f,checkNo++);
          }
        }
      });
    });
  }
}

// 4) Check line banana
function makeCheck(col,fam,no){
  const rows = [...document.querySelectorAll("#recordTable tbody tr")];
  const box = document.getElementById("checkLines");

  let found = [];

  rows.forEach((r,ri)=>{
    const v = r.children[col].innerText.trim();
    if(getFamily(v)===fam){
      found.push({row:ri,col});
    }
  });

  if(found.length>=1){
    const div=document.createElement("div");
    div.className="check-line";
    div.innerText=`Check ${no} | Col ${col} | Family ${fam}`;
    div.onclick=()=>draw(found);
    box.appendChild(div);
  }
}

// 5) Circle draw
function draw(list){
  clearDrawing();
  list.forEach((p)=>{
    const td=document.querySelectorAll("#recordTable tbody tr")[p.row].children[p.col];
    td.classList.add("circle");
  });
}
