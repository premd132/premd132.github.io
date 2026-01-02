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
  if(foundCount>0){
    aiSuggest(base, foundCount);
  }else{
    alert("Koi matching pattern nahi mila");
  }
}
