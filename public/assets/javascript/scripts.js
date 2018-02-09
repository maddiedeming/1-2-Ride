var database = firebase.database();
var lyftCount = 0;
var uberCount = 0;

var lyftButton = $("#btn-lyft");
var uberButton = document.getElementById("#btn-uber");

lyftButton.on("click", function() {
  alert("Apples");
  lyftCount++;
  database.ref("lyft").set({
    lyftCount: lyftCount
  })
})

$(".chart-section").hide();
$("#carData").hide()
// Below function takes a string, trims end, and replaces spaces with the "+" symbol for the ajax calls(necessary for API) --crystal 
function replaceSpaces(toBeReplaced){
  if(toBeReplaced !== undefined){
    toBeReplaced = toBeReplaced.replace(/ /g,"+");
    return toBeReplaced;
  }
}
//below function uses the geolocation function from the browser and returns the lat/long. It then populates the form accordingly, setting up 
//for when the person adds destination address --crystal
function getCurrentLocation(){
  event.preventDefault();
  var options = {
      enableHighAccuracy: true,
      timeout: 10000
  };
  navigator.geolocation.getCurrentPosition(success, error, options);
  function success(position){
      let lat = position.coords.latitude;
      let lng = position.coords.longitude;
      $("#currentLocationInput").data("latitude",lat);
      $("#currentLocationInput").data("longitude",lng);
      $.ajax({url:"https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng + "&key=AIzaSyCBscZGrlKGb8HG8o5qqNOXhWXbY9qLJx0", 
        type:"GET"})
      .done(function(results){
        let currentAddress = results.results[0].address_components[0].long_name + " " + results.results[0].address_components[1].short_name;
        let currentCity = results.results[0].address_components[2].short_name;
        let currentState = results.results[0].address_components[5].short_name;
        let formattedAddress = results.results[0].formatted_address
        $("#currentLocationInput").val(formattedAddress);
      });
    
  }
  function error(err){
     $('#geolocationModal').modal('show');
  }
}
// Below function populates table with Uber data --crystal
function populateUberData(response){
  response.prices.forEach(function(element){
    let newTr = $("<tr>");
    let newRideTd = $("<td>");
    let newEstCostTd = $("<td>");
    let newEstDisTd = $("<td>");
    let newArrivalTd = $("<td>");
    let cost = element.estimate;
    newRideTd.text(element.display_name);
    newEstCostTd.text(cost);
    newEstDisTd.text(element.distance);
    newArrivalTd.text("Unavailable");
    newTr.append(newRideTd);
    newTr.append(newEstCostTd);
    newTr.append(newEstDisTd);
    newTr.append(newArrivalTd);
    $("#lyftDetails").append(newTr);
  })
}
// Below function populates table with Lyft data --crystal
function parseLyftData(data, start, end){
  $.ajax({
          url: 'https://api.lyft.com/v1/eta?lat=' +start + '&lng=' + end, 
          type:"GET",
          headers:{'Authorization': 'Bearer 0fscv5EK0kYmJeX5HAF2D7fkdFO1k9Xp/jxY73nRKJXNPTpwuqLw7ttZunhTUawBYvyGRLqvsqPmRRBF8Ofh4m44gfSRB30C+5RAhuHsmrZvENRVHFlnMeI='},
  }).done(function(response){
      const arrayOfETAs = response.eta_estimates;
      const arrayOfRides = data.cost_estimates;
      let counter = 0;
      arrayOfRides.forEach(function(i) {  
        let newTr = $("<tr>");
        let newRideTd = $("<td>");
        let newEstCostTd = $("<td>");
        let newEstDisTd = $("<td>");
        let newArrivalTd = $("<td>");
        let cost = i.estimated_cost_cents_max/100;
        newRideTd.text(i.display_name);
        newEstCostTd.text(`$${cost}`);
        newEstDisTd.text(i.estimated_distance_miles);
        newArrivalTd.text(response.eta_estimates[counter].eta_seconds/60 + " Minutes");
        newTr.append(newRideTd);
        newTr.append(newEstCostTd);
        newTr.append(newEstDisTd);
        newTr.append(newArrivalTd);
        $("#lyftDetails").append(newTr);
        counter++;
      });
   })
}
 // Below extracts Dom info, sends to calls --crystal
function submitInfo(){
  event.preventDefault();
  $("#carData").show();
  const currentLocation = $("#currentLocationInput").val().trim();
  const lat = 0;
  const lng = 0;
  const destLocation = $("#destinationInput").val().trim();
  costComparison(currentLocation, destLocation);
  seatComparison(currentLocation);
}

