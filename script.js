// ── LOADER ──
let pct = 0;
const lpct = document.getElementById('lpct');
const ldr = document.getElementById('loader');
const lInt = setInterval(() => {
  pct += Math.floor(Math.random() * 12) + 4;
  if (pct >= 100) { pct = 100; clearInterval(lInt); }
  lpct.textContent = pct + '%';
  if (pct === 100) {
    setTimeout(() => { ldr.classList.add('done'); startCounters(); }, 400);
  }
}, 80);

// ── HERO COUNTERS ──
function startCounters() {
  animCount('c1', 15, '+');
  animCount('c2', 7, '+');
  animCount('c3', 3, '+');
}
function animCount(id, target, suf) {
  const el = document.getElementById(id);
  let n = 0;
  const iv = setInterval(() => {
    n = Math.min(n + Math.ceil(target / 20), target);
    el.textContent = n + suf;
    if (n >= target) clearInterval(iv);
  }, 60);
}

// ── CURSOR ──
const cur = document.getElementById('cur');
const curTrail = document.getElementById('cur-trail');
const curLabel = document.getElementById('cur-label');
let mx = 0, my = 0, tx = 0, ty = 0;
const trailCols = ['#E8A0BF','#89B4FF','#B5D99C','#F0C060','#F4845F','#C9B1FF'];
let ci = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left = mx + 'px';
  cur.style.top = my + 'px';
  curLabel.style.left = mx + 'px';
  curLabel.style.top = my + 'px';
  if (Math.random() < 0.05) { ci = (ci+1) % trailCols.length; curTrail.style.background = trailCols[ci]; }
});

document.addEventListener('mousedown', () => cur.classList.add('clicking'));
document.addEventListener('mouseup', () => cur.classList.remove('clicking'));

(function animT() {
  tx += (mx - tx) * 0.09;
  ty += (my - ty) * 0.09;
  curTrail.style.left = tx + 'px';
  curTrail.style.top = ty + 'px';
  requestAnimationFrame(animT);
})();

// ── HERO CANVAS ──
const cv = document.getElementById('hcanvas');
const ctx = cv.getContext('2d');
const SHAPE_COUNT = 9;
let W, H, DPR = 1;
function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = cv.offsetWidth;
  H = cv.offsetHeight;
  cv.width = Math.round(W * DPR);
  cv.height = Math.round(H * DPR);
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
}
resize(); window.addEventListener('resize', resize);

const SHAPE_IMGS = Array.from({length: SHAPE_COUNT}, (_, i) => {
  const img = new Image();
  img.src = `assets/shapes/shape-${String(i + 1).padStart(2, '0')}.png`;
  return img;
});
const parts = [];

class P {
  constructor(x, y, fm) {
    this.x=x; this.y=y;
    this.sz = fm ? (36+Math.random()*72) : (24+Math.random()*88);
    this.shIdx = Math.floor(Math.random()*SHAPE_COUNT);
    this.al = 0;
    this.tal = fm ? (0.35+Math.random()*0.5) : (0.12+Math.random()*0.16);
    this.rot = Math.random()*Math.PI*2;
    this.rs = (Math.random()-.5)*0.02;
    this.vx = (Math.random()-.5)*(fm?2:.55);
    this.vy = (Math.random()-.5)*(fm?2:.55);
    this.life = 1;
    this.dec = fm ? (.008+Math.random()*.008) : (.001+Math.random()*.0022);
  }
  update() {
    this.x+=this.vx; this.y+=this.vy; this.rot+=this.rs;
    this.al += (this.tal*this.life - this.al)*0.1;
    this.life -= this.dec;
    return this.life > 0;
  }
  draw(c) {
    const img = SHAPE_IMGS[this.shIdx];
    if(!img.complete || !img.naturalWidth) return;
    c.save();
    c.globalAlpha = Math.max(0, this.al);
    c.translate(this.x, this.y);
    c.rotate(this.rot);
    const s = this.sz;
    c.drawImage(img, -s/2, -s/2, s, s);
    c.restore();
  }
}

