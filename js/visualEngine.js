/* ======================================
   VISUAL LINE + BUBBLE ENGINE (PRO)
   dpboss-style view logic
====================================== */

window.VisualEngine = (() => {

  let svg;

  function initSVG() {
    svg = document.getElementById("lineSVG");
    if (!svg) return;
    svg.innerHTML = "";
  }

  function drawLine(fromEl, toEl, color) {
    const r1 = fromEl.getBoundingClientRect();
    const r2 = toEl.getBoundingClientRect();
    const s = svg.getBoundingClientRect();

    const x1 = r1.left + r1.width / 2 - s.left;
    const y1 = r1.top + r1.height / 2 - s.top;
    const x2 = r2.left + r2.width / 2 - s.left;
    const y2 = r2.top + r2.height / 2 - s.top;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", color);
    line.setAttribute("stroke-width", "3");

    svg.appendChild(line);
  }

  function showBubbles(container, results) {
    container.innerHTML = "";
    results.forEach(r => {
      const b = document.createElement("div");
      b.className = "bubble";
      b.innerText = r.after || "--";
      b.style.background =
        r.after ? "#ff5722" : "#999";
      container.appendChild(b);
    });
  }

  function render(recordsText, jodi) {
    initSVG();

    const results = PatternEngine.analyze(recordsText, jodi);
    const cells = document.querySelectorAll(".cell");

    results.forEach((res, idx) => {
      for (let i = 0; i < res.line.length - 1; i++) {
        const from = document.querySelector(
          `.cell[data-date="${res.line[i].date}"][data-val="${res.line[i].value}"]`
        );
        const to = document.querySelector(
          `.cell[data-date="${res.line[i + 1].date}"][data-val="${res.line[i + 1].value}"]`
        );

        if (from && to) {
          drawLine(from, to, ["red", "blue", "green"][idx]);
        }
      }
    });

    showBubbles(
      document.getElementById("afterBubbles"),
      results
    );
  }

  return { render };

})();
