const tbody = document.querySelector("#recordTable tbody");

document.getElementById("csvFile").addEventListener("change", e=>{
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = ()=>{
    tbody.innerHTML="";
    reader.result.split(/\r?\n/).forEach((line,i)=>{
      if(!line.trim()) return;
      const cols=line.split(",");
      const tr=document.createElement("tr");
      tr.innerHTML="<td>W"+(i+1)+"</td>"+cols.map(x=>`<td>${x.trim()}</td>`).join("");
      tbody.appendChild(tr);
    });
  };
  reader.readAsText(file);
});
