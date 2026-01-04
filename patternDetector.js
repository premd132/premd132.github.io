/* ================================
   PHASE 2 – PATTERN DETECTOR
================================ */

const FAMILY = {
  "0": ["00","05","50","55"],
  "1": ["01","10","16","61"],
  "2": ["02","20","24","42"],
  "3": ["03","30","34","43"],
  "4": ["04","40","45","54","49","94"],
  "5": ["05","50","55","59","95"],
  "6": ["06","60","61","16","69","96"],
  "7": ["07","70","71","17","77"],
  "8": ["08","80","81","18","88"],
  "9": ["09","90","94","49","99"]
};

function familyOf(jodi){
  if(!jodi || jodi==="**") return [];
  let a=jodi[0], b=jodi[1];
  return [...(FAMILY[a]||[]), ...(FAMILY[b]||[])];
}

/* -------- Pattern Scan (10 rows) -------- */

function scanPatterns(grid, baseRow, baseCol){
  let hits = [];

  for(let r=baseRow-1; r>=Math.max(0,baseRow-10); r--){
    for(let c=0;c<grid[r].length;c++){
      let v = grid[r][c];
      if(!v || v==="**") continue;

      let fam = familyOf(v);

      // vertical
      if(c===baseCol){
        hits.push({type:"vertical", r, c});
      }

      // diagonal
      if(Math.abs(c-baseCol)===Math.abs(r-baseRow)){
        hits.push({type:"diagonal", r, c});
      }

      // left-right echo
      if(Math.abs(c-baseCol)<=2){
        hits.push({type:"echo", r, c});
      }
    }
  }

  return hits;
}

/* -------- Global Pattern Search -------- */

function searchPatternInRecord(grid, pattern){
  let lines = [];

  for(let r=0;r<grid.length;r++){
    for(let c=0;c<grid[r].length;c++){
      pattern.forEach(p=>{
        if(Math.abs(r-p.r)===Math.abs(c-p.c)){
          lines.push({from:p, to:{r,c}});
        }
      });
    }
  }

  return lines;
}
