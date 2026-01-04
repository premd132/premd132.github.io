function hp80Engine(data, r, c) {
  let count = {};
  let points = [];

  for (let col = c - 1; col <= c + 1; col++) {
    for (let i = r - 1; i >= Math.max(0, r - 12); i--) {
      if (!data[i] || !data[i][col]) continue;

      const v = data[i][col];
      count[v] = (count[v] || 0) + 1;
      points.push({ r: i, c: col });
    }
  }

  const strong = Object.entries(count)
    .filter(x => x[1] >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const singles = strong.map(x => x[0][0]);
  const jodi = strong.map(x => x[0]);

  return { singles, jodi, points };
}
