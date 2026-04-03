// Game Symbols
const symbols = ['🎂','✨','🎁'];
let cards = [...symbols, ...symbols].sort(() => Math.random()-0.5);
let first=null, lock=false, matches=0, cakeHits=0;

// Guest Name
const params = new URLSearchParams(window.location.search);
const name = params.get("name") || "Friend";
document.getElementById("guestName").textContent = name;
document.getElementById("finalName").textContent = name;

// Show screen
function show(id){
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// Start Memory Game
function startGame(){
  show("memory");
  buildGrid();
  startMemoryTimer();
}

// Build Memory Grid
function buildGrid(){
  const grid = document.getElementById("grid");
  grid.innerHTML = "";
  cards.forEach(sym => {
    const card=document.createElement("div");
    card.className="card hidden";
    card.dataset.sym=sym;
    card.textContent=sym;
    card.onclick=()=>flip(card);
    grid.appendChild(card);
  });
}

// Flip Logic
function flip(card){
  if(lock || !card.classList.contains("hidden")) return;
  card.classList.remove("hidden");
  if(!first){ first=card; return; }
  if(first.dataset.sym===card.dataset.sym){
    first.classList.add("matched"); card.classList.add("matched");
    matches++; first=null;
    if(matches===3) setTimeout(startCakes,800);
  } else {
    lock=true;
    setTimeout(()=>{
      first.classList.add("hidden"); card.classList.add("hidden");
      first=null; lock=false;
    },700);
  }
}

// Memory Timer
function startMemoryTimer(){
  let time=15;
  const timer=document.getElementById("timer");
  timer.textContent=time;
  const interval=setInterval(()=>{
    time--; timer.textContent=time;
    if(matches===3) clearInterval(interval);
    if(time<=0 && matches<3){ clearInterval(interval); alert("Try again ✨"); location.reload(); }
  },1000);
}

// Cake Game
function startCakes(){
  show("cakes");
  cakeHits=0; document.getElementById("progress").textContent="0 / 3";
  spawnCake();
  let sec=10;
  const interval=setInterval(()=>{
    sec--;
    if(cakeHits>=3){ clearInterval(interval); setTimeout(()=>show("reveal"),500); startCountdown(); }
    if(sec<=0 && cakeHits<3){ clearInterval(interval); alert("Almost 😭"); location.reload(); }
  },1000);
}

function spawnCake(){
  const area=document.getElementById("cakeArea"); area.innerHTML="";
  const cake=document.createElement("div"); cake.className="cake"; cake.textContent="🎂";
  cake.style.left=Math.random()*75+"%"; cake.style.top=Math.random()*65+"%";
  cake.onclick=()=>{
    cakeHits++;
    document.getElementById("progress").textContent=cakeHits+" / 3";
    cake.style.transform="scale(1.3)";
    setTimeout(()=>{ if(cakeHits<3) spawnCake(); else show("reveal"); },180);
  };
  area.appendChild(cake);
}

// Open Map
function openMap(){ window.open("https://maps.app.goo.gl/3wQPK2Gom9dQjLSw6?g_st=ic","_blank"); }

// Countdown Timer
function startCountdown(){
  const countEl=document.getElementById("countdown");
  const eventDate=new Date("April 9, 2026 12:00:00").getTime();
  const interval=setInterval(()=>{
    const now=new Date().getTime();
    const distance=eventDate-now;
    if(distance<0){ clearInterval(interval); countEl.textContent="It's time! 🎉"; return; }
    const days=Math.floor(distance/(1000*60*60*24));
    const hours=Math.floor((distance%(1000*60*60*24))/(1000*60*60));
    const minutes=Math.floor((distance%(1000*60*60))/(1000*60));
    const seconds=Math.floor((distance%(1000*60))/1000);
    countEl.textContent=`${days}d ${hours}h ${minutes}m ${seconds}s`;
  },1000);
}

// Floating particles
const canvas=document.getElementById("particles"); const ctx=canvas.getContext("2d");
canvas.width=window.innerWidth; canvas.height=window.innerHeight;
const particlesArray=[];
for(let i=0;i<80;i++){
  particlesArray.push({x:Math.random()*canvas.width, y:Math.random()*canvas.height, r:Math.random()*2+1, d:Math.random()*1.5});
}
function drawParticles(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle="rgba(247,243,235,0.5)";
  particlesArray.forEach(p=>{
    ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2,false); ctx.fill();
    p.y+=0.4; if(p.y>canvas.height) p.y=0;
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();
window.addEventListener("resize",()=>{ canvas.width=window.innerWidth; canvas.height=window.innerHeight; });