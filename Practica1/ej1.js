function miFuncion(texto) {
  let a = 0, e = 0, i = 0, o = 0, u = 0;

  texto = texto.toLowerCase();

  for (let letra of texto) {
    if (letra === "a") a++;
    if (letra === "e") e++;
    if (letra === "i") i++;
    if (letra === "o") o++;
    if (letra === "u") u++;
  }
  return { a, e, i, o, u };
}


let obj = miFuncion("euforia");
console.log(obj);