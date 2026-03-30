function paso1() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Paso 1");
      resolve();
    }, 1000);
  });
}

function paso2() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Paso 2");
      resolve();
    }, 1000);
  });
}

function paso3() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Paso 3");
      resolve();
    }, 1000);
  });
}

paso1()
  .then(() => paso2())
  .then(() => paso3())
  .then(() => console.log("Proceso terminado"));