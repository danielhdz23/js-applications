let departmentInput = document.getElementById("departments");

navigator.geolocation.getCurrentPosition(function (pos) {
    let geocoder = new google.maps.Geocoder();
    let lat = pos.coords.latitude;
    let lng = pos.coords.longitude;
    let latlng = new google.maps.LatLng(lat, lng);

    //reverse geocode the coordinates, returning location information.
    geocoder.geocode({ 'latLng': latlng }, function (results, status) {
        let result = results[0];
        let state = '';

        for (let i = 0, len = result.address_components.length; i < len; i++) {
            let ac = result.address_components[i];

            if (ac.types.indexOf('administrative_area_level_1') >= 0) {
                state = ac.short_name;
            }
        }

        departmentInput.innerText= state

    });
});