// Function contains ajax requests for cost comparison Data
function costComparison(currentLocation, destLocation) {
  $.ajax({
    url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + currentLocation + '&key=AIzaSyC8RAH-4_p4fAMXPDWYouvoZdia88sWRsU', 
    type:"GET",  
    })
    .done(function(response){
      startLat = response.results[0].geometry.location.lat;
      startLng = response.results[0].geometry.location.lng;
    })
    .fail(function(error){
      console.log(error);
    })
    .then(function(){
      $.ajax({
        url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + destLocation + '&key=AIzaSyC8RAH-4_p4fAMXPDWYouvoZdia88sWRsU', 
        type:"GET",
      })
      .done(function(response){
        destLat = response.results[0].geometry.location.lat;
        destLng = response.results[0].geometry.location.lng;
        
      })
      .then(function(){
        $.ajax({
          url: 'https://api.lyft.com/v1/cost?start_lat=' +startLat + '&start_lng=' + startLng + "&end_lat=" + destLat + "&end_lng=" + destLng, 
          type:"GET",
          headers:{'Authorization': 'Bearer 0fscv5EK0kYmJeX5HAF2D7fkdFO1k9Xp/jxY73nRKJXNPTpwuqLw7ttZunhTUawBYvyGRLqvsqPmRRBF8Ofh4m44gfSRB30C+5RAhuHsmrZvENRVHFlnMeI='},
    
        })
        .done(function(response){
          parseLyftData(response, startLat, destLng);
          let lyftData = lyftLineChart(response);
          let lyftDataSet = lyftData[0];
          let lyftLabels = lyftData[1];
          let lyftCostData = [lyftLabels, lyftDataSet];

          $.ajax({
            url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + currentLocation + '&key=AIzaSyC8RAH-4_p4fAMXPDWYouvoZdia88sWRsU', 
            type:"GET",
      
          })
            .done(function(response){
              startLat = response.results[0].geometry.location.lat;
              startLng = response.results[0].geometry.location.lng;
            })
              .fail(function(error){
              console.log(error)
            })
              .then(function(){
              $.ajax({
                url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + destLocation + '&key=AIzaSyC8RAH-4_p4fAMXPDWYouvoZdia88sWRsU', 
                type:"GET",
          
              })
            .done(function(response){
              destLat = response.results[0].geometry.location.lat;
              destLng = response.results[0].geometry.location.lng;
            })
            .then(function(){
              $.ajax({
              url: 'https://api.uber.com/v1.2/estimates/price?start_latitude=' + startLat + '&start_longitude=' + startLng + '&end_latitude=' + destLat + '&end_longitude=' + destLng, 
              type: 'GET',
              headers:{Authorization: 'Token YEEveIYDU-uU4BRcgORqnvoLRtrCtQDzc0yvbRVs'},
        
            })
              .done(function(response){
                let uberData = uberLineChart(response);
                LineChartRender(lyftLabels, lyftDataSet, uberData);
                //below function is fired -> populates table with uber data-crystal
                populateUberData(response);
                $(".chart-section").show();
                })
            .fail(function(error){
              console.log(error)
            })
            })
          })
      })
    })
  })
}


function seatComparison(currentLocation) {
  $.ajax({
    url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + currentLocation + '&key=AIzaSyC8RAH-4_p4fAMXPDWYouvoZdia88sWRsU', 
    type:"GET",  
    })
    .done(function(response){
      startLat = response.results[0].geometry.location.lat;
      startLng = response.results[0].geometry.location.lng;
    })
    .fail(function(error){
      console.log(error)
    })
    .then(function(){
      $.ajax({
        url: 'https://api.lyft.com/v1/ridetypes?lat=' +startLat + '&lng=' + startLng, 
        type:"GET",
        headers:{'Authorization': 'Bearer 0fscv5EK0kYmJeX5HAF2D7fkdFO1k9Xp/jxY73nRKJXNPTpwuqLw7ttZunhTUawBYvyGRLqvsqPmRRBF8Ofh4m44gfSRB30C+5RAhuHsmrZvENRVHFlnMeI='},
  
      })
      .done(function(response){
        lyftDoughnutChart(response);
        $.ajax({
          url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + currentLocation+ '&key=AIzaSyC8RAH-4_p4fAMXPDWYouvoZdia88sWRsU', 
          type:"GET",
    
        })
          .done(function(response){
            startLat = response.results[0].geometry.location.lat;
            startLng = response.results[0].geometry.location.lng;
          })
            .fail(function(error){
            console.log(error)
          })
            .then(function(){
              $.ajax({
              url: 'https://api.uber.com/v1.2/products?latitude=' + startLat + '&longitude=' + startLng, 
              type: 'GET',
              headers:{Authorization: 'Token YEEveIYDU-uU4BRcgORqnvoLRtrCtQDzc0yvbRVs'},
        
            })
              .done(function(response){
                uberDoughnutChart(response);
                doughnutChartRender (lyftSeatData, uberSeatData)
              })
            .fail(function(error){
              console.log(error)
            })
          })
        })
      })
}





$("#submit").on("click", submitInfo);
$("#currentLocation").on("click", getCurrentLocation)