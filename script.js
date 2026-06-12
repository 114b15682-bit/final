let started = false;

let particles = [];
let rifts = [];

let theme = 0;

let themes = [
  {
    bg:[5,5,20],
    glow:[0,255,255]
  },
  {
    bg:[0,30,40],
    glow:[0,180,255]
  },
  {
    bg:[10,40,10],
    glow:[0,255,100]
  },
  {
    bg:[20,0,40],
    glow:[255,0,255]
  }
];

class Particle{

  constructor(){

    this.x=random(width);
    this.y=random(height);

    this.size=random(1,4);

    this.speed=random(0.2,1);
  }

  update(){

    this.y-=this.speed;

    if(this.y<0){
      this.y=height;
    }
  }

  display(){

    fill(255,100);

    noStroke();

    circle(
      this.x,
      this.y,
      this.size
    );
  }
}

class Rift{

  constructor(x,y){

    this.x=x;
    this.y=y;

    this.life=255;
  }

  update(){

    this.life-=3;
  }

  display(){

    push();

    translate(this.x,this.y);

    stroke(255,this.life);

    noFill();

    for(let i=0;i<5;i++){

      let len=30+i*15;

      line(
        0,
        0,
        random(-len,len),
        random(-len,len)
      );
    }

    pop();
  }
}

function setup(){

  let canvas=createCanvas(
    windowWidth,
    windowHeight
  );

  canvas.position(0,0);

  noLoop();

  for(let i=0;i<300;i++){

    particles.push(
      new Particle()
    );
  }

  document
    .getElementById("startBtn")
    .addEventListener("click",()=>{

      document
      .getElementById("landing")
      .style.display="none";

      started=true;

      loop();
    });
}

function draw(){

  if(!started) return;

  let t=themes[theme];

  background(
    t.bg[0],
    t.bg[1],
    t.bg[2],
    50
  );

  for(let p of particles){

    p.update();
    p.display();
  }

  drawPortal();

  for(let i=rifts.length-1;i>=0;i--){

    rifts[i].update();
    rifts[i].display();

    if(rifts[i].life<0){

      rifts.splice(i,1);
    }
  }
}

function drawPortal(){

  push();

  translate(
    width/2,
    height/2
  );

  let t=themes[theme];

  drawingContext.shadowBlur=40;

  drawingContext.shadowColor=
  `rgb(
  ${t.glow[0]},
  ${t.glow[1]},
  ${t.glow[2]}
  )`;

  stroke(
    t.glow[0],
    t.glow[1],
    t.glow[2]
  );

  strokeWeight(3);

  noFill();

  beginShape();

  let offset=
  map(
    mouseX,
    0,
    width,
    0,
    2
  );

  for(
    let a=0;
    a<TWO_PI;
    a+=0.05
  ){

    let n=noise(
      cos(a)+frameCount*0.01,
      sin(a)+frameCount*0.01
    );

    let r=
    180+
    n*70+
    offset*20;

    let x=
    cos(a)*r;

    let y=
    sin(a)*r;

    vertex(x,y);
  }

  endShape(CLOSE);

  rotate(frameCount*0.005);

  ellipse(0,0,450);
  ellipse(0,0,520);

  pop();
}

function mousePressed(){

  if(!started) return;

  rifts.push(
    new Rift(
      mouseX,
      mouseY
    )
  );
}

function keyPressed(){

  if(key==" "){

    theme++;

    theme%=themes.length;
  }

  if(key=="s"||key=="S"){

    saveCanvas(
      "dream_dimension",
      "png"
    );
  }
}

function windowResized(){

  resizeCanvas(
    windowWidth,
    windowHeight
  );
}