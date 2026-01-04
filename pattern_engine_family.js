function familyEngine(data,r,c){
  const fam = n=>[
    n, n.split("").reverse().join("")
  ];

  let singles=[];
  let points=[];

  for(let i=r-1;i>=0 && i>=r-10;i--){
    let v=data[i][c];
    if(v){
      singles.push(...v.split(""));
      points.push({r:i,c});
    }
  }

  singles=[...new Set(singles)].slice(0,3);

  let jodi=[];
  singles.forEach(s=>{
    fam(s+s).forEach(j=>{
      if(jodi.length<8) jodi.push(j);
    });
  });

  return {points,singles,jodi};
}
