let datosCoronavirus;

document.querySelector(".submit").addEventListener("click", function (event) {
  event.preventDefault();
  calcularProbabilidad();
});

fetch("https://www.datos.gov.co/resource/gt2j-8ykr.json?$limit=5000", {
  method: "GET",
})
  .then((respuesta) => {
    return respuesta.json();
  })
  .then((myJson) => {
    datosCoronavirus = myJson;
    mostrarDatos(myJson);
  })
  .catch((err) => {
    console.log(err);
  });

let mostrarDatos = function (datosCoronavirus) {
  document.getElementById("total").append(datosCoronavirus.length);
  document
    .getElementById("hombres")
    .append(datosCoronavirus.filter((item) => item.sexo == "M").length);
  document
    .getElementById("mujeres")
    .append(datosCoronavirus.filter((item) => item.sexo == "F").length);

  document
    .getElementById("recuperados")
    .append(
      datosCoronavirus.filter((item) => item.atenci_n == "Recuperado").length
    );

  document
    .getElementById("muertes")
    .append(
      datosCoronavirus.filter((item) => item.atenci_n === "Fallecido").length
    );

  document
    .getElementById("muertes-menores-50")
    .append(
      datosCoronavirus.filter(
        (item) => item.atenci_n === "Fallecido" && item.edad <= 50
      ).length
    );

  let departamentos = datosCoronavirus.map((item) => item.departamento);
  departamentos = departamentos.filter(
    (item, indice) => departamentos.indexOf(item) === indice
  );
  let contenedorDataList = document.getElementById("department");
  departamentos.sort().forEach((el) => {
    option = document.createElement("option");
    option.value = el;
    contenedorDataList.append(option);
  });
};

let calcularProbabilidad = function () {
  let persona = {
    name: "",
    last_name: "",
    age: 0,
    department: "",
    times_out: "",
    cares: {
      infection_measures: 0,
      mask: 0,
      house_cleaning: 0,
    },
    probability: 0,
  };
  let inputs = document.querySelectorAll("form input");
  inputs = Array.from(inputs);
  inputs.forEach((el) => {
    if (el.type === "radio" && el.checked) {
      persona.times_out = el.value;
    }
    if (el.id === "first-name") {
      persona.name = el.value;
    }
    if (el.id === "last-name") {
      persona.last_name = el.value;
    }
    if (el.id === "departments") {
      persona.department = el.value;
    }
    if (el.id === "age") {
      persona.age = el.value;
    }
    if (el.type === "checkbox" && el.checked && el.id === "mask") {
      persona.cares.mask = el.value;
    }
    if (el.type === "checkbox" && el.checked && el.id === "hands") {
      persona.cares.infection_measures = el.value;
    }
    if (el.type === "checkbox" && el.checked && el.id === "cleaning") {
      persona.cares.house_cleaning = el.value;
    }
  });
  console.log(persona);
  persona.probability =
    (0.5 +
      parseFloat(persona.times_out) -
      parseFloat(persona.cares.mask) -
      parseFloat(persona.cares.infection_measures) -
      parseFloat(persona.cares.house_cleaning)) *
    100;

  document.getElementById("mensaje").append(Math.round(persona.probability));
};
