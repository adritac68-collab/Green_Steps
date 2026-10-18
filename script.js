const seed=[
{id:1,activity:"cleanup",title:"Saturday park clean-up",people:8,hours:2,area:"Central Park",date:"Demo activity"},
{id:2,activity:"recycling",title:"Paper and plastic collection",people:12,hours:1.5,area:"Community Hall",date:"Demo activity"},
{id:3,activity:"trees",title:"Native sapling planting",people:6,hours:2,area:"School Garden",date:"Demo activity"}
];
const labels={cleanup:"Clean-up",recycling:"Recycling",trees:"Tree planting",awareness:"Awareness"};
const icons={cleanup:"🧹",recycling:"♻️",trees:"🌳",awareness:"📣"};
let actions=JSON.parse(localStorage.getItem("greenStepsActions")||"null")||seed;
function save(){localStorage.setItem("greenStepsActions",JSON.stringify(actions));render();}
function render(){
 const waste=actions.reduce((s,a)=>s+(a.activity==="cleanup"?a.people*1.5:a.activity==="recycling"?a.people*2:0),0);
 const trees=actions.reduce((s,a)=>s+(a.activity==="trees"?a.people:0),0);
 const hours=actions.reduce((s,a)=>s+a.people*a.hours,0);
 document.querySelector("#total").textContent=actions.length;
 document.querySelector("#waste").textContent=waste.toFixed(1)+" kg";
 document.querySelector("#trees").textContent=trees;
 document.querySelector("#hours").textContent=hours.toFixed(1);
 const pct=Math.min(100,actions.length/50*100);
 document.querySelector("#progressText").textContent=actions.length+" / 50";
 document.querySelector("#progressBar").style.width=pct+"%";
 const f=document.querySelector("#filter").value;
 const list=document.querySelector("#activityList");list.innerHTML="";
 const shown=actions.filter(a=>f==="all"||a.activity===f);
 if(!shown.length){list.innerHTML='<div class="empty">No activities in this category yet. Add one using the form.</div>';return;}
 shown.forEach(a=>{
  const row=document.createElement("article");row.className="activity";
  const ic=document.createElement("div");ic.className="activity-icon";ic.textContent=icons[a.activity];
  const details=document.createElement("div");const h=document.createElement("h4");h.textContent=a.title;
  const p=document.createElement("p");p.textContent=labels[a.activity]+" · "+a.area+" · "+a.people+" people · "+a.hours+" hours each";
  const rm=document.createElement("button");rm.className="remove";rm.textContent="Remove";rm.onclick=()=>{actions=actions.filter(x=>x.id!==a.id);save();};
  details.append(h,p,rm);
  const metric=document.createElement("div");metric.className="metric";metric.textContent=(a.people*a.hours).toFixed(1)+" hrs";
  row.append(ic,details,metric);list.append(row);
 });
}
document.querySelector("#actionForm").addEventListener("submit",e=>{
 e.preventDefault();
 actions.unshift({id:Date.now(),activity:document.querySelector("#activity").value,title:document.querySelector("#title").value.trim(),people:Number(document.querySelector("#people").value),hours:Number(document.querySelector("#duration").value),area:document.querySelector("#area").value.trim(),date:new Date().toLocaleDateString()});
 e.target.reset();document.querySelector("#people").value=5;document.querySelector("#duration").value=1;save();
});
document.querySelector("#filter").addEventListener("change",render);
document.querySelector("#reset").addEventListener("click",()=>{if(confirm("Reset activities to the original demo examples?")){actions=seed.map(a=>({...a}));document.querySelector("#filter").value="all";save();}});
render();