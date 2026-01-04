const FAMILY = {
 "45":["45","54","40","04","59","95","09","90"]
};

function familyEngine(data,r,c){
  let last = null;
  for(let i=r-1;i>=0;i--){
    if(data[i][c]){ last=data[i][c]; break; }
  }
  if(!last || !FAMILY[last]){
    return {points:[], html:"Family not found"};
  }

  let fam = FAMILY[last];
  let hits=[];
  let pts=[];

  data.forEach((row,i)=>{
    row.forEach((v,j)=>{
      if(fam.includes(v)){
        hits.push(v);
        pts.push({r:i,c:j});
      }
    });
  });

  return{
    points:pts,
    html:`<b>Family Pattern</b><br>
    Base: ${last}<br>
    Family: ${fam.join(", ")}`
  }
}
