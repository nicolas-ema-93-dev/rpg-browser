import { Player } from './player.js';
import { GameMap } from './map.js';


const mapViewport = document.getElementById('map-viewport');



// Instanciamos los objetos principales de nuestro juego
const player = new Player();
const gameMap = new GameMap(400, 25,player.position);

function updateHUD() {
    document.getElementById('hp-text').textContent = `${player.hp} / ${player.maxHp}`;
    document.getElementById('mana-text').textContent = `${player.mana} / ${player.maxMana}`;
    document.getElementById('level-text').textContent = player.level;
    document.getElementById('exp-text').textContent = player.exp;

    const hpPercentage = (player.hp / player.maxHp) * 100;
    const manaPercentage = (player.mana / player.maxMana) * 100;

    document.getElementById('hp-bar').style.width = hpPercentage + '%';
    document.getElementById('mana-bar').style.width = manaPercentage + '%';
}

function renderGame() {
    // Le pedimos al objeto gameMap que se dibuje en la pantalla
    gameMap.render(mapViewport, player.position);
    updateHUD();
}

// Control del teclado utilizando los métodos de las clases
// Control del teclado utilizando los métodos de las clases
document.addEventListener('keydown', (event) => {
    // Evitamos que al mantener la tecla presionado siga avanzando
    if(event.repeat) return;

    let accionValida = false;

    if(event.key === ' '){
        event.preventDefault();
        player.esquivar(gameMap);
        accionValida = true;
    } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        player.mover(event.key, gameMap);
        accionValida = true;
    }

    // Si el jugador hizo una acción válida, los enemigos se mueven hacia él
    if (accionValida) {
        gameMap.moverEnemigos(player.position);
    }

    renderGame();
});

// Llamada inicial para pintar todo al cargar la página
renderGame();