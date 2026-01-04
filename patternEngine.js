function family(n){
  const a=parseInt(n[0]), b=parseInt(n[1]);
  return [
    `${a}${b}`,`${b}${a}`,
    `${(a+5)%10}${b}`,`${a}${(b+5)%10}`,
    `${(b+5)%10}${a}`,`${b}${(a+5)%10}`,
    `${(a+5)%10}${(b+5)%10}`,
    `${(b+5)%10}${(a+5)%10}`
  ];
}

function analyzePattern(data,r,c){
  let points=[];
  let nums=[];
  for(let i=1;i<=10;i++){
    if(r-i<0) break;
    let v=data[r-i][c];
    if(v && v!=="**"){
      points.push({r:r-i,c});
      nums.push(v);
    }
  }

  let fam = family(nums[0]||"00");

  let matches=[];
  data.forEach(row=>{
    row.forEach(v=>{
      if(fam.includes(v)) matches.push(v);
    });
  });

  return {
    points,
    line1: nums.slice(0,3),
    line2: fam.slice(0,4),
    line3: matches.slice(0,3),
    suggestion: fam.slice(0,8)
  };
}
