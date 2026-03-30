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

paso1()
  .then(() => paso2())
  .then(() => console.log("Terminado"));




//con async/await

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

async function ejecutar() {
  await paso1();
  await paso2();
  console.log("Terminado");
}

ejecutar();