setInterval(() => { if(parts.length<55) parts.push(new P(Math.random()*W,Math.random()*H,false)); }, 480);
document.getElementById('hero').addEventListener('mousemove', e => {
  const r = cv.getBoundingClientRect();
  if(Math.random()<.52) parts.push(new P(e.clientX-r.left+(Math.random()-.5)*28, e.clientY-r.top+(Math.random()-.5)*28, true));
});
document.getElementById('hero').addEventListener('touchmove', e => {
  const r = cv.getBoundingClientRect();
  for (const t of e.touches) {
    parts.push(new P(t.clientX-r.left+(Math.random()-.5)*28, t.clientY-r.top+(Math.random()-.5)*28, true));
  }
}, { passive: true });
document.getElementById('hero').addEventListener('touchstart', e => {
  const r = cv.getBoundingClientRect();
  for (const t of e.touches) {
    for (let i=0;i<4;i++) parts.push(new P(t.clientX-r.left+(Math.random()-.5)*40, t.clientY-r.top+(Math.random()-.5)*40, true));
  }
}, { passive: true });

(function animC() {
  ctx.clearRect(0,0,W,H);
  for(let i=parts.length-1;i>=0;i--){ if(!parts[i].update()){parts.splice(i,1);continue;} parts[i].draw(ctx); }
  requestAnimationFrame(animC);
})();

// ── TYPEWRITER — About ──
const tw_lines = ['I see it.','I like it.','I learn it.','I conquer it.'];
let tw_li=0, tw_ci=0, tw_el=document.getElementById('tw-text'), tw_dir=1;
function tw() {
  const l = tw_lines[tw_li];
  if(tw_dir===1){ tw_el.textContent=l.slice(0,tw_ci); tw_ci++; if(tw_ci>l.length){tw_dir=-1;setTimeout(tw,1600);return;} setTimeout(tw,75+Math.random()*60); }
  else { tw_el.textContent=l.slice(0,tw_ci); tw_ci--; if(tw_ci<0){tw_ci=0;tw_dir=1;tw_li=(tw_li+1)%tw_lines.length;setTimeout(tw,380);return;} setTimeout(tw,35+Math.random()*28); }
}
tw();

// ── TYPEWRITER — Skills ──
const sk_lines = ['What I Bring.','My Toolkit.','Let\u2019s Build.','Make Magic.'];
let sk_li=0, sk_ci=0, sk_el=document.getElementById('sk-tw'), sk_dir=1;
function skTw() {
  if(!sk_el)return;
  const l=sk_lines[sk_li];
  if(sk_dir===1){ sk_el.textContent=l.slice(0,sk_ci); sk_ci++; if(sk_ci>l.length){sk_dir=-1;setTimeout(skTw,1700);return;} setTimeout(skTw,78+Math.random()*55); }
  else { sk_el.textContent=l.slice(0,sk_ci); sk_ci--; if(sk_ci<0){sk_ci=0;sk_dir=1;sk_li=(sk_li+1)%sk_lines.length;setTimeout(skTw,380);return;} setTimeout(skTw,35+Math.random()*28); }
}
setTimeout(skTw,1100);

// ── SKILL BUBBLES ──
const bd = [
  {name:'Python',pct:'87',col:'var(--orange)',w:112,h:112,x:'3%',y:'1%',r:true},
  {name:'JavaScript',pct:'88',col:'var(--blue)',w:98,h:98,x:'55%',y:'7%',r:false},
  {name:'Flask',pct:'83',col:'var(--lime)',w:92,h:92,x:'76%',y:'30%',r:true},
  {name:'Dictionarry Apps',pct:'94',col:'var(--gold)',w:106,h:106,x:'7%',y:'48%',r:false},
  {name:'Panda',pct:'60',col:'var(--pink)',w:90,h:90,x:'40%',y:'46%',r:true},
  {name:'Gdocs',pct:'90',col:'var(--silver)',w:78,h:78,x:'62%',y:'56%',r:false},
  {name:'Canva',pct:'95',col:'var(--orange)',w:74,h:74,x:'22%',y:'70%',r:true},
  {name:'Excel',pct:'79',col:'var(--purple)',w:70,h:70,x:'78%',y:'75%',r:false},
];
const sksc = document.getElementById('sksc');
if(sksc){ bd.forEach((b,i)=>{
  const el=document.createElement('div'); el.className='sbb';
  const rotate = (i % 3 - 1) * 7;
  el.style.cssText = `left:${b.x};top:${b.y};border-radius:${b.r ? '50%' : '10px'};border-color:${b.col};color:${b.col};--bubble-rot:${rotate}deg;animation:bubblefloat ${8 + i * 1.5}s ${i * .38}s ease-in-out infinite;`;
  el.innerHTML=`<span class="sbp">${b.pct}</span>${b.name}`;
  sksc.appendChild(el);
});}

