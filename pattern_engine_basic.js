function basicEngine(data,r,c){
  let freq={};
  let pts=[];

  for(let i=r-1;i>=0 && i>=r-10;i--){
    let v=data[i][c];
    if(!v) continue;
    pts.push({r:i,c});
    v.split("").forEach(d=>{
      freq[d]=(freq[d]||0)+1;
    });
  }

  let singles = Object.entries(freq)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,3)
    .map(x=>x[0]);

  return{
    points:pts,
    html:`<b>Basic Pattern</b><br>
    Strong Singles: ${singles.join(", ")}`
  }
}
