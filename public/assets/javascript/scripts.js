
//below function takes a string, trims end, and replaces spaces with the "+" symbol for the ajax calls(necessary for API) --crystal 
function replaceSpaces(toBeReplaced){
  toBeReplaced = toBeReplaced.replace(/ /g,"+");
  return toBeReplaced;
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
      $.ajax({url:"https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng + "&key=AIzaSyCBscZGrlKGb8HG8o5qqNOXhWXbY9qLJx0", 
        type:"GET"})
      .done(function(results){
        let currentAddress = results.results[0].address_components[0].long_name + " " + results.results[0].address_components[1].short_name;
        let currentCity = results.results[0].address_components[2].short_name;
        let currentState = results.results[0].address_components[5].short_name;
        $("#address").val(currentAddress);
        $("#city").val(currentCity);
        $("#state").val(currentState);
      });
    
  }
  function error(err){
     $('#geolocationModal').modal('show');
  }
}
//below function populates table with Uber data --crystal
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
//below function populates table with Lyft data --crystal
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
 //Below extracts Dom info, sends to calls --crystal
function submitInfo(){
  event.preventDefault();
  const address = replaceSpaces($("#address").val());
  const city = replaceSpaces($("#city").val().trim());
  const state = $("#state").val().trim();
  const lat = 0;
  const lng = 0;
  const destAddress = replaceSpaces($("#destAddress").val());
  const destCity = replaceSpaces($("#destCity").val());
  const destState = $("#destState").val();
  costComparison(address, city, state, destAddress, destCity, destState);
  seatComparison(address, city, state);
}

// Function contains ajax requests for cost comparison Data
function costComparison(address, city, state, destAddress, destCity, destState) {
  $.ajax({
    url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + ',+' + city + ',+' + state + '&key=AIzaSyC8RAH-4_p4fAMXPDWYouvoZdia88sWRsU', 
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
        url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + destAddress + ',+' + destCity + ',+' + destState + '&key=AIzaSyC8RAH-4_p4fAMXPDWYouvoZdia88sWRsU', 
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
            url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + ',+' + city + ',+' + state + '&key=AIzaSyC8RAH-4_p4fAMXPDWYouvoZdia88sWRsU', 
            type:"GET",
      
          })
          .then(function(){
            $.ajax({url: 'https://api.lyft.com/v1/cost?start_lat=' +startLat + '&start_lng=' + startLng + "&end_lat=" + destLat + "&end_lng=" + destLng, 
                  type:"GET",
                  headers:{'Authorization': 'Bearer 0fscv5EK0kYmJeX5HAF2D7fkdFO1k9Xp/jxY73nRKJXNPTpwuqLw7ttZunhTUawBYvyGRLqvsqPmRRBF8Ofh4m44gfSRB30C+5RAhuHsmrZvENRVHFlnMeI='}})
            .done(function(response){
              startLat = response.results[0].geometry.location.lat;
              startLng = response.results[0].geometry.location.lng;
            })
              .fail(function(error){
              console.log(error)
            })
              .then(function(){
              $.ajax({
                url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + destAddress + ',+' + destCity + ',+' + destState + '&key=AIzaSyC8RAH-4_p4fAMXPDWYouvoZdia88sWRsU', 
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


function seatComparison(address, city, state) {
  $.ajax({
    url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + ',+' + city + ',+' + state + '&key=AIzaSyC8RAH-4_p4fAMXPDWYouvoZdia88sWRsU', 
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
          url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + ',+' + city + ',+' + state + '&key=AIzaSyC8RAH-4_p4fAMXPDWYouvoZdia88sWRsU', 
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
      //Lyft Ends
      //Uber Call
        $.ajax({url: 'https://api.uber.com/v1.2/products', 
                type: 'GET',
                headers:{Authorization: 'Token YEEveIYDU-uU4BRcgORqnvoLRtrCtQDzc0yvbRVs'}})
                .done(function(response){
                  console.log("Below are the results coming back from Uber: ")
                  console.log(response)
                }).fail(function(error){
                  console.log(error)
                });
                    }
      $("#submit").on("click", submitInfo);
      $("#currentLocation").on("click", getCurrentLocation)
