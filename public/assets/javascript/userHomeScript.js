//Below funtion will populate div with history or send info to firebase
    function populateHistory(response){
        console.log(response)
    }
    //below contains personal info, we can capture email etc..
    function populateDiv(response){
        console.log(response)
        let newDiv = $("<div>");
        let newh2 = $("<h3>");
        newh2.text(response.first_name);
        newDiv.append(newh2);
        $("#personalInfo").append(newDiv);
    }
    //below function grabs parameters from url(uber responds with access token which we 
    //grab and use to make user requests)
    function getUrlParams( prop ) {
        let params = {};
        let search = decodeURIComponent( window.location.href.slice( window.location.href.indexOf( '?' ) + 1 ) );
        let definitions = search.split( '&' );
        let String1=search.substring(search.indexOf("access_token=")+13,search.indexOf("&"));
            $.ajax({url: 'https://api.uber.com/v1.2/me?&access_token=' + String1, 
                    type: 'GET'
                })
                    .done(function(response){
                    populateDiv(response);
                    })
                    .fail(function(error){
                    console.log(error)
                });
            $.ajax({url: 'https://api.uber.com/v1.2/history?&access_token=' + String1, 
                    type: 'GET'
                })
                    .done(function(response){
                    populateHistory(response);
                    })
                    .fail(function(error){
                    console.log(error)
                });
    }
getUrlParams()