export class Player {
    constructor(hp = 100, maxHp = 100, mana = 50, maxMana = 50, position = 45) {
        this.hp = hp;
        this.maxHp = maxHp;
        this.mana = mana;
        this.maxMana = maxMana;
        this.level = 1;
        this.exp = 0;
        this.position = position;
        this.attackPower = 25; // Daño base del mago
        this.ultimaDireccion = 'ArrowRight'; // <--- ¡Acá estaba faltando inicializarla!
    }

    mover(direccion, gameMap) {
        this.ultimaDireccion = direccion; // <--- Guardamos la última dirección en cada movimiento
        let nextPosition = this.position;

        if (direccion === 'ArrowUp' && this.position >= gameMap.anchoFila) {
            nextPosition -= gameMap.anchoFila;
            if(this.mana < this.maxMana){
                this.mana += 5;
            }
        } else if (direccion === 'ArrowDown' && this.position < gameMap.totalTiles - gameMap.anchoFila) {
            nextPosition += gameMap.anchoFila;
            if(this.mana < this.maxMana){
                this.mana += 5;
            }
        } else if (direccion === 'ArrowLeft' && this.position % gameMap.anchoFila !== 0) {
            nextPosition -= 1;
            if(this.mana < this.maxMana){
                this.mana += 5;
            }
        } else if (direccion === 'ArrowRight' && (this.position + 1) % gameMap.anchoFila !== 0) {
            nextPosition += 1;
            if(this.mana < this.maxMana){
                this.mana += 5;
            }
        }

        // 1. Si choca contra una pared, no hace nada
        if (gameMap.isWall(nextPosition)) {
            return;
        }

        // 2. Si choca contra un enemigo, ¡iniciamos combate!
        if (gameMap.isEnemy(nextPosition)) {
            this.atacarEnemigo(nextPosition, gameMap);
            return;
        }

        // Si el casillero está libre, se mueve
        this.position = nextPosition;
    }

    atacarEnemigo(posicionEnemigo, gameMap) {
        const indexEnemigo = gameMap.enemies.findIndex(e => e.position === posicionEnemigo);

        if (indexEnemigo !== -1) {
            const enemigo = gameMap.enemies[indexEnemigo];
            enemigo.hp -= this.attackPower;
            console.log(`¡Golpeaste al enemigo! Le queda ${enemigo.hp} de HP.`);

            if (enemigo.hp <= 0) {
                gameMap.enemies.splice(indexEnemigo, 1);
                this.exp += 50;
                console.log('¡Enemigo derrotado! +50 EXP');
            }
        }
    }

    esquivar(gameMap) {
        if (this.mana < 10) {
            console.log("¡No tienes suficiente maná para esquivar!");
            return;
        }

        let jumpPosition = this.position;
        const fila = gameMap.anchoFila;
        const currentRow = Math.floor(this.position / fila);

        console.log("Esquivando hacia la dirección:", this.ultimaDireccion);

        if (this.ultimaDireccion === 'ArrowUp') {
            jumpPosition -= fila * 2;
            if (jumpPosition < 0) {
                console.log("¡Te sales del mapa por arriba!");
                return;
            }
        } else if (this.ultimaDireccion === 'ArrowDown') {
            jumpPosition += fila * 2;
            if (jumpPosition >= gameMap.totalTiles) {
                console.log("¡Te sales del mapa por abajo!");
                return;
            }
        } else if (this.ultimaDireccion === 'ArrowLeft') {
            jumpPosition -= 2;
            if (Math.floor(jumpPosition / fila) !== currentRow || jumpPosition < 0) {
                console.log("¡No puedes esquivar fuera de la fila!");
                return;
            }
        } else if (this.ultimaDireccion === 'ArrowRight') {
            jumpPosition += 2;
            if (Math.floor(jumpPosition / fila) !== currentRow) {
                console.log("¡No puedes esquivar fuera de la fila!");
                return;
            }
        }

        // Validamos que el destino final del salto no sea pared ni enemigo
        if (!gameMap.isWall(jumpPosition) && !gameMap.isEnemy(jumpPosition)) {
            this.mana -= 10;
            this.position = jumpPosition;
            console.log("¡Esquiva táctica realizada con éxito!");
        } else {
            console.log("¡El camino está bloqueado para esquivar!");
        }
    }
}