// Inicializar las matrices desde localStorage o con valores predeterminados
const matrizSolucion = [
    [1, 4, 3, 2],
    [5, 6, 5, 6],
    [2, 3, 4, 1]
];

let matrizUsuario = JSON.parse(localStorage.getItem("matrizUsuario")) || [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];

let fallos = parseInt(localStorage.getItem("fallos")) || 0;
const maxFallos = 5;

// Actualizar el DOM con los intentos restantes
let intentos = document.querySelector("#intentos");
intentos.textContent = maxFallos - fallos;

// Obtener las imágenes
const imagenes = document.querySelectorAll("img");

// Restaurar el estado de las imágenes según la matrizUsuario
imagenes.forEach(imagen => {
    const [fila, columna] = imagen.id.split(",").map(Number);
    const valor = matrizUsuario[fila][columna];
    imagen.src = `./img/${valor}.jpg`;
});

// Evaluar las dos cartas seleccionadas
let evaluar = [];
let bloqueado = false;

imagenes.forEach(imagen => {
    imagen.addEventListener("click", () => {
        if (bloqueado || fallos >= maxFallos) return;

        const [fila, columna] = imagen.id.split(",").map(Number);

        // Verificar si la carta ya está descubierta
        if (matrizUsuario[fila][columna] !== 0) return;

        const imagenSolucion = matrizSolucion[fila][columna];

        evaluar.push({
            imagenSolucion,
            imagen,
            fila,
            columna
        });

        // Mostrar la carta seleccionada
        imagen.src = `./img/${imagenSolucion}.jpg`;

        if (evaluar.length === 2) {
            bloqueado = true;

            if (evaluar[0].imagenSolucion === evaluar[1].imagenSolucion) {
                matrizUsuario[evaluar[0].fila][evaluar[0].columna] = evaluar[0].imagenSolucion;
                matrizUsuario[evaluar[1].fila][evaluar[1].columna] = evaluar[1].imagenSolucion;

                guardarEstado();

                evaluar = [];
                bloqueado = false;

                if (verificarVictoria()) {
                    setTimeout(() => {
                        alert("¡Felicidades, has ganado el juego!");
                        reiniciarJuego();
                    }, 100);
                }
            } else {
                fallos++;
                intentos.textContent = maxFallos - fallos;
                guardarEstado();

                setTimeout(() => {
                    evaluar[0].imagen.src = "./img/0.jpg";
                    evaluar[1].imagen.src = "./img/0.jpg";
                    evaluar = [];
                    bloqueado = false;

                    if (fallos >= maxFallos) {
                        setTimeout(() => {
                            alert("Has fallado 5 veces. Fin del juego.");
                            reiniciarJuego();
                        }, 100);
                    }
                }, 1000);
            }
        }
    });
});

function verificarVictoria() {
    return matrizUsuario.every(fila => fila.every(valor => valor !== 0));
}

function reiniciarJuego() {
    matrizUsuario = matrizUsuario.map(fila => fila.map(() => 0));
    fallos = 0;
    intentos.textContent = maxFallos;

    imagenes.forEach(imagen => {
        imagen.src = "./img/0.jpg";
    });

    guardarEstado();
    bloqueado = false;
}

function guardarEstado() {
    localStorage.setItem("matrizUsuario", JSON.stringify(matrizUsuario));
    localStorage.setItem("fallos", fallos);
}
