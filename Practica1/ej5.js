function miFuncion(texto) {
  let invertido = "";
  texto = texto.toLowerCase();
  for (let i = texto.length - 1; i >= 0; i--) {
    invertido = invertido + texto[i];
  }
  if (texto === invertido) {
    return true;
  } else {
    return false;
  }
}

console.log(miFuncion("oruro")); // true
console.log(miFuncion("hola"));  // false