function miFuncion(numeros) {
  let pares = [];
  let impares = [];
  for (let num of numeros) {
    if (num % 2 === 0) {
      pares.push(num);
    } else {
      impares.push(num);
    }
  }
  return { pares, impares };
}

let obj = miFuncion([1, 2, 3, 4, 5]);
console.log(obj);