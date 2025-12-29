/* ================================
   JODI LINE PATTERN ENGINE (PRO)
   dpboss-style logic (history based)
================================ */

window.PatternEngine = (() => {

  // parse textarea record
  function parseRecords(text) {
    const lines = text.trim().split('\n');
    const data = [];

    lines.forEach(line => {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 2) {
        const date = parts[0];
        const values = parts.slice(1).map(v => v.padStart(2, '0'));
        data.push({ date, values });
      }
    });
    return data;
  }

  // find all positions of selected jodi
  function findOccurrences(records, jodi) {
    const hits = [];
    records.forEach((row, r) => {
      row.values.forEach((val, c) => {
        if (val === jodi) {
          hits.push({ r, c });
        }
      });
    });
    return hits;
  }

  // extract line pattern (diagonal logic)
  function extractLine(records, start, limit = 3) {
    const result = [];
    let r = start.r;
    let c = start.c;

    for (let i = 0; i < limit; i++) {
      if (records[r] && records[r].values[c]) {
        result.push({
          date: records[r].date,
          value: records[r].values[c]
        });
      }
      r++;
      c++;
    }
    return result;
  }

  // after-result logic
  function afterResult(records, hit) {
    const nextRow = records[hit.r + 1];
    if (!nextRow) return null;
    return nextRow.values[hit.c] || null;
  }

  // MAIN ANALYSIS
  function analyze(text, jodi) {
    const records = parseRecords(text);
    const hits = findOccurrences(records, jodi);

    const output = hits.slice(0, 3).map(hit => ({
      fromDate: records[hit.r].date,
      line: extractLine(records, hit),
      after: afterResult(records, hit)
    }));

    return output;
  }

  return { analyze };

})();
