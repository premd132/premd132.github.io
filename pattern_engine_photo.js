function photoEngine(data,r,c){
  let pts=[];
  let singles={};

  for(let i=1;i<=10;i++){
    if(data[r-i]){
      [-1,0,1].forEach(dx=>{
        let v=data[r-i][c+dx];
        if(v){
          pts.push({r:r-i,c:c+dx});
          v.split("").forEach(d=>{
            singles[d]=(singles[d]||0)+1;
          });
        }
      });
    }
  }

  let top = Object.entries(singles)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,3)
    .map(x=>x[0]);

  let jodi=[];
  top.forEach(a=>{
    top.forEach(b=>{
      if(jodi.length<8) jodi.push(a+b);
    });
  });

  return{
    points:pts,
    html:`<b>Photo Pattern</b><br>
    Singles: ${top.join(", ")}<br>
    8 Jodi: ${jodi.join(", ")}`
  }
}
