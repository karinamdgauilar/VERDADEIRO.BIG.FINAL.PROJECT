let mic;
let fft;
let audioAtivo = false;
let congelado = false;

let volSuave = 0;
let gravesSuave = 0;
let agudosSuave = 0;
let faseNoise = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  noFill();
}

function draw() {
  // Fundo com motion blur
  background(15, 17, 21, 45);

  // Se o áudio ainda não estiver ativo, corre uma animação ambiente suave
  if (!audioAtivo) {
    faseNoise += 0.008;
    volSuave = 0.2; // Volume simulado leve para animar a forma de boas-vindas
    agudosSuave = 100;
    gravesSuave = 50;
  } else {
    // Se estiver ativo, lê os dados reais do microfone
    if (!congelado) {
      let volAtual = mic.getLevel();
      fft.analyze();
      let graves = fft.getEnergy("bass");
      let agudos = fft.getEnergy("treble");

      volSuave = lerp(volSuave, volAtual, 0.15);
      gravesSuave = lerp(gravesSuave, graves, 0.15);
      agudosSuave = lerp(agudosSuave, agudos, 0.15);

      faseNoise += 0.005 + (volSuave * 0.08);
    }
  }

  // Desenha a forma paramétrica central
  push();
  translate(width / 2, height / 2);

  let numAneis = floor(map(agudosSuave, 0, 255, 8, 28));
  let raioBase = min(width, height) * 0.12;
  let deformacaoMax = map(gravesSuave, 0, 255, 10, 160);

  for (let i = 0; i < numAneis; i++) {
    let progresso = i / numAneis;
    
    let corAnel = lerpColor(
      color(45, 110, 180, 150), 
      color(220, 245, 255, 230), 
      progresso * (volSuave * 4)
    );
    stroke(corAnel);
    strokeWeight(map(i, 0, numAneis, 2.2, 0.6));

    beginShape();
    for (let angulo = 0; angulo < 360; angulo += 4) {
      let xOff = map(cos(angulo), -1, 1, 0, 1.8) + (i * 0.06);
      let yOff = map(sin(angulo), -1, 1, 0, 1.8) + (i * 0.06);
      let n = noise(xOff, yOff, faseNoise);

      let raioAtual = raioBase + (i * 11) + map(n, 0, 1, -deformacaoMax, deformacaoMax) * progresso;

      let x = raioAtual * cos(angulo);
      let y = raioAtual * sin(angulo);
      vertex(x, y);
    }
    endShape(CLOSE);
  }
  pop();

  // Mostra apenas instruções discretas no rodapé depois de o utilizador interagir, ou mantém completamente limpo
  if (audioAtivo) {
    desenharInterface();
  }
}

function mousePressed() {
  if (!audioAtivo) {
    userStartAudio().then(() => {
      mic = new p5.AudioIn();
      mic.start(() => {
        fft = new p5.FFT(0.8, 64);
        fft.setInput(mic);
        audioAtivo = true;
      });
    });
  }
}

function keyPressed() {
  if (!audioAtivo) return;

  if (key === ' ') {
    congelado = !congelado;
  }
  if (key === 's' || key === 'S') {
    saveCanvas('EcoForma_Padrao', 'png');
  }
}

function desenharInterface() {
  noStroke();
  fill(180);
  textAlign(LEFT, BOTTOM);
  textSize(12);
  let estado = congelado ? "[CONGELADO]" : "[EM CAPTAÇÃO]";
  text(`${estado}  |  ESPAÇO: Congelar forma  |  S: Exportar PNG`, 24, height - 20);
  
  textAlign(RIGHT, BOTTOM);
  text(`Graves: ${floor(gravesSuave)}  |  Agudos: ${floor(agudosSuave)}`, width - 24, height - 20);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}