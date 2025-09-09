const simbolos = ['🍒', '🍋', '🔔', '💎', '7️⃣', '🍉', '🍇', '🍀', '⭐'];
const valoresPremio = {
    '🍒': 30,
    '🍋': 20,
    '🔔': 40,
    '💎': 100,
    '7️⃣': 200,
    '🍉': 25,
    '🍇': 15,
    '🍀': 50,
    '⭐': 80
}
let saldo= 100;
const slot = document.getElementById('slot');
const saldoDiv = document.getElementById('saldo'); 
const mensagemDiv = document.getElementById('mensagem'); 
const girarBtn = document.getElementById('girar'); 
let animando = false;

let matriz = Array.from({length: 3}, () => Array(3).fill('❔')); 
let rodadaRapida = false;
const toggleRapidoBtn = document.getElementById('toggleRapido');
const apostaInput = document.getElementById('aposta');

// Atualiza o texto do botão
function atualizarBotaoRapido() {
    if (rodadaRapida) {
        toggleRapidoBtn.innerHTML = '⚡';
        toggleRapidoBtn.classList.add('on');
        toggleRapidoBtn.title = 'Rodada Rápida: ON';
    } else {
        toggleRapidoBtn.innerHTML = '💤';
        toggleRapidoBtn.classList.remove('on');
        toggleRapidoBtn.title = 'Rodada Rápida: OFF';
    }
}

// Alterna o modo rápido ao clicar
toggleRapidoBtn.onclick = function() {
    rodadaRapida = !rodadaRapida;
    atualizarBotaoRapido();
};

function renderizar(vitoria = null) {
    slot.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const row = document.createElement('div');
        row.className = 'row';
        for (let j = 0; j < 3; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';

            // Destaca a linha/coluna/diagonal vencedora
            if (vitoria) {
                if (
                    (vitoria.tipo === 'linha' && vitoria.pos === i) ||
                    (vitoria.tipo === 'coluna' && vitoria.pos === j) ||
                    (vitoria.tipo === 'diagonal' && (
                        (vitoria.pos === 0 && i === j) ||
                        (vitoria.pos === 1 && i + j === 2)
                    ))
                ) {
                    cell.classList.add('vencedor');
                }
            }

            cell.textContent = matriz[i][j];
            row.appendChild(cell);
        }
        slot.appendChild(row);
    }
    saldoDiv.textContent = `saldo: ${saldo} moedas`; 
}

function sortearMatriz() {
    return Array.from({length: 3}, () =>
        Array.from({length: 3}, () => simbolos[Math.floor(Math.random() * simbolos.length)])
    ); 
}

function checarVitoria(m) {
    // Só linhas
    for (let i = 0; i < 3; i++) {
        if (m[i][0] === m[i][1] && m[i][1] === m[i][2]) {
            return { tipo: 'linha', pos: i, simbolo: m[i][0] };
        }
    }
    return null;
}

function animarRoleta(callback) {
    let rodadas = rodadaRapida ? 6 : 12;
    let tempo = rodadaRapida ? 60 : 100;
    animando = true;
    function animar() {
        matriz = sortearMatriz();
        renderizar();
        rodadas--;
        if (rodadas > 0) {
            setTimeout(animar, tempo);
        } else {
            animando = false;
            callback();
        }
    }
    animar();
}

girarBtn.onclick = function() {
    if (animando) return;
    const aposta = parseInt(apostaInput.value, 10) || 1;
    if (saldo < aposta) {
        mensagemDiv.textContent = 'Saldo insuficiente!';
        return;
    }
    mensagemDiv.textContent = '';
    saldo -= aposta;
    animarRoleta(() => {
        const vitoria = checarVitoria(matriz);
        if (vitoria) {
            const premio = valoresPremio[vitoria.simbolo] * aposta / 10; // Prêmio proporcional à aposta
            mensagemDiv.textContent = `Parabéns! Você ganhou ${premio} moedas com ${vitoria.simbolo}!`;
            saldo += premio;
            renderizar(vitoria);
        } else {
            mensagemDiv.textContent = 'Não foi dessa vez!';
            renderizar();
        }
    });
    renderizar();
};

renderizar();
atualizarBotaoRapido();