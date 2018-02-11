//$("#charts").hide();
$("#carData").hide()

function hoverColor(){
  $("#btn-uber").children().css("color","rgb(37, 37, 37)");
  $("#btn-uber").css("background-color","rgb(37, 37, 37)");
}
function resetColor(){
  $("#btn-uber").children().css("color","black");
  $("#btn-uber").css("background-color","black");
}
// Below function takes a string, trims end, and replaces spaces with the "+" symbol for the ajax calls(necessary for API) --crystal 
function replaceSpaces(toBeReplaced){
  if(toBeReplaced !== undefined){
    toBeReplaced = toBeReplaced.replace(/ /g,"+");
    return toBeReplaced;
  }
}
//below function uses the geolocation function from the browser and returns the lat/long. It then populates the form accordingly, setting up 
//for when the person adds destination address --crystal
function getCurrentLocation(event){
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
  //$("#charts").show();
  $("#lyftDetails").empty();
  const currentLocation = $("#currentLocationInput").val().trim();
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
      // The below try/catch checks to see if startLat and startLng are valid(!undefined) --crystal
      try{
        startLat = response.results[0].geometry.location.lat;
        startLng = response.results[0].geometry.location.lng;
      }catch(err){
        $('#geolocationModal').modal('show');
      }
      
    })
    .fail(function(error){
      $('#geolocationModal').modal('show');
      })
    .then(function(){
      $.ajax({
        url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + destLocation + '&key=AIzaSyC8RAH-4_p4fAMXPDWYouvoZdia88sWRsU', 
        type:"GET",
      })
      .done(function(response){
        // The below try/catch checks to see if destLat and destLng are valid(!undefined) --crystal
        try{
            destLat = response.results[0].geometry.location.lat;
            destLng = response.results[0].geometry.location.lng;
        }catch(err){
            $('#geolocationModal').modal('show');
        }
      })
      .then(function(){
        $.ajax({
          url: 'https://api.lyft.com/v1/cost?start_lat=' +startLat + '&start_lng=' + startLng + "&end_lat=" + destLat + "&end_lng=" + destLng, 
          type:"GET",
          headers:{'Authorization': 'Bearer 0fscv5EK0kYmJeX5HAF2D7fkdFO1k9Xp/jxY73nRKJXNPTpwuqLw7ttZunhTUawBYvyGRLqvsqPmRRBF8Ofh4m44gfSRB30C+5RAhuHsmrZvENRVHFlnMeI='},
    
        })
        .then(function(response){
          $("#carData").show();
          parseLyftData(response, startLat, destLng);
          let lyftData = lyftBarChart(response);
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
              $('#geolocationModal').modal('show');
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
                let uberData = uberBarChart(response);
                BarChartRender(lyftLabels, lyftDataSet, uberData);
                //below function is fired -> populates table with uber data-crystal
                populateUberData(response);
                })
            .fail(function(error){
              $('#geolocationModal').modal('show');
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
      $('#geolocationModal').modal('show');
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
            $('#geolocationModal').modal('show');
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
              $('#geolocationModal').modal('show');
            })
          })
        })
      })
}

// Button click Database incrementation
var database = firebase.database();
var lyftCount = 0;
var uberCount = 0;


database.ref().on("value", function(snapshot) {
  lyftCount = snapshot.child("Lyft").val().lyftCount;
  uberCount = snapshot.child("Uber").val().uberCount;
}, 
function(errorObject) {
});


function preferenceBtn() {
  var lyftButton = $("#btn-lyft");
  var uberButton = $("#btn-uber");
  if ($(this).val() === "Lyft") {
    lyftCount++;
    database.ref("Lyft").set({
      lyftCount: lyftCount
    })
  } else if ($(this).val() === "Uber") {
    uberCount ++;
    database.ref("Uber").set({
      uberCount: uberCount
    })
  }
  database.ref().once('value').then(function(snapshot) {
    $("#preference").text("Users have preferred Lyft " + snapshot.child("Lyft").val().lyftCount + " times and Uber " + snapshot.child("Uber").val().uberCount + " times.");
  });
  lyftButton.fadeOut();
  uberButton.fadeOut();
}

function hideModal(){
  $('#geolocationModal').modal('hide');
}

$("#submit").on("click", submitInfo);
$("#currentLocation").on("click", getCurrentLocation)