// ── SCROLL REVEAL ──
const revEls = document.querySelectorAll('.reveal,.reveal-left,.reveal-diag');
const io = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);} });
},{threshold:.08,rootMargin:'0px 0px -24px 0px'});
revEls.forEach(el=>io.observe(el));

// ── SKILL BAR TRIGGER ──
const fills=document.querySelectorAll('.skbar-fill');
const fio=new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting){const f=e.target;setTimeout(()=>{f.style.width=f.dataset.w+'%';},120);fio.unobserve(f);} });
},{threshold:.1});
fills.forEach(f=>fio.observe(f));

// ── SECTION NAV DOTS ──
const secs = ['hero','about','exp','skills','contact'];
const dots = document.querySelectorAll('.ndot');
const dotIO = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    const id=e.target.id;
    const idx=secs.indexOf(id);
    if(idx===-1)return;
    if(e.isIntersecting){ dots.forEach(d=>d.classList.remove('active')); dots[idx].classList.add('active'); }
  });
},{threshold:.3});
secs.forEach(id=>{ const el=document.getElementById(id); if(el)dotIO.observe(el); });
dots.forEach((d,i)=>{ d.addEventListener('click',()=>{ document.getElementById(secs[i]).scrollIntoView({behavior:'smooth'}); }); });

// ── WORD-BY-SCROLL REVEAL (about description) ──
const descEl = document.getElementById('about-desc');
if (descEl) {
  const words = descEl.querySelectorAll('.w');
  // Map each word's position relative to viewport
  function updateWords() {
    const viewH = window.innerHeight;
    words.forEach((w, i) => {
      const rect = w.getBoundingClientRect();
      // Progressive: word lights up when it's in the lower 80% of the viewport
      const progress = (viewH - rect.top) / (viewH * 0.6);
      // Also factor in word index for stagger
      const threshold = 0.2 + (i / words.length) * 0.5;
      if (progress > threshold) {
        w.classList.add('lit');
      } else {
        w.classList.remove('lit');
      }
    });
  }
  window.addEventListener('scroll', updateWords, { passive: true });
  updateWords();
}

// ── STAT COUNTER — spins 1 → target then stops ──
function runCounter(slotId, target, duration) {
  const slot = document.getElementById(slotId);
  if (!slot) return;
  const inner = slot.querySelector('.sn-slot-inner');
  if (!inner) return;

  let html = '';
  for (let i = 1; i <= target; i++) html += `<span>${i}</span>`;
  inner.innerHTML = html;
  inner.style.transform = 'translateY(0)';

  const first = inner.querySelector('span');
  if (!first) return;
  const itemH = parseFloat(getComputedStyle(first).height) || 38.4;

  const maxIdx = target - 1;
  let start = null;

  function frame(ts) {
    if (!start) start = ts;
    const p = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const idx = Math.round(eased * maxIdx);
    inner.style.transform = `translateY(-${idx * itemH}px)`;
    if (p < 1) requestAnimationFrame(frame);
    else inner.style.transform = `translateY(-${maxIdx * itemH}px)`;
  }
  requestAnimationFrame(frame);
}

const statsRow = document.getElementById('stats-row');
if (statsRow) {
  let ran = false;
  const statIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !ran) {
        ran = true;
        runCounter('slot0', 3, 1400);
        runCounter('slot1', 15, 2200);
        runCounter('slot2', 7, 1800);
        statIO.unobserve(statsRow);
      }
    });
  }, { threshold: 0.35 });
  statIO.observe(statsRow);
}

