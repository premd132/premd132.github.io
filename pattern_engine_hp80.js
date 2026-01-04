function hp80Engine(data, r, c){

  let explain = [];
  let points = [];

  /* ---------- FILTER 1 : FAMILY PATTERN ---------- */
  let familyHits = {};
  for(let i=1;i<=10;i++){
    if(!data[r-i]) break;
    [-1,0,1].forEach(dx=>{
      let v = data[r-i][c+dx];
      if(v){
        familyHits[v] = (familyHits[v]||0)+1;
        points.push({r:r-i,c:c+dx});
      }
    });
  }

  let strongFamily = Object.entries(familyHits)
    .filter(x=>x[1]>=3)
    .map(x=>x[0]);

  let f1 = strongFamily.length>0;
  explain.push(`FILTER-1 Family Pattern: ${f1?"PASS":"FAIL"} (${strongFamily.length} hits)`);

  /* ---------- FILTER 2 : GAP CONTROL ---------- */
  let lastGap = null;
  for(let i=r-1;i>=0;i--){
    if(data[i][c]){
      lastGap = r-i;
      break;
    }
  }
  let f2 = lastGap>=8 && lastGap<=15;
  explain.push(`FILTER-2 Gap: ${lastGap} → ${f2?"PASS":"FAIL"}`);

  /* ---------- FILTER 3 : DIGIT PRESSURE ---------- */
  let digitCount = {};
  for(let i=r-1;i>=0 && i>=r-20;i--){
    data[i].forEach(v=>{
      if(v){
        v.split("").forEach(d=>{
          digitCount[d]=(digitCount[d]||0)+1;
        });
      }
    });
  }

  let sorted = Object.entries(digitCount).sort((a,b)=>b[1]-a[1]);
  let over = sorted[0]?.[0];
  let due  = sorted[sorted.length-1]?.[0];
  let f3 = over && due && over!==due;
  explain.push(`FILTER-3 Digit Pressure: ${over} × ${due} → ${f3?"PASS":"FAIL"}`);

  /* ---------- FILTER 4 : CROSS CONFIRM ---------- */
  let cross = 0;
  [-1,0,1].forEach(dx=>{
    if(data[r-1] && data[r-1][c+dx]) cross++;
  });
  let f4 = cross>=2;
  explain.push(`FILTER-4 Cross Column: ${cross} → ${f4?"PASS":"FAIL"}`);

  /* ---------- FINAL DECISION ---------- */
  let passCount = [f1,f2,f3,f4].filter(x=>x).length;
  let strong = passCount===4;

  let html = `<b>🔥 HP-80 RESULT</b><br><br>`;
  explain.forEach(e=> html+=e+"<br>");

  if(strong){
    let singles = [over,due].slice(0,3);
    let jodi=[];
    singles.forEach(a=>{
      singles.forEach(b=>{
        if(jodi.length<8) jodi.push(a+b);
      });
    });

    html+=`<br><b>FINAL SIGNAL: STRONG</b><br>`;
    html+=`Singles: ${singles.join(", ")}<br>`;
    html+=`Jodi: ${jodi.join(", ")}`;
  }else{
    html+=`<br><b>FINAL SIGNAL: NO SIGNAL</b>`;
  }

  return {points, html};
}
