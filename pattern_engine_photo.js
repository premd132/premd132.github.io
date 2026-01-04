function photoEngine(data, r, c) {
  let singles = [];
  let jodi = [];
  let points = [];

  for (let i = 1; i <= 6; i++) {
    if (data[r - i] && data[r - i][c]) {
      points.push({ r: r - i, c });
      singles.push(data[r - i][c][0]);
    }

    if (data[r - i] && data[r - i][c + 1]) {
      points.push({ r: r - i, c: c + 1 });
      singles.push(data[r - i][c + 1][1]);
    }
  }

  singles = [...new Set(singles)].slice(0, 3);
  singles.forEach(s => jodi.push(s + s));

  return { singles, jodi, points };
}
