function basicEngine(data,r,c){
  let singlesCount={};
  let points=[];

  for(let i=r-1;i>=0 && i>=r-10;i--){
    for(let j=0;j<6;j++){
      let v=data[i][j];
      if(v){
        v.split("").forEach(d=>{
          singlesCount[d]=(singlesCount[d]||0)+1;
        });
        points.push({r:i,c:j});
      }
    }
  }

  let singles = Object.entries(singlesCount)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,3)
    .map(x=>x[0]);

  let jodi=[];
  singles.forEach(a=>{
    singles.forEach(b=>{
      if(jodi.length<8) jodi.push(a+b);
    });
  });

  return {points,singles,jodi};
}
