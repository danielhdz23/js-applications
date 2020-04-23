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
    dibujarGraficas(myJson)
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

  /*
  Prob contagio
*/

let contagio;
let casosDepartamento = datosCoronavirus.filter(({departamento})=>persona.departament === departamento)

contagio = (casosDepartamento.length / datosCoronavirus.length) * 100

/********/

  console.log(persona);
  persona.probability =
    (contagio +
      parseFloat(persona.times_out) -
      parseFloat(persona.cares.mask) -
      parseFloat(persona.cares.infection_measures) -
      parseFloat(persona.cares.house_cleaning)) *
    100;

  document.getElementById("mensaje").innerText =(Math.round(persona.probability));
};

/*
let contagio;
let casosDepartamento = datosCoronavirus.filter(({departamento})=>persona.departamento === departamento)

contagio = (casosDepartamento.length / datosCoronavirus.length) * 100



switch (persona.salidas) {
  case 'ninguna':
    break;
  case '1-3':
    contagio *= 4
    break;
  case '4-10':
    contagio *= 8
    break;
  case '10+':
    contagio *= 16
    break;
  default:
    break;
}
console.log(contagio)

*/


let dibujarGraficas = function(){
    let fechasContagio = datosCoronavirus.map(({fecha_diagnostico}) => fecha_diagnostico)

    let aumentoxdia = []
    let indice = 0
    let dia = 0
    let contagios = 0
    fechasContagio.forEach(
      fecha => {
        if(fechasContagio.indexOf(fecha)===indice){
          dia++
          contagios++
          aumentoxdia[dia] = contagios
        }else {
          contagios++
          aumentoxdia[dia] = contagios
        }
        indice++
      }
    )

    new Chartist.Line('.ct-chart', {
      labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      series: [
       aumentoxdia
      ]
    }, {
      fullWidth: true,
      chartPadding: {
        right: 40
      }
    });
  };
/****************Graficas PAÍSES**************/
  let datosPaisesCovid;
  fetch("https://api.covid19api.com/country/italy?from=2020-03-01T00:00:00Z&to=2020-04-01T00:00:00Z", {
  method: "GET",
  })
  .then((respuesta) => {
    return respuesta.json();
  })
  .then((myJson) => {
    datosPaisesCovid = myJson;
    dibujarGraficasPaises(myJson)
    console.log(datosPaisesCovid)
  })
  .catch((err) => {
    console.log(err);
  });

  let dibujarGraficasPaises = function(){
    let fechasContagio = datosPaisesCovid.map(({Confirmed}) => Confirmed)
    let aumentoxdia = []
    let indice = 0
    let dia = 0
    let contagios = 0
    fechasContagio.forEach(
      Date => {
        if(fechasContagio.indexOf(Date)===indice){
          dia++
          contagios++
          aumentoxdia[dia] = contagios
        }
        indice++
      }
    )

    console.log(aumentoxdia)
    console.log(contagios)

    new Chartist.Line('.ct-chart-2', {
      labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      series: [
       fechasContagio
      ]
    }, {
      fullWidth: true,
      chartPadding: {
        right: 40
      }
    });
  }
