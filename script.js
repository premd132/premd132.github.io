// ===== A-RULE FAMILY MAP =====
const familyMap = {
  16: [16,61,11,66],
  36: [36,63,68,86],
  52: [52,25,7,70],
  33: [33,38,83,88],
  72: [72,27,78,82],
  // zarurat ho to aur add karo
};
function inFamily(val, base){
  val = parseInt(val,10);
  base = parseInt(base,10);
  if (familyMap[base]) return familyMap[base].includes(val);
  return val === base; // fallback: exact
}

// ===== REPLACE THIS FUNCTION =====
function searchPattern(){
  const checks = document.getElementById('checks');
  checks.innerHTML = '';

  if (clicks.length < 2) return;

  // 1) Base column & direction
  const baseCol = clicks[0].c;
  const dir = Math.sign(clicks[clicks.length-1].r - clicks[0].r) || 1;

  // 2) Row-gap signature (exact)
  const gaps = [];
  for(let i=1;i<clicks.length;i++){
    gaps.push(clicks[i].r - clicks[i-1].r);
  }

  // 3) Base family value (first click)
  const baseVal = data[clicks[0].r][baseCol];

  const matches = [];
  for(let r=0; r<data.length; r++){
    // ensure bounds
    let ok = true;

    // direction check
    if (Math.sign(gaps.reduce((a,b)=>a+b,0)) !== dir) ok = false;

    // for each click point
    for(let i=0;i<clicks.length && ok;i++){
      const rr = r + (clicks[i].r - clicks[0].r);
      if (!data[rr]) { ok=false; break; }

      // SAME COLUMN ONLY
      const cellVal = data[rr][baseCol];
      if (!inFamily(cellVal, baseVal)) { ok=false; break; }

      // exact gap continuity implicitly ensured by rr mapping
    }

    if (ok) matches.push(r);
  }

  // Render compact check lines (no spam)
  matches.slice(0,10).forEach((r,i)=>{
    const d = document.createElement('div');
    d.className = 'checkLine';
    d.textContent = `Pattern ${i+1} (Row ${r})`;
    d.onclick = ()=> showPopup(r); // existing popup
    checks.appendChild(d);
  });
}
// ==== SAFE VALUE PARSER ====
function cleanVal(v){
  if(!v) return "**";
  v = v.toString().trim();
  if(v.includes("*")) return "**";
  if(isNaN(v)) return "**";
  return v.padStart(2,"0");
}
