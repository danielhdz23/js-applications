let datosCoronavirus;

document.querySelector(".submit").addEventListener("click", function (event) {
  event.preventDefault();
  calcularProbabilidad();
});
/*
fetch("https://www.datos.gov.co/resource/gt2j-8ykr.json?$limit=5000", {
  method: "GET",
})
  .then((respuesta) => {
    return respuesta.json();
  })
  .then((myJson) => {
    datosCoronavirus = myJson;
    mostrarDatos(myJson);
    dibujarGraficas(myJson);
  })
  .catch((err) => {
    console.log(err);
  });
*/
  const peticionAPI = async function() {
    const response = await fetch('https://www.datos.gov.co/resource/gt2j-8ykr.json?$limit=5000');
    const json = await response.json();
    datosCoronavirus = json;
    mostrarDatos(json);
    dibujarGraficas(json)
};


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
  crearDatalist(departamentos, "department");
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
  let casosDepartamento = datosCoronavirus.filter(
    ({ departamento }) => persona.department == departamento
  );
  contagio = casosDepartamento.length / datosCoronavirus.length;
  console.log(datosCoronavirus);
  console.log(casosDepartamento);
  /********/
  console.log(contagio);
  console.log(contagio * parseInt(persona.times_out) * 100);
  persona.probability =
    (contagio * parseInt(persona.times_out) -
      parseFloat(persona.cares.mask) -
      parseFloat(persona.cares.infection_measures) -
      parseFloat(persona.cares.house_cleaning)) *
    100;
  if (persona.probability <= 0) {
    document.getElementById("mensaje").innerText = "0";
  }else if(persona.probability >= 100) {
    document.getElementById("mensaje").innerText = '100'
  }else {
    document.getElementById("mensaje").innerText = Math.round(
      persona.probability
    );
  }
  document.getElementById("results").style.display = "block";
  document.getElementById("grafica").style.display = "block";
  document.getElementById("grafica").style.opacity = 1;
};

let crearDatalist = (arreglo, ubicacion) => {
  let contenedorDatalist = document.getElementById(ubicacion);
  arreglo.sort().forEach((elm) => {
    opcion = document.createElement("option");
    opcion.value = elm;
    contenedorDatalist.append(opcion);
  });
};
////////////////////////

let compararGraficas = function (country) {
  if (country !== "") {
    fetch(
      "https://api.covid19api.com/total/country/" +
        country +
        "/status/confirmed?from=2020-01-01T00:00:00Z&to=2020-07-01T00:00:00Z",
      {
        method: "GET",
      }
    )
      .then((respuesta) => {
        return respuesta.json();
      })
      .then((myJson) => {
        let datosOtroPais = myJson;
        datosOtroPais = datosOtroPais
          .map(({ Cases }) => Cases)
          .filter((Cases) => Cases > 0);
        console.log(datosOtroPais);
        dibujarGraficas(datosCoronavirus, datosOtroPais);
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

let cargarPaises = function () {
  fetch("https://api.covid19api.com/countries", {
    method: "GET",
  })
    .then((respuesta) => {
      return respuesta.json();
    })
    .then((myJson) => {
      let paises = myJson.map(({ Country }) => Country);
      crearDatalist(paises, "datalist-paises");
    })
    .catch((err) => {
      console.log(err);
    });
};

cargarPaises();

let dibujarGraficas = function (datosCoronavirus, datosOtroPais = []) {
  let fechasContagio = datosCoronavirus.map(
    ({ fecha_diagnostico }) => fecha_diagnostico
  );

  let aumentoXdia = [];
  let indice = 0,
    dia = 0,
    contagios = 0;

  fechasContagio.forEach((fecha) => {
    if (fechasContagio.indexOf(fecha) == indice) {
      contagios++;
      aumentoXdia[dia] = contagios;
      dia++;
    } else {
      contagios++;
      aumentoXdia[dia] = contagios;
    }
    indice++;
  });

  datosOtroPais = datosOtroPais.slice(0, aumentoXdia.length);

  dias = [...Array(aumentoXdia.length).keys()]

    /* Reducir resolucion de grafica */
    datosOtroPais = datosOtroPais.filter((elm, index) => index % 3 == 0)
    aumentoXdia = aumentoXdia.filter((elm, index) => index % 3 == 0)
    dias = dias.filter((elm, index) => index % 3 == 0)


  new Chartist.Line(
    ".ct-chart",
    {
      labels: dias,
      series: [aumentoXdia, datosOtroPais],
    },
    {
      fullWidth: true,
      chartPadding: {
        right: 40,
      },
    }
  );
};

let agregarEventos = function (params) {
  let departamento = document.querySelector("[name = department]");
  departamento.addEventListener("click", () => {
    departamento.value = "";
  });
  let pais = document.querySelector("[name = pais-comparacion]");
  pais.addEventListener("click", () => {
    pais.value = "";
  });
  pais.addEventListener("change", () => {
    compararGraficas(pais.value);
  });
};

peticionAPI();
agregarEventos();
