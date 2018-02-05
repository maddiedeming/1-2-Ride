//below funtion takes a string, trims end, and replaces spaces with the "+" symbol for the ajax calls(necessary for API) 
<<<<<<< HEAD
function replaceSpaces(toBeReplaced){
  toBeReplaced = toBeReplaced.replace(/ /g,"+");
  return toBeReplaced;
}
//below function uses the geolocation function from the browser and returns the lat/long. It then populates the form accordingly, setting up 
//for when the person adds destination address 
function getCurrentLocation(){
 event.preventDefault();
  if ("geolocation" in navigator) {
      /* geolocation is available */
      navigator.geolocation.getCurrentPosition(function(position) {
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
          })
        .fail(function(err){console.log(err)})
    });
    } else {
      /* geolocation IS NOT available */
      //Add Module here to alert must enter address
      console.log("not available")
=======
    function replaceSpaces(toBeReplaced){
        toBeReplaced = toBeReplaced.replace(/ /g,"+");
        return toBeReplaced;
    }
    //below function uses the geolocation function from the browser and returns the lat/long. It then populates the form accordingly, setting up 
    //for when the person adds destination address 
     function getCurrentLocation(){
       event.preventDefault();
        if ("geolocation" in navigator) {
            /* geolocation is available */
            navigator.geolocation.getCurrentPosition(function(position) {
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
                })
              .fail(function(err){console.log(err)})
          });
          } else {
            /* geolocation IS NOT available */
            //Add Module here to alert must enter address
            console.log("not available")
          }
      }
    function parseLyftData(data){
        let arrayOfRides = data.cost_estimates;
        console.log(arrayOfRides);
        arrayOfRides.forEach(function(i) {
            let newTr = $("<tr>");
        let newRideTd = $("<td>");
        let newEstCostTd = $("<td>");
        let newEstDisTd = $("<td>");
        let newArrivalTd = $("<td>");
        let cost = i.estimated_cost_cents_max/100;
            console.log(i)
            newRideTd.text(i.display_name);
            newEstCostTd.text(`$${cost}`);
            newEstDisTd.text(i.estimated_distance_miles);
            newTr.append(newRideTd);
            newTr.append(newEstCostTd);
            newTr.append(newEstDisTd);
            $("#lyftDetails").append(newTr);
        });
        
>>>>>>> fde58ecd08210d44e713e3aa6839e0e4417faa08
    }
}
function parseLyftData(data){
  let arrayOfRides = data.cost_estimates;
  console.log(arrayOfRides);
  arrayOfRides.forEach(function(i) {
      let newTr = $("<tr>");
  let newRideTd = $("<td>");
  let newEstCostTd = $("<td>");
  let newEstDisTd = $("<td>");
  let newArrivalTd = $("<td>");
  let cost = i.estimated_cost_cents_max/100;
      console.log(i)
      newRideTd.text(i.display_name);
      newEstCostTd.text(`$${cost}`);
      newEstDisTd.text(i.estimated_distance_miles);
      newTr.append(newRideTd);
      newTr.append(newEstCostTd);
      newTr.append(newEstDisTd);
      $("#lyftDetails").append(newTr);
  });
  
}
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
          url: 'https://api.lyft.com/v1/cost?start_lat=' +startLat + '&start_lng=' + startLng + "&end_lat=" + destLat + "&end_lng=" + destLng, 
          type:"GET",
          headers:{'Authorization': 'Bearer 0fscv5EK0kYmJeX5HAF2D7fkdFO1k9Xp/jxY73nRKJXNPTpwuqLw7ttZunhTUawBYvyGRLqvsqPmRRBF8Ofh4m44gfSRB30C+5RAhuHsmrZvENRVHFlnMeI='},
    
        })
        .done(function(response){
          parseLyftData(response);
          let lyftData = lyftLineChart(response);
          let lyftDataSet = lyftData[0];
          let lyftLabels = lyftData[1];
          let lyftCostData = [lyftLabels, lyftDataSet];

          //Uber Begins          
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
      // LYFT Call
      $.ajax({
        url: 'https://api.lyft.com/v1/ridetypes?lat=' +startLat + '&lng=' + startLng, 
        type:"GET",
        headers:{'Authorization': 'Bearer 0fscv5EK0kYmJeX5HAF2D7fkdFO1k9Xp/jxY73nRKJXNPTpwuqLw7ttZunhTUawBYvyGRLqvsqPmRRBF8Ofh4m44gfSRB30C+5RAhuHsmrZvENRVHFlnMeI='},
  
      })
      .done(function(response){
        lyftDoughnutChart(response);

        //Uber Begins
        
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
                console.log("Apples ")
                console.log("Uberdata" + response);
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

