              
  
function loginUber(){
//Here we are taking a 3rd party framework to get the access token. The below redirect url
//MUST be the same as the one in the uber dashboard.
    let jso = new JSO({
            client_id: "b-XpEFvMX2-9xLEeJfvairgoxc-Mzpuk",
            redirect_uri: "http://localhost:8080/uberLogin.html",
            authorization: "https://login.uber.com/oauth/v2/authorize"
        });
        
        JSO.enablejQuery($);
        jso.ajax({
            url: "https://login.uber.com/oauth/v2/authorize",
            oauth: {
                scopes: "profile history"
            },
            dataType: 'json',
            success: function(data){console.log(data)}
        })

        jso.wipeTokens();
}
///below is AFTER lgin
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
 let url = window.location.href;
   
   let code = url.slice(url.indexOf("=") + 1, url.indexOf("&"));
   console.log(code); 
function loginLyft(){
    event.preventDefault();
   //let urlParams = new URLSearchParams(window.location.search);
  

    $.ajax({
            url: "https://api.lyft.com/oauth/token",
            "Content-Type": "application/json",
            Authorization:{ "1r2iSdOEO66t":"BOnu5OIJPnmGIkBBJ08YC6dHjhnlBeUH"},
            grant_type: "authorization_code",
            "code" : code
		   
        })


}

    
    $("#uberLogin").on("click", loginUber)
    $("#lyftLogin").on("click", function(){window.location = "https://api.lyft.com/oauth/authorize?client_id=1r2iSdOEO66t&scope=public%20profile%20rides.read%20rides.request%20offline&state=&response_type=code"})
    $("#getData").on("click", getUrlParams)
    $("#getLyftData").on("click", loginLyft)