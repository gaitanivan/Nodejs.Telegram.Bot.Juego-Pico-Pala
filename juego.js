// ==========================================
// MOTOR DEL JUEGO: PICO Y PALA
// ==========================================

/**
 * Genera un número aleatorio de 3 dígitos diferentes en formato String.
 */
export function generarNumeroSecreto() {
  const digitosDisponibles = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  let numero = '';
  
  for (let i = 0; i < 3; i++) {
    const indiceAleatorio = Math.floor(Math.random() * digitosDisponibles.length);
    const digitoSeleccionado = digitosDisponibles.splice(indiceAleatorio, 1)[0];
    numero += digitoSeleccionado;
  }
  
  return numero;
}

/**
 * Compara la propuesta del jugador con el número secreto.
 */
export function calcularPicosYPalas(secreto, intento) {
  let picos = 0;
  let palas = 0;

  const arraySecreto = secreto.split('');
  const arrayIntento = intento.split('');

  arrayIntento.forEach((digito, index) => {
    if (digito === arraySecreto[index]) {
      picos++;
    } else if (arraySecreto.includes(digito)) {
      palas++;
    }
  });

  return { picos, palas };
}