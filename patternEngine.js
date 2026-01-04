/* ==================================================
   COMMON HELPER FOR ALL ENGINES
   ================================================== */

/*
  Selected blank cell (r,c) ke upar ke rows se
  valid filled cells collect karta hai
*/

function getUp(data, r, c, limit = 10) {
  let points = [];

  for (let i = 1; i <= limit; i++) {
    if (r - i < 0) break;

    if (data[r - i][c]) {
      points.push({
        r: r - i,
        c: c
      });
    }
  }

  return points;
}
