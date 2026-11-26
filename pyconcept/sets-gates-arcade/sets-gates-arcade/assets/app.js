const $=s=>document.querySelector(s);
const DEF={mode:'auto',c:null,spd:1,den:44,fxo:false,vol:.5,wav:'auto',uni:12,nA:'A',nB:'B',tbl:'10',fnt:'orb'};
let cfg={...DEF},raf=0;
try{Object.assign(cfg,JSON.parse(localStorage.getItem('sga')||'{}'))}catch(e){}
const save=()=>{try{localStorage.setItem('sga',JSON.stringify(cfg))}catch(e){}};
const nm=s=>s.replace(/\b[AB]\b/g,m=>m==='A'?cfg.nA:cfg.nB);
/* ---------- sound ---------- */
let ac,muted=false;
function snd(f,d=.12,t='sine',v=.07,sl=0){if(muted)return;try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();if(ac.state==='suspended')ac.resume();const o=ac.createOscillator(),g=ac.createGain(),n=ac.currentTime;o.type=cfg.wav==='auto'?t:cfg.wav;o.frequency.setValueAtTime(f,n);if(sl)o.frequency.exponentialRampToValueAtTime(Math.max(40,f+sl),n+d);g.gain.setValueAtTime(Math.max(.0002,v*cfg.vol*2),n);g.gain.exponentialRampToValueAtTime(.0001,n+d);o.connect(g).connect(ac.destination);o.start();o.stop(n+d)}catch(e){}}
const seq=(a,t='triangle',gap=70)=>a.forEach((f,i)=>setTimeout(()=>snd(f,.16,t),i*gap));
const sfx={click:()=>snd(520,.07,'square',.04),on:()=>seq([660,990],'triangle',60),off:()=>snd(320,.15,'triangle',.08,-150),whoosh:()=>snd(180,.28,'sawtooth',.035,900),win:()=>seq([523,659,784,1047],'sine'),bad:()=>seq([220,165],'sawtooth',90),pop:n=>snd(380+n*90,.1,'sine',.08)};
$('#snd').onclick=e=>{muted=!muted;e.target.textContent=muted?'Sound off':'Sound on';if(!muted)sfx.click()};
$('#thm').onclick=()=>{const m=['auto','light','dark'];cfg.mode=m[(m.indexOf(cfg.mode)+1)%3];apply();sfx.click()};
/* ---------- router ---------- */
const VIEWS=['home','venn','logic'];
function route(){const h=location.hash.slice(1),v=VIEWS.includes(h)?h:'home';VIEWS.forEach(n=>{$('#v-'+n).hidden=n!==v;const l=$('#n-'+n);l&&l.classList.toggle('on',n===v)});scrollTo(0,0);if(v!=='home')sfx.whoosh()}
addEventListener('hashchange',route);
/* ---------- background glyph rain ---------- */
const cv=$('#bg'),cx=cv.getContext('2d');let W,H,col='#22e6ff',fr=0;
const GL=['∪','∩','∧','∨','¬','⊕','∈','⊂','0','1','{ }','and','or','not','&','|','^'];
const ps=Array.from({length:120},()=>({x:Math.random(),y:Math.random(),v:.00025+Math.random()*.0006,s:14+Math.random()*26,g:GL[Math.random()*GL.length|0],a:.08+Math.random()*.16}));
function rs(){W=cv.width=innerWidth;H=cv.height=innerHeight}rs();addEventListener('resize',rs);
function bg(){if(fr++%90===0)col=getComputedStyle(document.documentElement).getPropertyValue(fr%180<90?'--c1':'--c2').trim()||col;cx.clearRect(0,0,W,H);ps.slice(0,cfg.den).forEach(p=>{p.y+=p.v*cfg.spd;if(p.y>1.05){p.y=-.05;p.x=Math.random()}cx.globalAlpha=p.a;cx.fillStyle=col;cx.font=`700 ${p.s}px monospace`;cx.fillText(p.g,p.x*W,p.y*H)});if(!matchMedia('(prefers-reduced-motion:reduce)').matches&&!cfg.fxo)raf=requestAnimationFrame(bg);else raf=0}bg();
document.querySelectorAll('.card').forEach(c=>{c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform=`perspective(800px) rotateY(${x*10}deg) rotateX(${-y*10}deg) translateY(-6px)`});c.addEventListener('pointerleave',()=>c.style.transform='');c.addEventListener('click',sfx.click)});

