let video;
let imagemAnterior;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  video = createCapture(VIDEO);
  video.size(90, 70);
  video.hide();
  
  imagemAnterior = createImage(90, 70);
}

function draw() {
  background(10, 12, 18, 70);

  video.loadPixels();
  
  if (video.pixels.length > 0) {
    let cols = video.width;
    let rows = video.height;
    
    let tamanhoCelulaW = width / cols;
    let tamanhoCelulaH = height / rows;

    push();
    translate(width, 0);
    scale(-1, 1);

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        let index = (x + y * cols) * 4;
        
        let r = video.pixels[index];
        let g = video.pixels[index + 1];
        let b = video.pixels[index + 2];
        
        let brilho = (r + g + b) / 3;

        let rAnt = imagemAnterior.pixels[index];
        let gAnt = imagemAnterior.pixels[index + 1];
        let bAnt = imagemAnterior.pixels[index + 2];
        let diferencaMovimento = abs(r - rAnt) + abs(g - gAnt) + abs(b - bAnt);

        let fatorDinamico = map(diferencaMovimento, 0, 120, 0.8, 2.4, true);
        let diametro = map(brilho, 0, 255, 0, tamanhoCelulaW * 1.3) * fatorDinamico;
        
        let posX = x * tamanhoCelulaW + tamanhoCelulaW / 2;
        let posY = y * tamanhoCelulaH + tamanhoCelulaH / 2;

        let corPonto;
        if (diferencaMovimento > 30) {
          corPonto = color(255, 45, 135); 
        } else {
          corPonto = color(r, g, b);
        }

        fill(corPonto);
        noStroke();

        rectMode(CENTER);
        let cantoArredondado = map(diferencaMovimento, 0, 100, 2, 8, true);
        rect(posX, posY, diametro * 0.75, diametro * 0.75, cantoArredondado);
      }
    }
    pop();

    imagemAnterior.copy(video, 0, 0, cols, rows, 0, 0, cols, rows);
    imagemAnterior.loadPixels();
  }

  desenharUI();
}

function desenharUI() {
  noStroke();
  fill(170, 190, 210);
  
  textAlign(RIGHT, BOTTOM);
  textSize(12);
  text("S: Guardar Captura PNG", width - 24, height - 20);
}

function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas('EcoForma_Movimento', 'png');
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}