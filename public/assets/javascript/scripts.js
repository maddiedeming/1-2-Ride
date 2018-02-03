//below funtion takes a string, trims end, and replaces spaces with the "+" symbol for the ajax calls(necessary for API) 
    function replaceSpaces(toBeReplaced){
        toBeReplaced = toBeReplaced.replace(/ /g,"+");
        return toBeReplaced;
    }
    //below function uses the geolocation function from the browser and returns the lat/long. It then populates the form accordingly, setting up 
    //for when the person adds destination address 
     function getCurrentLocation(){
       event.preventDefault();
        if ("geolocation" in navigator) {
            /* geolocation is available */navigator.geolocation.getCurrentPosition(function(position) {
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
    function submitInfo(){
      event.preventDefault();
      let address = replaceSpaces($("#address").val());
      let city = replaceSpaces($("#city").val().trim());
      let state = $("#state").val().trim();
      let lat = 0;
      let lng = 0;
      let destAddress = replaceSpaces($("#destAddress").val());
      let destCity = replaceSpaces($("#destCity").val());
      let destState = $("#destState").val();
     

      //Lyft Begins
      $.ajax({url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + ',+' + city + ',+' + state + '&key=AIzaSyC8RAH-4_p4fAMXPDWYouvoZdia88sWRsU', 
              type:"GET",})
        .done(function(response){
          lat = response.results[0].geometry.location.lat;
        })
        .fail(function(error){
          console.log(error)
        })
        .then(function(){
          $.ajax({url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + destAddress + ',+' + destCity + ',+' + destState + '&key=AIzaSyC8RAH-4_p4fAMXPDWYouvoZdia88sWRsU', 
                  type:"GET",})
          .done(function(response){
            lng = response.results[0].geometry.location.lng;
          })
          .then(function(){
            $.ajax({url: 'https://api.lyft.com/v1/ridetypes?lat=' +lat + '&lng=' + lng, 
                  type:"GET",
                  headers:{'Authorization': 'Bearer cCua1E9wIl6vB0YF61xLMi8DnUor7q4LyzjKwKclz4bIOeN6czq2YTSPos6t5Qgt2WRtpLdRYQz8fWalrvXyuUjkaFINNt3pzHkEpAyLSSaHBGcXcwlw2RM='}})
            .done(function(response){
              console.log("Below are the results coming back from Lyft: ")
              console.log(response)
            })
          })
          .fail(function(error){
            console.log(error)
          })
        })
      //Lyft Ends
      //Uber Call
        $.ajax({url: 'https://api.uber.com/v1.2/products?latitude=37.7752315&longitude=-122.418075', 
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