/* ---------- Venn: Python sets ---------- */
const NS='http://www.w3.org/2000/svg';
let A=new Set([1,2,3,4,5]),B=new Set([4,5,6,7,8]),op=0,last=[];
const U=()=>[...new Set([...Array.from({length:cfg.uni},(_,i)=>i+1),...A,...B])].sort((x,y)=>x-y);
const fmt=s=>{const a=[...s].sort((x,y)=>x-y);return a.length?'{'+a.join(', ')+'}':'set()'};
const OPS=[
{n:'Union',e:'A | B',f:(a,b)=>a||b},
{n:'Intersection',e:'A & B',f:(a,b)=>a&&b},
{n:'Difference',e:'A - B',f:(a,b)=>a&&!b},
{n:'Difference',e:'B - A',f:(a,b)=>b&&!a},
{n:'Symmetric diff',e:'A ^ B',f:(a,b)=>a!==b},
{n:'Complement of A',e:'U - A',f:(a,b)=>!a},
{n:'Complement of B',e:'U - B',f:(a,b)=>!b},
{n:'Neither set',e:'U - (A | B)',f:(a,b)=>!a&&!b},
{n:'Subset?',e:'A <= B',f:(a,b)=>a&&!b,bool:1},
{n:'Superset?',e:'A >= B',f:(a,b)=>b&&!a,bool:1},
{n:'Disjoint?',e:'A.isdisjoint(B)',f:(a,b)=>a&&b,bool:1}];
const S={'10':[],'01':[],'11':[],'00':[]};
for(const x of [175,215])for(const y of [105,140,175,210,245]){S['10'].push([x,y]);S['01'].push([600-x,y])}
for(const y of [115,145,175,205,235])S['11'].push([300,y]);
for(const x of [40,85,515,560])for(const y of [60,115,175,235,290])S['00'].push([x,y]);
S['00'].push([300,28],[300,325]);
$('#vs').innerHTML=`<defs><clipPath id="cB"><circle cx="370" cy="175" r="120"/></clipPath>
<mask id="mA"><rect width="600" height="350" fill="#fff"/><circle cx="370" cy="175" r="120" fill="#000"/></mask>
<mask id="mB"><rect width="600" height="350" fill="#fff"/><circle cx="230" cy="175" r="120" fill="#000"/></mask>
<mask id="mO"><rect width="600" height="350" fill="#fff"/><circle cx="230" cy="175" r="120" fill="#000"/><circle cx="370" cy="175" r="120" fill="#000"/></mask></defs>
<rect class="reg" id="r00" x="4" y="4" width="592" height="342" rx="18" mask="url(#mO)"/>
<circle class="reg" id="r10" cx="230" cy="175" r="120" mask="url(#mA)"/><circle class="reg" id="r01" cx="370" cy="175" r="120" mask="url(#mB)"/>
<circle class="reg" id="r11" cx="230" cy="175" r="120" clip-path="url(#cB)"/>
<rect class="frame" x="4" y="4" width="592" height="342" rx="18"/>
<circle class="ca" cx="230" cy="175" r="120"/><circle class="cb" cx="370" cy="175" r="120"/>
<text class="lab" id="labA" x="185" y="62" text-anchor="middle">A</text><text class="lab" id="labB" x="415" y="62" text-anchor="middle">B</text><text class="lab" x="22" y="34" style="opacity:.5">U</text><g id="chips"></g>`;
const chips=$('#chips'),con=$('#con');
function cycle(v){const a=A.has(v),b=B.has(v);const n=!a&&!b?[1,0]:a&&!b?[1,1]:a&&b?[0,1]:[0,0];n[0]?A.add(v):A.delete(v);n[1]?B.add(v):B.delete(v);sfx.pop(n[0]*2+n[1]);syncIn();render()}
function render(anim){
 const o=OPS[op],us=U(),cnt={'00':0,'01':0,'10':0,'11':0},hot=[],keep=new Set(us);
 [...chips.children].forEach(c=>{if(!keep.has(+c.dataset.v))c.remove()});
 us.forEach(v=>{let c=chips.querySelector(`[data-v="${v}"]`);
  if(!c){c=document.createElementNS(NS,'g');c.setAttribute('class','chip');c.dataset.v=v;c.innerHTML=`<circle r="14"/><text dy=".35em">${v}</text>`;c.onclick=()=>cycle(v);chips.append(c)}
  const a=A.has(v),b=B.has(v),k=''+(+a)+(+b),i=cnt[k]++,sl=S[k],p=sl[i%sl.length],off=Math.floor(i/sl.length)*10;
  c.style.transform=`translate(${p[0]+off}px,${p[1]+off}px)`;
  const h=!!o.f(a,b);if(h)hot.push(v);c.classList.toggle('hot',h&&!o.bool);c.classList.toggle('bad',h&&!!o.bool)});
 ['00','01','10','11'].forEach(k=>$('#r'+k).classList.toggle('on',!!o.f(k[0]==1,k[1]==1)));
 last=hot;const res=o.bool?(hot.length?'False':'True'):fmt(new Set(hot)),p='<i>&gt;&gt;&gt;</i> ';
 con.innerHTML=`${p}${cfg.nA} = ${fmt(A)}\n${p}${cfg.nB} = ${fmt(B)}\n${p}U = ${fmt(new Set(us))}\n${p}<b>${nm(o.e)}</b>\n<span id="res" class="${o.bool&&hot.length?'F':''}"></span>${o.bool?'':'\n<i># len = '+hot.length+'</i>'}`;
 const r=$('#res');if(anim)typeIt(r,res);else r.textContent=res}
