function basicEngine(data,r,c){
  let singles={}, points=[];
  for(let i=r-1;i>=0 && i>=r-10;i--){
    let v=data[i][c];
    if(!v) continue;
    v.split("").forEach(d=>{
      singles[d]=(singles[d]||0)+1;
    });
    points.push({r:i,c});
  }

  let top = Object.entries(singles)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,3).map(x=>x[0]);

  let jodi=[];
  top.forEach(a=>top.forEach(b=>{
    if(jodi.length<6) jodi.push(a+b);
  }));

  return {points, singles:top, jodi};
}
