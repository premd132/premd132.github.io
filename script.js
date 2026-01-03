let data=[];
let chart;

function showPage(id){
  document.querySelectorAll(".page").forEach(p=>p.style.display="none");
  document.getElementById(id).style.display="block";
}

showPage("analysis");

document.getElementById("fileInput").addEventListener("change",function(e){
  const file=e.target.files[0];
  if(!file) return;

  const reader=new FileReader();
  reader.onload=function(ev){
    data=[];
    ev.target.result.split("\n").forEach(line=>{
      let c=line.trim().split(",");
      if(c.length===3){
        data.push({date:c[0],a:+c[1],b:+c[2]});
      }
    });
    drawChart();
    fillTable();
  };
  reader.readAsText(file);
});

function drawChart(){
  const ctx=document.getElementById("chart");
  if(chart) chart.destroy();

  chart=new Chart(ctx,{
    type:"line",
    data:{
      labels:data.map(x=>x.date),
      datasets:[
        {
          label:"Jodi-A",
          data:data.map(x=>x.a),
          borderColor:"lime",
          tension:0.4
        },
        {
          label:"Jodi-B",
          data:data.map(x=>x.b),
          borderColor:"orange",
          tension:0.4
        }
      ]
    }
  };
}

function fillTable(){
  const tb=document.getElementById("tableBody");
  tb.innerHTML="";
  data.forEach((x,i)=>{
    let trend=i>0 && x.a>data[i-1].a ? "UP" : "DOWN";
    tb.innerHTML+=`
      <tr>
        <td>${x.date}</td>
        <td>${x.a}</td>
        <td>${x.b}</td>
        <td>${trend}</td>
      </tr>
    `;
  });
}