let tm;function typeIt(el,t){clearInterval(tm);let i=0;el.textContent='';tm=setInterval(()=>{el.textContent=t.slice(0,++i);if(i>=t.length)clearInterval(tm)},20)}
const buildOps=()=>{$('#ops').innerHTML=OPS.map((o,i)=>`<button class="b${i===op?' on':''}" data-i="${i}">${nm(o.n)}<code>${nm(o.e)}</code></button>`).join('')};buildOps();
$('#ops').onclick=e=>{const b=e.target.closest('button');if(!b)return;op=+b.dataset.i;document.querySelectorAll('#ops .b').forEach(x=>x.classList.toggle('on',x===b));sfx.whoosh();render(true);const o=OPS[op];setTimeout(()=>o.bool&&last.length?sfx.bad():sfx.win(),200)};
const parse=s=>[...new Set((s.match(/-?\d+/g)||[]).map(Number).filter(n=>Math.abs(n)<1000))].slice(0,40);
const syncIn=()=>{$('#ia').value=[...A].sort((x,y)=>x-y).join(', ');$('#ib').value=[...B].sort((x,y)=>x-y).join(', ')};
$('#ia').oninput=e=>{A=new Set(parse(e.target.value));render()};$('#ib').oninput=e=>{B=new Set(parse(e.target.value));render()};
$('#rnd').onclick=()=>{const r=()=>new Set(Array.from({length:cfg.uni},(_,i)=>i+1).filter(()=>Math.random()<.45));A=r();B=r();syncIn();sfx.whoosh();render(true)};
$('#rst').onclick=()=>{A=new Set([1,2,3,4,5]);B=new Set([4,5,6,7,8]);syncIn();sfx.click();render(true)};
syncIn();render(true);

