const matrizSolucion = [
    [1, 4, 3, 2],
    [5, 6, 5, 6],
    [2, 3, 4, 1]
];

const matrizUsuario = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];

// obtener las imágenes
const imagenes = document.querySelectorAll("img");

// obtener los intentos y establecer el valor inicial
let intentos = document.querySelector("#intentos");
let fallos = 0;  // cantidad de intentos fallidos
let maxFallos = 5;

// evaluar las dos cartas seleccionadas
let evaluar = [];
let bloqueado = false; // bandera para evitar múltiples clics mientras se esperan cartas incorrectas

imagenes.forEach(imagen => {
    imagen.addEventListener("click", () => {

        // Evitar que el jugador haga clic mientras las cartas están bloqueadas
        if (bloqueado) {
            return;
        }

        // obtener las coordenadas de la carta seleccionada
        const coordenadasString = imagen.id;

        // separar las coordenadas de la carta seleccionada
        const coordenadasArray = coordenadasString.split(",");
        const fila = parseInt(coordenadasArray[0]);
        const columna = parseInt(coordenadasArray[1]);

        // verificar si la carta ya ha sido descubierta o si ya se ha fallado 5 veces
        if (matrizUsuario[fila][columna] !== 0 || fallos >= maxFallos) {
            
            return; // si ya fue descubierta o el juego terminó, no hacer nada
        }

        // obtener la imagen solución
        const imagenSolucion = matrizSolucion[fila][columna];

        // añadir la carta seleccionada al array para evaluación
        evaluar.push({
            imagenSolucion: imagenSolucion,
            imagen: imagen,
            fila: fila,
            columna: columna
        });

        // cambiar la imagen a la solución
        imagen.src = "./img/" + imagenSolucion + ".jpg";

        // si se han descubierto 2 cartas
        if (evaluar.length === 2) {




            
            // Bloquear nuevos clics mientras se comparan las cartas
            bloqueado = true;

            // verificar si las cartas coinciden
            if (evaluar[0].imagenSolucion === evaluar[1].imagenSolucion) {
                // actualizar la matriz del usuario para reflejar las cartas descubiertas
                matrizUsuario[evaluar[0].fila][evaluar[0].columna] = evaluar[0].imagenSolucion;
                matrizUsuario[evaluar[1].fila][evaluar[1].columna] = evaluar[1].imagenSolucion;

                // limpiar el array de evaluación y desbloquear
                evaluar = [];
                bloqueado = false;

                // verificar si todas las cartas han sido descubiertas
                if (verificarVictoria()) {
                    setTimeout(() => {
                        alert("¡Felicidades, has ganado el juego!");
                        reiniciarJuego();  // opción para reiniciar el juego tras ganar
                    }, 100);  // pequeño retraso para dar tiempo a mostrar las imágenes
                }
            } else {
                // si las cartas no coinciden, incrementar los fallos
                fallos++;
                intentos.textContent = maxFallos - fallos;  // actualizar el contador de fallos en el DOM

                // ocultar las cartas después de un pequeño retraso
                setTimeout(() => {
                    evaluar[0].imagen.src = "./img/0.jpg";
                    evaluar[1].imagen.src = "./img/0.jpg";
                    
                    // limpiar el array de evaluación y desbloquear después de ocultarlas
                    evaluar = [];
                    bloqueado = false;

                    // si se alcanzan los 5 fallos, finalizar el juego
                    if (fallos >= maxFallos) {
                        setTimeout(() => {
                            alert("Has fallado 5 veces. Fin del juego.");
                            reiniciarJuego();  // reiniciar el juego si se alcanzan los fallos
                        }, 100);
                    }
                }, 1000);  // 1 segundo de retraso para que el jugador vea las cartas
            }
        }
    });
});

// función para verificar si todas las cartas han sido descubiertas
function verificarVictoria() {
    for (let i = 0; i < matrizUsuario.length; i++) {
        for (let j = 0; j < matrizUsuario[i].length; j++) {
            if (matrizUsuario[i][j] === 0) {
                return false; // si hay alguna carta no descubierta, no se ha ganado
            }
        }
    }
    return true; // si todas las cartas han sido descubiertas, se ha ganado
}

// función para reiniciar el juego
function reiniciarJuego() {
    // reiniciar la matriz del usuario
    for (let i = 0; i < matrizUsuario.length; i++) {
        for (let j = 0; j < matrizUsuario[i].length; j++) {
            matrizUsuario[i][j] = 0;
        }
    }

    // restablecer las imágenes a la imagen inicial
    imagenes.forEach(imagen => {
        imagen.src = "./img/0.jpg";
    });

    // reiniciar los contadores
    fallos = 0;
    intentos.textContent = maxFallos;

    // desbloquear el juego
    bloqueado = false;
}
