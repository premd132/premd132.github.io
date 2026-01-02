alert("✅ script.js loaded");

function generate(){
  const input = document.getElementById("dataInput").value.trim();
  const rows = input.split("\n");

  const table = document.getElementById("chart");
  table.innerHTML = "";

  rows.forEach((rowText, r)=>{
    const tr = document.createElement("tr");
    const cells = rowText.trim().split(/\s+/);

    while(cells.length < 6) cells.push("**");

    cells.forEach((val, c)=>{
      const td = document.createElement("td");
      td.textContent = val;

      if(val === "**"){
        td.classList.add("blank");
      }

      td.onclick = function(){
        alert(
          "CLICK OK ✅\n" +
          "Row: " + (r+1) +
          " Col: " + (c+1) +
          " Value: " + val
        );
      };

      tr.appendChild(td);
    });

    table.appendChild(tr);
  });
}