// ── MESSENGER CAROUSEL (folders) ──
const msgOverlay = document.getElementById('msg-overlay');
const msgClose = document.getElementById('msg-close');
const msgCarousel = document.getElementById('msg-carousel');
const deskFolders = document.querySelectorAll('.desk-folder');
const msgCards = document.querySelectorAll('.msg-card');

function getVisibleMsgCards() {
  return Array.from(msgCards).filter(c => !c.classList.contains('hidden'));
}

function scrollToCard(card) {
  if (!msgCarousel || !card) return;
  const left = card.offsetLeft - (msgCarousel.clientWidth - card.offsetWidth) / 2;
  msgCarousel.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
  msgCards.forEach(c => c.classList.remove('is-focus'));
  card.classList.add('is-focus');
}

function openMsgCarousel(cardKey) {
  closeCtxMenu();
  msgCards.forEach(c => c.classList.toggle('hidden', c.dataset.card !== cardKey));
  msgOverlay.classList.add('open');
  msgOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  const visibleCards = getVisibleMsgCards();
  requestAnimationFrame(() => scrollToCard(visibleCards[0]));
}

function closeMsgPop() {
  msgOverlay.classList.remove('open');
  msgOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  msgCards.forEach(c => c.classList.remove('is-focus'));
}

deskFolders.forEach(f => {
  f.addEventListener('click', e => {
    e.stopPropagation();
    openMsgCarousel(f.dataset.card || 'school');
  });
});
if (msgClose) msgClose.addEventListener('click', closeMsgPop);
if (msgOverlay) msgOverlay.addEventListener('click', e => { if (e.target === msgOverlay) closeMsgPop(); });

if (msgCarousel) {
  msgCarousel.addEventListener('scroll', () => {
    const center = msgCarousel.scrollLeft + msgCarousel.clientWidth / 2;
    let closest = null, minDist = Infinity;
    msgCards.forEach(card => {
      if (card.classList.contains('hidden')) return;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(center - cardCenter);
      if (dist < minDist) { minDist = dist; closest = card; }
    });
    msgCards.forEach(c => c.classList.remove('is-focus'));
    if (closest) closest.classList.add('is-focus');
  }, { passive: true });
}

// ── CONTEXT MENU (images) ──
const ctxMenu = document.getElementById('ctx-menu');
const ctxBackdrop = document.getElementById('ctx-backdrop');
const deskFiles = document.querySelectorAll('.desk-file');

function openCtxMenu(file, x, y) {
  document.getElementById('ctx-date').textContent = file.dataset.date || '';
  document.getElementById('ctx-title').textContent = file.dataset.title || '';
  document.getElementById('ctx-desc').textContent = file.dataset.desc || '';
  const mw = 280, mh = 180;
  let left = x, top = y;
  if (left + mw > window.innerWidth - 12) left = window.innerWidth - mw - 12;
  if (top + mh > window.innerHeight - 12) top = window.innerHeight - mh - 12;
  left = Math.max(12, left);
  top = Math.max(12, top);
  ctxMenu.style.left = left + 'px';
  ctxMenu.style.top = top + 'px';
  ctxBackdrop.classList.add('open');
  ctxMenu.classList.add('open');
  ctxMenu.setAttribute('aria-hidden', 'false');
}
function closeCtxMenu() {
  ctxBackdrop.classList.remove('open');
  ctxMenu.classList.remove('open');
  ctxMenu.setAttribute('aria-hidden', 'true');
}
deskFiles.forEach(f => {
  f.addEventListener('click', e => {
    e.stopPropagation();
    closeMsgPop();
    const r = f.getBoundingClientRect();
    openCtxMenu(f, r.left + r.width / 2 - 40, r.bottom + 8);
  });
});
if (ctxBackdrop) ctxBackdrop.addEventListener('click', closeCtxMenu);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeMsgPop(); closeCtxMenu(); }
});
document.addEventListener('click', () => { closeCtxMenu(); });