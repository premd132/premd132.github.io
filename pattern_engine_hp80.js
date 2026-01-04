function hp80Engine(data,r,c){
  let singles=["2","4","8"];
  let points=[];
  for(let i=r-1;i>=0 && i>=r-10;i--){
    points.push({r:i,c});
  }

  let jodi=[];
  singles.forEach(a=>{
    singles.forEach(b=>{
      if(jodi.length<8) jodi.push(a+b);
    });
  });

  return {points,singles,jodi};
}
