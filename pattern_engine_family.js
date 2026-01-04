function familyEngine(data, r, c) {
  const family = n => {
    const a = n[0], b = n[1];
    return [
      a + b,
      a + "0",
      "0" + b,
      b + a,
      b + "9",
      "9" + b,
      "9" + a,
      a + "9"
    ];
  };

  let found = [];
  let points = [];

  for (let i = r - 1; i >= Math.max(0, r - 10); i--) {
    const v = data[i][c];
    if (!v) continue;

    family(v).forEach(f => {
      found.push(f);
    });

    points.push({ r: i, c });
  }

  const singles = [...new Set(found.map(f => f[0]))].slice(0, 3);
  const jodi = found.slice(0, 8);

  return { singles, jodi, points };
}