/* ---------- Logic lab: Python booleans ---------- */
const GT={
AND:{f:(a,b)=>a&&b,py:(a,b)=>`${a} and ${b}`,t:'and'},
OR:{f:(a,b)=>a||b,py:(a,b)=>`${a} or ${b}`,t:'or'},
XOR:{f:(a,b)=>a!==b,py:(a,b)=>`${a} != ${b}`,t:'or',x:1},
NAND:{f:(a,b)=>!(a&&b),py:(a,b)=>`not (${a} and ${b})`,t:'and',n:1},
NOR:{f:(a,b)=>!(a||b),py:(a,b)=>`not (${a} or ${b})`,t:'or',n:1},
XNOR:{f:(a,b)=>a===b,py:(a,b)=>`${a} == ${b}`,t:'or',x:1,n:1},
NOT:{f:a=>!a,py:a=>`not ${a}`,t:'not',n:1,u:1},
BUF:{f:a=>a,py:a=>a,t:'buf',u:1}};
const st={A:true,B:false,C:true,g1:'AND',g2:'OR'};
const body=t=>{const g=GT[t],p=g.t==='and'?'M0 0H30A30 30 0 0 1 30 60H0Z':g.t==='or'?'M0 0Q35 0 60 30Q35 60 0 60Q16 30 0 0Z':'M0 5L60 30L0 55Z';
return `<path class="gb" d="${p}"/>`+(g.x?'<path class="gx" d="M-9 0Q7 30 -9 60"/>':'')+(g.n?'<circle class="gb" cx="65" cy="30" r="5"/>':'')+`<text class="gl" x="28" y="34">${t}</text>`};
const gsel=(id,k)=>{$(id).innerHTML=Object.keys(GT).map(t=>`<button class="b${st[k]===t?' on':''}" data-t="${t}">${t}</button>`).join('');$(id).onclick=e=>{const b=e.target.closest('button');if(!b)return;st[k]=b.dataset.t;document.querySelectorAll(id+' .b').forEach(x=>x.classList.toggle('on',x===b));sfx.click();gates();lrender(true)}};
gsel('#g1s','g1');gsel('#g2s','g2');
function gates(){$('#G1').innerHTML=body(st.g1);$('#G2').innerHTML=body(st.g2)}
const wset=(id,v,dim)=>{const e=$('#'+id);e.classList.toggle('hi',!!v&&!dim);e.classList.toggle('dim',!!dim)};
const tf=x=>x?'True':'False';
let prevO=null;
function lrender(chime){
 const g1=GT[st.g1],g2=GT[st.g2],m=!!g1.f(st.A,st.B),o=!!g2.f(m,st.C);
 wset('wA',st.A);wset('wB',st.B,g1.u);wset('wC',st.C,g2.u);wset('wM',m);wset('wO',o);
 $('#G1').classList.toggle('hi',m);$('#G2').classList.toggle('hi',o);
 document.querySelectorAll('.sw').forEach(s=>s.classList.toggle('on',st[s.dataset.k]));
 const led=$('#led');led.classList.remove('on');void led.getBoundingClientRect();led.classList.toggle('on',o);$('#ot').textContent=tf(o);
 const e1=g1.py('A','B'),e2=g2.py(`(${e1})`,'C'),s1=g1.py(tf(st.A),tf(st.B)),s2=g2.py(`(${s1})`,tf(st.C)),p='<i>&gt;&gt;&gt;</i> ';
 $('#lcon').innerHTML=`${p}A, B, C = ${tf(st.A)}, ${tf(st.B)}, ${tf(st.C)}\n${p}<b>${e2}</b>\n<i># ${s2}</i>\n<span class="rs ${o?'':'F'}">${tf(o)}</span>`;
 let h='<tr><th>A</th><th>B</th><th>C</th><th>stage 1</th><th>out</th></tr>';const cur=(st.A?4:0)+(st.B?2:0)+(st.C?1:0);
 for(let i=0;i<8;i++){const a=!!(i&4),b=!!(i&2),c=!!(i&1),mm=!!g1.f(a,b),oo=!!g2.f(mm,c),z=x=>`<td class="${x?'one':'zero'}">${cfg.tbl==='10'?+x:x?'T':'F'}</td>`;h+=`<tr data-i="${i}" class="${i===cur?'cur':''}">${z(a)}${z(b)}${z(c)}${z(mm)}${z(oo)}</tr>`}
 $('#tt').innerHTML=h;pyRun();
 if(chime&&prevO!==null&&prevO!==o)o?sfx.win():sfx.bad();prevO=o}
