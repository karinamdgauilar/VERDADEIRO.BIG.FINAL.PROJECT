let video;
let imagemAnterior;
let particulas = [];
const NUM_PARTICULAS = 450;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  video = createCapture(VIDEO);
  video.size(80, 60);
  video.hide();
  
  imagemAnterior = createImage(80, 60);

  for (let i = 0; i < NUM_PARTICULAS; i++) {
    particulas.push(new Particula());
  }
}

function draw() {
  background(0, 40);

  video.loadPixels();
  
  if (video.pixels.length > 0 && imagemAnterior.pixels.length > 0) {
    let cols = video.width;
    let rows = video.height;

    for (let p of particulas) {
      let vx = floor(map(p.x, 0, width, cols - 1, 0, true));
      let vy = floor(map(p.y, 0, height, 0, rows - 1, true));
      let index = (vx + vy * cols) * 4;

      let r = video.pixels[index];
      let g = video.pixels[index + 1];
      let b = video.pixels[index + 2];

      let rAnt = imagemAnterior.pixels[index];
      let gAnt = imagemAnterior.pixels[index + 1];
      let bAnt = imagemAnterior.pixels[index + 2];

      let diferenca = abs(r - rAnt) + abs(g - gAnt) + abs(b - bAnt);

      if (diferenca > 45) {
        p.aplicarForca(diferenca * 0.04);
        p.corAtiva = true;
      } else {
        p.corAtiva = false;
      }

      p.atualizar();
      p.mostrar(r, g, b);
    }

    imagemAnterior.copy(video, 0, 0, cols, rows, 0, 0, cols, rows);
    imagemAnterior.loadPixels();
  } else if (video.pixels.length > 0) {
    imagemAnterior.copy(video, 0, 0, video.width, video.height, 0, 0, video.width, video.height);
    imagemAnterior.loadPixels();
  }
}

class Particula {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.vx = random(-0.5, 0.5);
    this.vy = random(-0.5, 0.5);
    this.tamanhoBase = random(3, 7);
    this.corAtiva = false;
  }

  aplicarForca(intensidade) {
    let angulo = random(TWO_PI);
    this.vx += cos(angulo) * intensidade;
    this.vy += sin(angulo) * intensidade;
  }

  atualizar() {
    this.x += this.vx;
    this.y += this.vy;

    this.vx *= 0.92;
    this.vy *= 0.92;

    this.vx += random(-0.08, 0.08);
    this.vy += random(-0.08, 0.08);

    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;
  }

  mostrar(r, g, b) {
    noStroke();
    if (this.corAtiva) {
      fill(255, 230, 0, 220);
      circle(this.x, this.y, this.tamanhoBase * 2.2);
    } else {
      
      let mediaCor = (r + g + b) / 3;
      fill(mediaCor, 150);
      circle(this.x, this.y, this.tamanhoBase);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}