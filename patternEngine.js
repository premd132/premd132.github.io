// ===== FAMILY RULE =====
function family(j){
  if(!j) return [];
  const a=j[0], b=j[1];
  return [
    a+b, b+a,
    a+"0","0"+a,
    b+"0","0"+b,
    a+"9","9"+a,
    b+"9","9"+b
  ];
}

// ===== PATTERN DETECT =====
function detectPattern(data, r, c){
  let points=[], famHits={};

  for(let i=1;i<=10;i++){
    if(r-i<0) break;

    let cells=[
      data[r-i][c],
      data[r-i][c-1],
      data[r-i][c+1]
    ];

    cells.forEach(v=>{
      if(v){
        family(v).forEach(f=>{
          famHits[f]=(famHits[f]||0)+1;
        });
        points.push({r:r-i,c});
      }
    });
  }

  let strongFam=Object.entries(famHits)
    .filter(x=>x[1]>=2)
    .map(x=>x[0]);

  return {points,strongFam};
}

// ===== PAST SEARCH =====
function searchPast(data, fam){
  let singles={};

  for(let r=0;r<data.length-1;r++){
    for(let c=0;c<6;c++){
      if(fam.includes(data[r][c])){
        let next=data[r+1][c];
        if(next){
          next.split("").forEach(d=>{
            singles[d]=(singles[d]||0)+1;
          });
        }
      }
    }
  }

  let topSingles=Object.entries(singles)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,3)
    .map(x=>x[0]);

  let jodi=[];
  topSingles.forEach(a=>{
    topSingles.forEach(b=>{
      if(jodi.length<8) jodi.push(a+b);
    });
  });

  return {topSingles,jodi};
}
