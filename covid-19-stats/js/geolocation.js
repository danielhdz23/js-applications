let inputDepartment = document.getElementById("departments");
let x = document.getElementById("coordinate");
let y = document.getElementById("json");

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  x.innerHTML =
    "Latitude: " +
    position.coords.latitude +
    "<br>Longitude: " +
    position.coords.longitude;

  //Create query for the API.
  let latitude = "latitude=" + position.coords.latitude;
  let longitude = "&longitude=" + position.coords.longitude;
  let query = latitude + longitude + "&localityLanguage=en";

  const Http = new XMLHttpRequest();

  let bigdatacloud_api =
    "https://api.bigdatacloud.net/data/reverse-geocode-client?";

  bigdatacloud_api += query;

  Http.open("GET", bigdatacloud_api);
  Http.send();

  Http.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let myObj = JSON.parse(this.responseText);
      console.log(myObj);
      y.innerHTML +=
        "Postcodes =" +
        myObj.postcode +
        "<br>City = " +
        myObj.locality +
        "<br>Country = " +
        myObj.countryName +
        "<br>Department = " +
        myObj.principalSubdivision.replace(' Department', '');
      x.innerText = myObj.locality;
      
        inputDepartment.value = myObj.principalSubdivision.replace(
          ' Department', ''
      );
      console.log(inputDepartment)
      console.log(myObj.principalSubdivision.replace(' Department', ''))
    }
  };
}
