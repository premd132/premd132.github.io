// ========= PHASE 2 : PATTERN ENGINE =========

// pattern = selected blank cell ke upar ke 10 row ka structure
function scanPatterns(grid, r, c){
  let pattern = [];

  for(let i=1;i<=10;i++){
    if(r-i < 0) break;

    const center = grid[r-i][c];
    const left   = c-1 >= 0 ? grid[r-i][c-1] : null;
    const right  = c+1 < 6 ? grid[r-i][c+1] : null;

    pattern.push({
      row: r-i,
      c,
      center,
      left,
      right
    });
  }
  return pattern;
}

// poore record me isi pattern ko dhoondhna
function searchPatternInRecord(grid, pattern){
  let hits = [];

  for(let r=10; r<grid.length-1; r++){
    for(let c=0; c<6; c++){

      let match=true;

      for(let i=0;i<pattern.length;i++){
        const p = pattern[i];
        const rr = r-i;

        if(!grid[rr]) { match=false; break; }

        if(p.center && grid[rr][c] !== p.center) match=false;
        if(p.left && c-1>=0 && grid[rr][c-1] !== p.left) match=false;
        if(p.right && c+1<6 && grid[rr][c+1] !== p.right) match=false;

        if(!match) break;
      }

      if(match){
        hits.push({ r: r+1, c });
      }
    }
  }
  return hits;
}
