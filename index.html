function family(j){
  let a=+j[0], b=+j[1];
  return new Set([
    ""+a+b,
    ""+b+a,
    ""+a+((b+5)%10),
    ""+((a+5)%10)+b,
    ""+a+a,
    ""+b+b
  ]);
}

function analyze(){
  let last = getLastJodi();
  if(!last){
    result.innerHTML="Last jodi not found";
    return;
  }

  let fam = family(last);
  let nextJodiFreq = {};
  let singleFreq = {};

  for(let i=0;i<grid.length-1;i++){
    for(let j=0;j<grid[i].length;j++){
      let v = String(grid[i][j]).trim();
      if(fam.has(v)){
        let nextRow = grid[i+1];
        nextRow.forEach(n=>{
          if(/^\d{2}$/.test(n)){
            nextJodiFreq[n]=(nextJodiFreq[n]||0)+1;
            singleFreq[n[0]]=(singleFreq[n[0]]||0)+1;
            singleFreq[n[1]]=(singleFreq[n[1]]||0)+1;
          }
        });
      }
    }
  }

  let topSingles = Object.entries(singleFreq)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,3)
    .map(x=>x[0]);

  let finalSet = new Set();
  topSingles.forEach(d=>{
    Object.keys(nextJodiFreq).forEach(j=>{
      if(j.includes(d)) finalSet.add(j);
    });
  });

  let final = [...finalSet].slice(0,8);

  let html = `<b>Last Jodi:</b> ${last}<br><br>`;
  html+=`<b>Matched Family:</b> ${[...fam].join(", ")}<br><br>`;
  html+=`<b>Top 3 Single Ank (Record Based):</b> ${topSingles.join(", ")}<br><br>`;
  html+=`<b>Suggested Jodi (Only 8):</b><br>`;

  final.forEach(j=>html+=`🔹 ${j}<br>`);

  result.innerHTML = html;
}
