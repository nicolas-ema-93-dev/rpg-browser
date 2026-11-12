import { Enemy } from './enemy.js';

export class GameMap {
    constructor(totalTiles = 400, cantidadDeObstaculos = 25, playerInitialPosition = 45, cantidadDeEnemigos = 3) {
        this.totalTiles = totalTiles;
        this.anchoFila = 20;
        this.cantidadObstaculos = cantidadDeObstaculos;
        this.playerInitialPosition = playerInitialPosition;
        this.cantidadDeEnemigos = cantidadDeEnemigos;
        this.obstacles = this.generarObstaculosAleatorios();
        this.enemies = this.generarEnemigosAleatorios();
    }

    generarEnemigosAleatorios() {
        const enemiesTemp = [];

        while (enemiesTemp.length < this.cantidadDeEnemigos) {
            const randomIndex = Math.floor(Math.random() * this.totalTiles);

            // Evitamos duplicados, que pise al jugador y exigimos que esté en los bordes
            const yaExiste = enemiesTemp.some(e => e.position === randomIndex);

            if (!yaExiste && randomIndex !== this.playerInitialPosition &&
                (randomIndex < this.anchoFila || randomIndex >= this.anchoFila * 19 ||
                    randomIndex % this.anchoFila === 0 || (randomIndex + 1) % this.anchoFila === 0)) {

                enemiesTemp.push(new Enemy(randomIndex));
            }
        }
        return enemiesTemp;
    }

    generarObstaculosAleatorios() {
        const obstaculosTemp = [];

        while (obstaculosTemp.length < this.cantidadObstaculos) {
            const randomIndex = Math.floor(Math.random() * this.totalTiles);

            if (!obstaculosTemp.includes(randomIndex) && randomIndex !== this.playerInitialPosition &&
                randomIndex > this.anchoFila && randomIndex < this.anchoFila * 19 &&
                randomIndex % this.anchoFila !== 0 && (randomIndex + 1) % this.anchoFila !== 0) {
                obstaculosTemp.push(randomIndex);
            }
        }
        return obstaculosTemp;
    }

    isWall(position) {
        return this.obstacles.includes(position);
    }

    isEnemy(position) {
        return this.enemies.some(e => e.position === position);
    }

    render(viewportElement, playerPosition) {
        viewportElement.innerHTML = '';

        for (let i = 0; i < this.totalTiles; i++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');

            if (this.isWall(i)) {
                tile.classList.add('wall');
            }

            if (i === playerPosition) {
                tile.classList.add('player');
            }

            if (this.isEnemy(i)) {
                tile.classList.add('enemy');
            }

            viewportElement.appendChild(tile);
        }
    }

    moverEnemigos(playerPosition) {
        const fila = this.anchoFila;

        this.enemies.forEach(enemigo => {
            const enemyRow = Math.floor(enemigo.position / fila);
            const enemyCol = enemigo.position % fila;
            const playerRow = Math.floor(playerPosition / fila);
            const playerCol = playerPosition % fila;

            let nextEnemyPos = enemigo.position;

            // Priorizamos movernos en el eje donde estemos más lejos, o alternamos
            if (Math.abs(playerRow - enemyRow) > Math.abs(playerCol - enemyCol)) {
                // Mover verticalmente
                if (playerRow > enemyRow && enemigo.position + fila < this.totalTiles) {
                    nextEnemyPos += fila;
                } else if (playerRow < enemyRow && enemigo.position >= fila) {
                    nextEnemyPos -= fila;
                }
            } else {
                // Mover horizontalmente respetando los bordes de la fila
                if (playerCol > enemyCol && (enemigo.position + 1) % fila !== 0) {
                    nextEnemyPos += 1;
                } else if (playerCol < enemyCol && enemigo.position % fila !== 0) {
                    nextEnemyPos -= 1;
                }
            }

            // El enemigo solo se mueve si el casillero destino NO es una pared,
            // NO es otro enemigo, y NO es la posición exacta del jugador
            if (!this.isWall(nextEnemyPos) && !this.isEnemy(nextEnemyPos) && nextEnemyPos !== playerPosition) {
                enemigo.position = nextEnemyPos;
            }
            // Opcional: Si el enemigo choca contra el jugador al intentar moverse, le podría quitar vida.
            else if (nextEnemyPos === playerPosition) {
                console.log("¡Un enemigo te ha alcanzado!");
            }
        });
    }
}