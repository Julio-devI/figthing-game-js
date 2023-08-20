// Carregando os sons
const colisaoSound = new Audio('./assets/audio/som.mp3');
const fimDoTempoSound = new Audio('./assets/audio/fiufiu.mp3');

// Função para calcular o centro de um retângulo
function calcularCentro(retangulo) {
    return {
        x: retangulo.position.x + retangulo.width / 2,
        y: retangulo.position.y + retangulo.height / 2
    };
}

// Função para calcular a distância entre dois pontos
function calcularDistancia(ponto1, ponto2) {
    const deltaX = ponto1.x - ponto2.x;
    const deltaY = ponto1.y - ponto2.y;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}

// Função rectangularCollision com pontos de referência e volume ajustado
function rectangularCollision({ rectangle1, rectangle2 }) {
    const centroRetangulo1 = calcularCentro(rectangle1.attackBox);
    const centroRetangulo2 = calcularCentro(rectangle2);

    const collides = (
        centroRetangulo1.x + rectangle1.attackBox.width / 2 >= rectangle2.position.x &&
        centroRetangulo1.x - rectangle1.attackBox.width / 2 <= rectangle2.position.x + rectangle2.width &&
        centroRetangulo1.y + rectangle1.attackBox.height / 2 >= rectangle2.position.y &&
        centroRetangulo1.y - rectangle1.attackBox.height / 2 <= rectangle2.position.y + rectangle2.height
    );

    if (collides) {
        colisaoSound.play();
    } else {
        colisaoSound.pause();
    }

    // Calcula a distância entre os personagens e atualiza o volume do som
    const distanciaEntrePersonagens = calcularDistancia(player.position, enemy.position);
    atualizarVolumeSom(distanciaEntrePersonagens);

    return collides;
}

// Função para determinar o vencedor
function determineWinner({ player, enemy, timerId }) {
    clearTimeout(timerId);
    document.querySelector('#displayText').style.display = 'flex';

    if (player.health === enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Tie';
    } else if (player.health > enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 1 Wins';
    } else if (player.health < enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Enemy Wins';
    }
}

// Função para atualizar o timer e determinar o vencedor quando o tempo acabar
let timer = 60;
let timerId;
function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000);
        timer--;
        document.querySelector('#timer').innerHTML = timer;
    }

    if (timer === 0) {
        fimDoTempoSound.play(); // Toca o som de fim do tempo
        determineWinner({ player, enemy, timerId });
    }
}

// Função para atualizar o volume do som com base na distância
function atualizarVolumeSom(distancia) {
    const distanciaMaxima = 300; // Defina a distância máxima para o som ser ouvido
    const volumeMaximo = 1; // Volume máximo do som

    // Calcula o novo volume com base na distância
    const novoVolume = 1 - (distancia / distanciaMaxima);
    colisaoSound.volume = Math.max(0, Math.min(volumeMaximo, novoVolume));
}

// Evento para atualizar o volume do som durante o movimento
document.addEventListener('mousemove', (event) => {
    const posicaoPersonagem = player.attackBox.getBoundingClientRect(); // Suponho que 'player' seja o personagem principal
    const posicaoMouse = {
        x: event.clientX,
        y: event.clientY
    };

    const distancia = calcularDistancia(posicaoPersonagem, posicaoMouse);
    atualizarVolumeSom(distancia);
});

// Iniciar o timer
decreaseTimer();
