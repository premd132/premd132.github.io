function blankPattern(r,c){
  clearMarks();

  // 1️⃣ Base pattern (8–10 rows)
  let base=[];
  for(let i=r-1;i>=0 && base.length<9;i--){
    if(grid[i][c]!=="**") base.push(grid[i][c]);
  }

  if(base.length<4){
    alert("Pattern kam hai");
    return;
  }

  let foundCount=0;

  // 2️⃣ Search same pattern in full history
  for(let i=0;i<rows;i++){
    let ok=true;

    for(let k=0;k<base.length;k++){
      if(!grid[i+k] || grid[i+k][c]==="**"){
        ok=false; break;
      }
      if(!sameFamily(base[k],grid[i+k][c])){
        ok=false; break;
      }
    }

    if(ok){
      foundCount++;
      markLine(i,c,base.length); // 🔵 UNDER-MARK + LINE
    }
  }

  // 3️⃣ AI popup ONLY if pattern found
  function aiSuggest(base,count){
  let set=new Set();

  base.forEach(v=>{
    let a=parseInt(v[0]), b=parseInt(v[1]);
    set.add(`${a}${(b+1)%10}`);
    set.add(`${(a+1)%10}${b}`);
    set.add(`${(a+9)%10}${b}`);
  });

  let res=[...set].slice(0,4);

  alert(
    "🤖 AI Strong Jodi\n\n" +
    "Patterns Found: "+count+"\n\n" +
    res.join(" , ")
  );
}
  }
}
