// Initialize and add the map

var map;
var selected = [];

function initMap() {
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var directionsService = new google.maps.DirectionsService;
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12, 
        center: {lat: 43.7243, lng: -79.6055}
    });
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('right-panel'));

    //verify form
    var form = document.forms.meetupForm;
    form.onsubmit = function(){
        //Form Variables
        let startLocation = document.getElementById("startLocation");
        let departureTime = document.getElementById("departureTime");
        let bus = document.getElementById("bus");
        let car = document.getElementById("car");
        let walk = document.getElementById("walk");
        let bicycle = document.getElementById("bicycle");
        let destinationLocation = document.getElementById("destinationLocation");
        //variable for error
        let errorMsg = document.getElementById("errorMsg");

        if(startLocation.value === "" || startLocation.value === "Starting Address"){
            errorMsg.innerHTML = "Start Location must be filled.";
            return false;
        }
        if(destinationLocation.value === "" || destinationLocation.value === "Destination Address"){
            errorMsg.innerHTML = "Destination Location must be filled.";
            return false;
        }
        if(departureTime.value === ""){
            errorMsg.innerHTML = "Date and time must be filled.";
            return false;
        }
        if(bus.checked === false && car.checked === false && walk.checked === false && bicycle.checked === false){
            errorMsg.innerHTML = "A Checkbox must be clicked.";
            return false;
        }
        else {
            errorMsg.innerHTML = "";
            var newDate = new Date(departureTime.value);
            var checkboxes = document.getElementsByName('check');
            for (var i=0; i<checkboxes.length; i++) {
                if (checkboxes[i].checked) {
                    selected.push(checkboxes[i].value);
                } else if(checkboxes.checked === false){
                    selected.shift();
                }
            }
            //These secret variables are needed to authenticate the request.
            displayRoute(directionsService, directionsDisplay, startLocation.value, destinationLocation.value, newDate);
        }
        return false;
    };
    console.log(selected);
    function displayRoute(ds, dd, sl, dl, dt) {

        ds.route({
            origin: sl,
            destination: dl,
            travelMode: google.maps.TravelMode[selected[0]],
            drivingOptions: {
                departureTime: dt,
                trafficModel: google.maps.TrafficModel.PESSIMISTIC
            }
        }, function(response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                dd.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }
}

