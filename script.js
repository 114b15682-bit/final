let started = false;

let particles = [];
let orbs = [];

let theme = 0;
let blackHole = false;
let shake = 0;

let colors = [
  [0,255,255],
  [255,0,255],
  [0,255,120],
  [255,180,0]
];

let dreams = [
  "Cyber Forest",
  "Neon Ocean",
  "Crystal Galaxy",
  "Lost Dimension"
];

let currentDream = "";

function setup(){
  createCanvas(windowWidth, windowHeight);

  for(let i=0;i<400;i++){
    particles.push({
      x:random(width),
      y:random(height),
      s:random(1,3),
      sp:random(0.5,2)
    });
  }

  currentDream = random(dreams);

  // 📖 HUD 點擊關閉（只會關一次，不會誤消失）
  let hud = document.getElementById("hud");

  hud.addEventListener("click", () => {
    hud.style.opacity = 0;

    setTimeout(() => {
      hud.style.display = "none";
    }, 600);
  });
}

function draw(){

  if(!started){
    background(0);
    return;
  }

  let c = colors[theme];

  background(5,10,20,25);

  shake *= 0.9;

  translate(random(-shake,shake), random(-shake,shake));

  drawParticles();
  drawOrbs();
  drawPortal(c);
  drawUI();
}

/* 🌌 粒子 */
function drawParticles(){

  for(let p of particles){

    noStroke();
    fill(255,120);
    circle(p.x,p.y,p.s);

    // 黑洞（不會破壞畫面版本）
    if(blackHole){

      let dx = width/2 - p.x;
      let dy = height/2 - p.y;

      let dist = sqrt(dx*dx + dy*dy);

      let force = map(dist,0,width,0.08,0);

      p.x += dx * force;
      p.y += dy * force;
    }

    p.y -= p.sp;

    if(p.y < 0){
      p.y = height;
      p.x = random(width);
    }
  }
}

/* 💫 能量球 */
function drawOrbs(){

  for(let i=orbs.length-1;i>=0;i--){

    noStroke();
    fill(0,255,255,orbs[i].life);

    circle(orbs[i].x,orbs[i].y,20);

    orbs[i].life -= 5;

    if(orbs[i].life < 0){
      orbs.splice(i,1);
    }
  }
}

/* 🌀 傳送門 */
function drawPortal(c){

  push();
  translate(width/2, height/2);

  let t = frameCount * 0.01;

  drawingContext.shadowBlur = 60;
  drawingContext.shadowColor =
    `rgb(${c[0]},${c[1]},${c[2]})`;

  noFill();
  strokeWeight(2);

  // 多層能量圈
  for(let i=0;i<5;i++){

    stroke(c[0],c[1],c[2],80-i*12);

    beginShape();

    for(let a=0;a<TWO_PI;a+=0.05){

      let n = noise(
        cos(a)*2 + t,
        sin(a)*2 + t
      );

      let r = 160 + i*25 + n*90;

      let x = cos(a + t*0.5) * r;
      let y = sin(a + t*0.5) * r;

      vertex(x,y);
    }

    endShape(CLOSE);
  }

  // 核心漩渦
  stroke(c[0],c[1],c[2]);
  strokeWeight(3);

  beginShape();

  for(let a=0;a<TWO_PI;a+=0.04){

    let n = noise(
      cos(a)+t*2,
      sin(a)+t*2
    );

    let r = 90 + n*140;

    let x = cos(a + t*2) * r;
    let y = sin(a + t*2) * r;

    vertex(x,y);
  }

  endShape(CLOSE);

  // 核心光球
  noStroke();
  fill(c[0],c[1],c[2],150);

  circle(0,0,30 + sin(frameCount*0.1)*10);

  pop();
}

/* 📜 UI */
function drawUI(){

  fill(255);
  textAlign(CENTER);

  textSize(20);
  text(currentDream, width/2, 60);

  textSize(14);
  text("Space: Theme | B: Black Hole | Click: Rift", width/2, height-40);
}

/* 👆 點擊 */
function mousePressed(){

  if(!started) return;

  orbs.push({
    x:mouseX,
    y:mouseY,
    life:255
  });

  shake = 15;
}

/* ⌨ 控制 */
function keyPressed(){

  if(key === " "){
    theme = (theme + 1) % colors.length;
    currentDream = random(dreams);
  }

  if(key === "b"){
    blackHole = !blackHole;
  }

  if(key === "s"){
    saveCanvas("dream_portal","png");
  }
}

/* 🚀 開始 */
window.onload = () => {

  document.getElementById("startBtn").onclick = () => {
    document.getElementById("landing").style.display = "none";
    started = true;
  };
};

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}
