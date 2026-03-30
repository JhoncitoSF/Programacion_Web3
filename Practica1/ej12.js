function paso1(cb) {
  setTimeout(() => {
    console.log("Paso 1");
    cb();
  }, 1000);
}
function paso2(cb) {
  setTimeout(() => {
    console.log("Paso 2");
    cb();
  }, 1000);
}
function paso3(cb) {
  setTimeout(() => {
    console.log("Paso 3");
    cb();
  }, 1000);
}
/* Anidamiento de callbacks
paso1(() => {
  paso2(() => {
    paso3(() => {
      console.log("Terminado");
    });
  });
});*/


//---------------------------------------------------------------------------------------------------------------------------
//Con con async/await
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

async function ejecutar() {
  await paso1();
  await paso2();
  await paso3();
  console.log("Terminado");
}
ejecutar();