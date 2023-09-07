const canvas = document.getElementById("Canvas");
const ctx = canvas.getContext("2d");

const tamanhoCelula = 20;
let snake = [{ x: 3, y: 3 }];
let comida = { x: 10, y: 10 };
let direcao = "right";
let placar = 0;
let jogoEmAndamento = false;

const velocidadeCobra = 15; // Quantidade de atualizações do jogo por segundo
let ultimoQuadro = 0;
const fundoverdeImage = new Image();
fundoverdeImage.src = "images/fundo-game.jpg";

function desenhar(tempoAtual) {
  if (!jogoEmAndamento) return;

  const deltaTempo = tempoAtual - ultimoQuadro;

  if (deltaTempo > 950 / velocidadeCobra) {
    ultimoQuadro = tempoAtual;

    // ctx.fillStyle = "red";
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(fundoverdeImage, 0, 0, canvas.width, canvas.height);

    let novaCabeca = { x: snake[0].x, y: snake[0].y };
    if (direcao === "right") novaCabeca.x++;
    else if (direcao === "left") novaCabeca.x--;
    else if (direcao === "up") novaCabeca.y--;
    else if (direcao === "down") novaCabeca.y++;

    snake.unshift(novaCabeca);

    if (novaCabeca.x === comida.x && novaCabeca.y === comida.y) {
      placar++;
      document.getElementById("score").textContent = "Score: " + placar;
      comida = {
        x: Math.floor((Math.random() * canvas.width) / tamanhoCelula),
        y: Math.floor((Math.random() * canvas.height) / tamanhoCelula),
      };
      const comidaSom = document.getElementById("comidaSom");
      comidaSom.play();
    } else {
      snake.pop();
    }

    snake.forEach((segment) => {
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(
        segment.x * tamanhoCelula + tamanhoCelula / 2,
        segment.y * tamanhoCelula + tamanhoCelula / 2,
        tamanhoCelula / 2,
        0,
        Math.PI * 2
      );
      ctx.fill();
    });

    ctx.fillStyle = "blue";
    ctx.fillRect(
      comida.x * tamanhoCelula,
      comida.y * tamanhoCelula,
      tamanhoCelula,
      tamanhoCelula
    );

    if (
      novaCabeca.x < 0 ||
      novaCabeca.x >= canvas.width / tamanhoCelula ||
      novaCabeca.y < 0 ||
      novaCabeca.y >= canvas.height / tamanhoCelula
    ) {
      encerrarJogo();
    }

    for (let i = 1; i < snake.length; i++) {
      if (novaCabeca.x === snake[i].x && novaCabeca.y === snake[i].y) {
        encerrarJogo();
      }
    }
  }

  requestAnimationFrame(desenhar);
}

function iniciarJogo() {
  placar = 0;
  document.getElementById("score").textContent = "Score: " + placar;
  jogoEmAndamento = true;
  snake = [{ x: 3, y: 3 }];
  comida = {
    x: Math.floor((Math.random() * canvas.width) / tamanhoCelula),
    y: Math.floor((Math.random() * canvas.height) / tamanhoCelula),
  };
  direcao = "right";
  document.getElementById("startButton").style.display = "none";
  const iniciarSom = document.getElementById("iniciarSom");
  iniciarSom.play();
  desenhar();
}

function encerrarJogo() {
  jogoEmAndamento = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = "30px Arial";
  ctx.fillText("Game Over", canvas.width / 2 - 80, canvas.height / 2 - 40);
  document.getElementById("startButton").style.display = "block";
  const derrotaSom = document.getElementById("derrotaSom");
  derrotaSom.play();
}

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp" && direcao !== "down") direcao = "up";
  else if (event.key === "ArrowDown" && direcao !== "up") direcao = "down";
  else if (event.key === "ArrowLeft" && direcao !== "right") direcao = "left";
  else if (event.key === "ArrowRight" && direcao !== "left") direcao = "right";
});

document.getElementById("startButton").addEventListener("click", () => {
  iniciarJogo();
});
