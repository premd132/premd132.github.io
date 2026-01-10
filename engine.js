function getFamily(num){
  return FAMILY_MAP[num] || null;
}

// 1) Niche se 3 aur 4 row ke vertical pattern nikalna
function buildBasePatterns(){
  const rows = [...document.querySelectorAll("#recordTable tbody tr")];
  const last = rows.slice(-5); // niche ke 5 row

  let patterns = [];

  [3,4].forEach(size=>{
    for(let col=1; col<=6; col++){
      for(let i=0; i<=last.length-size; i++){
        let block = last.slice(i, i+size);
        let fams = block.map(r=>{
          let v = r.children[col].innerText.trim();
          return getFamily(v);
        });
        let repeats = fams.filter((f,idx)=>f && fams.indexOf(f)!==idx);
        if(repeats.length){
          patterns.push({
            col,
            size,
            fams,
            shape: fams.map(f=> repeats.includes(f)) // true = circle
          });
        }
      }
    }
  });
  return patterns;
}

// 2) Upar ke record me wahi pattern dhundhna
function scanHistory(pattern){
  const rows = [...document.querySelectorAll("#recordTable tbody tr")];
  let found = [];

  for(let i=0;i<=rows.length-pattern.size;i++){
    let block = rows.slice(i,i+pattern.size);
    let fams = block.map(r=>{
      let v = r.children[pattern.col].innerText.trim();
      return getFamily(v);
    });

    let ok = true;
    for(let k=0;k<pattern.size;k++){
      if(pattern.shape[k]){
        if(fams.indexOf(fams[k])===fams.lastIndexOf(fams[k])) ok=false;
      }
    }
    if(ok){
      found.push({start:i, pattern});
    }
  }
  return found;
}

// 3) Circle draw karna
function drawMatch(match){
  clearDrawing();
  const rows = [...document.querySelectorAll("#recordTable tbody tr")];
  const {start, pattern} = match;
  for(let i=0;i<pattern.size;i++){
    if(pattern.shape[i]){
      let td = rows[start+i].children[pattern.col];
      td.classList.add("circle");
    }
  }
}

// 4) Run button
function runStep4(){
  const box = document.getElementById("checkLines");
  box.innerHTML="";

  const bases = buildBasePatterns();
  let count = 1;

  bases.forEach(p=>{
    const hits = scanHistory(p);
    hits.forEach(h=>{
      let div = document.createElement("div");
      div.className="check-line";
      div.innerText = `Check ${count} | Col ${p.col} | ${p.size} Row Pattern`;
      div.onclick = ()=>drawMatch(h);
      box.appendChild(div);
      count++;
    });
  });

  if(count===1){
    box.innerHTML="<i>No pattern found</i>";
  }
}