document.querySelectorAll('.sw').forEach(s=>{const t=()=>{const k=s.dataset.k;st[k]=!st[k];st[k]?sfx.on():sfx.off();lrender(true)};s.onclick=t;s.onkeydown=e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();t()}}});
$('#tt').onclick=e=>{const r=e.target.closest('tr[data-i]');if(!r)return;const i=+r.dataset.i;st.A=!!(i&4);st.B=!!(i&2);st.C=!!(i&1);sfx.click();lrender(true)};
function pyEval(src){
 const toks=src.match(/\s*(\d+|\w+|[()]|==|!=|'[^']*'|"[^"]*"|\S)/g)||[];let js='';
 for(let t of toks){t=t.trim();
  if(t==='and')js+='&&';else if(t==='or')js+='||';else if(t==='not')js+='!';
  else if(t==='True')js+='true';else if(t==='False')js+='false';else if(t==='None')js+='null';
  else if(/^[ABC]$/.test(t))js+=st[t];
  else if(/^\d+$|^[()]$|^[=!]=$|^'[^']*'$|^"[^"]*"$/.test(t))js+=t;
  else throw new Error(`SyntaxError: unexpected '${t}'`);js+=' '}
 const r=Function(`"use strict";return(${js})`)();
 return r===true?'True':r===false?'False':r===null?'None':typeof r==='string'?`'${r}'`:String(r)}
function pyRun(){const s=$('#py').value.trim(),o=$('#pyo');if(!s){o.innerHTML='';return}
 try{const r=pyEval(s);o.innerHTML=`<i>&gt;&gt;&gt;</i> <b>${s.replace(/</g,'&lt;')}</b>\n<span class="rs ${r==='False'||r==='None'||r==='0'?'F':''}">${r}</span>`}catch(e){o.innerHTML=`<span class="rs F">SyntaxError: invalid expression</span>`}}
$('#py').oninput=()=>{pyRun();sfx.click()};
gates();lrender();route();
const FONTS={orb:'Orbitron,"Segoe UI",system-ui,sans-serif',sans:'system-ui,"Segoe UI",sans-serif',serif:'Georgia,"Times New Roman",serif',mono:'ui-monospace,Menlo,Consolas,monospace'};
const PRE={Default:null,Aurora:['#5eead4','#a78bfa','#f0abfc'],Sunset:['#ff9a3c','#ff3d7f','#ffe14d'],Ocean:['#38bdf8','#6366f1','#34d399'],Candy:['#ff5fa2','#7c5cff','#3df5c4'],Matrix:['#00ff6a','#00c2ff','#eaff00']};
$('#pre').innerHTML=Object.keys(PRE).map(k=>`<button class="b" data-k="${k}">${k}</button>`).join('');
$('#pre').onclick=e=>{const b=e.target.closest('button');if(!b)return;cfg.c=PRE[b.dataset.k];apply();sfx.win()};
const isP=n=>n>1&&Array.from({length:n-2},(_,i)=>i+2).every(d=>n%d);
const PV=[['Evens vs multiples of 3',n=>n%2==0,n=>n%3==0],['Primes vs odds',isP,n=>n%2==1],['Powers of 2 vs squares',n=>(n&(n-1))==0,n=>Number.isInteger(Math.sqrt(n))],['Lower vs upper, overlapping',n=>n<=cfg.uni*.6,n=>n>cfg.uni*.4]];
$('#pset').innerHTML='<option>Preset sets…</option>'+PV.map((p,i)=>`<option value="${i}">${p[0]}</option>`).join('');
$('#pset').onchange=e=>{const p=PV[e.target.value];if(!p)return;const r=Array.from({length:cfg.uni},(_,i)=>i+1);A=new Set(r.filter(p[1]));B=new Set(r.filter(p[2]));syncIn();sfx.whoosh();render(true);e.target.selectedIndex=0};
const cn=(v,d)=>v.replace(/[^A-Za-z0-9_]/g,'').replace(/^\d+/,'').slice(0,6)||d;
function apply(){const d=document.documentElement,s=d.style,sv=(id,v)=>{const e=$('#'+id);if(document.activeElement!==e)e[e.type==='checkbox'?'checked':'value']=v};
 if(cfg.nA===cfg.nB)cfg.nB+='_';
 if(cfg.mode==='auto')delete d.dataset.theme;else d.dataset.theme=cfg.mode;
 ['--c1','--c2','--c3'].forEach((k,i)=>cfg.c?s.setProperty(k,cfg.c[i]):s.removeProperty(k));
 s.setProperty('--spd',1/cfg.spd);s.setProperty('--disp',FONTS[cfg.fnt]||FONTS.orb);d.classList.toggle('fx',!!cfg.fxo);
 $('#thm').textContent='Theme: '+cfg.mode;
 const cs=getComputedStyle(d);['--c1','--c2','--c3'].forEach((k,i)=>sv('k'+(i+1),cfg.c?cfg.c[i]:cs.getPropertyValue(k).trim()));
 Object.keys(DEF).filter(k=>k!=='c').forEach(k=>sv(k==='nA'||k==='nB'?k:k,cfg[k]));
 $('#vspd').textContent='x'+cfg.spd;$('#vden').textContent=cfg.den;$('#vun').textContent=cfg.uni;
 $('#labA').textContent=$('#lbA').textContent=cfg.nA;$('#labB').textContent=$('#lbB').textContent=cfg.nB;
 buildOps();render();if(!raf)bg();save()}
const bd=(id,k,f=x=>x)=>$('#'+id).addEventListener('input',e=>{const t=e.target;cfg[k]=f(t.type==='checkbox'?t.checked:t.value);apply()});
bd('spd','spd',parseFloat);bd('den','den',Number);bd('fxo','fxo');bd('vol','vol',parseFloat);bd('wav','wav');bd('uni','uni',Number);bd('mode','mode');bd('fnt','fnt');bd('nA','nA',v=>cn(v,'A'));bd('nB','nB',v=>cn(v,'B'));
$('#tbl').oninput=e=>{cfg.tbl=e.target.value;apply();lrender()};
['k1','k2','k3'].forEach(k=>$('#'+k).addEventListener('input',()=>{cfg.c=['k1','k2','k3'].map(i=>$('#'+i).value);apply()}));
$('#vol').addEventListener('change',()=>sfx.win());
$('#cfg').onclick=()=>{$('#dw').classList.add('open');sfx.click()};
const cl=()=>$('#dw').classList.remove('open');$('#cx').onclick=cl;addEventListener('keydown',e=>e.key==='Escape'&&cl());
$('#cr').onclick=()=>{cfg={...DEF};apply();lrender();sfx.whoosh()};
apply();
