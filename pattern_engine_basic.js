function basicEngine(data, r, c) {
  let freq = {};
  let points = [];

  for (let i = r - 1; i >= Math.max(0, r - 10); i--) {
    const v = data[i][c];
    if (!v) continue;

    freq[v] = (freq[v] || 0) + 1;
    points.push({ r: i, c });
  }

  const sorted = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const singles = sorted.map(s => s[0]);
  const jodi = singles.map(a => a + a);

  return { singles, jodi, points };
}
