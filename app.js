const FILES=[
 {lab:'rep',name:'EEN442 lab report template',file:'EEN442_Lab_Report_Template.docx',meta:'Editable Word template · groups of 2 · due Sun 1 Nov 2026',size:'44 KB',ext:'DOCX'},
 {lab:'scada',name:'SCADA lab exercises 1 to 4b',file:'SCADA_Lab_Exercises.pdf',meta:'Grid training simulator worksheet · 13 pages',size:'446 KB'},
 {lab:'scada',name:'Power System Operation lab, session 1',file:'PSO_Lab_Session1_Ex1-5.pdf',meta:'Exercises 1 to 5 · Weck, Weispfenning',size:'902 KB'},
 {lab:'scada',name:'Power System Operation lab, session 2',file:'PSO_Lab_Session2_Ex6-8.pdf',meta:'Exercises 6 to 8',size:'903 KB'},
 {lab:'scada',name:'Power System Operation lab, session 3',file:'PSO_Lab_Session3_Ex9-12.pdf',meta:'Exercises 9 to 12',size:'902 KB'},
 {lab:'scada',name:'Power System Control Technology and Operational Training',file:'PSO_Lecture_Notes_Metz_Graf_2014.pdf',meta:'Lecture notes · Metz, Graf · 112 pages',size:'2.4 MB'},
 {lab:'hv',name:'HV lab instructions: breakdown strength in air',file:'HV_Lab_Breakdown_in_Air_DE.pdf',meta:'In German · Betz · 4 pages',size:'156 KB'},
 {lab:'hv',name:'HV lab introduction (English)',file:'HV_Lab_Introduction_EN.pdf',meta:'Overview of concepts and experiments · 2 pages',size:'54 KB'},
 {lab:'hv',name:'High Voltage Technology and Electrical Fields',file:'HV_Lecture_Notes_Betz.pdf',meta:'Lecture notes · Betz · 133 pages',size:'5.7 MB'},
 {lab:'prot',name:'Current transformers: lab instructions',file:'Protection_Current_Transformers_EN.pdf',meta:'Saturation and burden · IEC 61869-2 · 10 pages',size:'878 KB'},
 {lab:'prot',name:'Distance protection in MV networks',file:'Protection_Distance_Protection_EN.pdf',meta:'Network model, SD 34A, SIPROTEC 7SA511 · 15 pages',size:'671 KB'}
];
const LABEL={rep:'Report',scada:'SCADA',hv:'High Voltage',prot:'Protection'};
const COLOR={rep:'var(--c-rep)',scada:'var(--c-scada)',hv:'var(--c-hv)',prot:'var(--c-prot)'};
const list=document.getElementById('file-list');
const dl='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v12m0 0-5-5m5 5 5-5M5 20h14"/></svg>';
function render(f){
  list.innerHTML=FILES.filter(x=>f==='all'||x.lab===f).map(x=>`<li><a href="files/${x.file}" download style="--accent:${COLOR[x.lab]}">
    <span class="ficon" aria-hidden="true">${x.ext||'PDF'}</span>
    <span><span class="fname">${x.name}</span><span class="fmeta">${LABEL[x.lab]} · ${x.meta} · ${x.size}</span></span>
    <span class="fdl">${dl}</span></a></li>`).join('');
}
render('all');
document.querySelectorAll('.chip').forEach(c=>c.addEventListener('click',()=>{
  document.querySelectorAll('.chip').forEach(o=>{o.classList.toggle('on',o===c);o.setAttribute('aria-pressed',o===c)});
  render(c.dataset.f);
}));

const evs=[...document.querySelectorAll('.ev[data-start]')].map(el=>{const day=el.closest('.day').querySelector('.d-date').textContent;return {el,s:new Date(el.dataset.start),e:new Date(el.dataset.end),t:el.querySelector('.ev-title').textContent,time:el.querySelector('.ev-time').textContent,date:day}});
const fmt=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Berlin',hour:'2-digit',minute:'2-digit'});
const $=id=>document.getElementById(id);
function dur(ms){const m=Math.round(ms/60000),d=Math.floor(m/1440),h=Math.floor(m%1440/60),mm=m%60;return d?`${d} d ${h} h`:h?`${h} h ${mm} min`:`${mm} min`}
function tick(){
  const now=new Date();$('clock').textContent=fmt.format(now);
  document.querySelectorAll('.ev[data-dayend]').forEach(el=>el.classList.toggle('done',now>=new Date(el.dataset.dayend)));
  evs.forEach(d=>{d.el.classList.toggle('now',now>=d.s&&now<d.e);d.el.classList.toggle('done',now>=d.e)});
  const cur=evs.find(d=>now>=d.s&&now<d.e), next=evs.find(d=>now<d.s), st=$('status');
  st.classList.toggle('live',!!cur);
  const prog=evs.filter(d=>now>=d.e).length/evs.length*100;
  if(cur){$('status-title').textContent='Now: '+cur.t;$('status-sub').textContent=`${cur.time} · ends in ${dur(cur.e-now)}`;$('status-bar').style.width=((now-cur.s)/(cur.e-cur.s)*100)+'%'}
  else if(next){$('status-title').textContent='Next: '+next.t;$('status-sub').textContent=`${next.date}, ${next.time} · starts in ${dur(next.s-now)}`;$('status-bar').style.width=prog+'%'}
  else{$('status-title').textContent='Lab week complete';$('status-sub').textContent='Thank you, and good luck with the reports.';$('status-bar').style.width='100%'}
}
tick();setInterval(tick,30000);
