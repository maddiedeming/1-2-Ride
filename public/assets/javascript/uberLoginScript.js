              
  
function login(){
//Here we are taking a 3rd party framework to get the access token. The below redirect url
//MUST be the same as the one in the uber dashboard.
    let jso = new JSO({
            client_id: "b-XpEFvMX2-9xLEeJfvairgoxc-Mzpuk",
            redirect_uri: "http://localhost:8080/userHome.html",
            authorization: "https://login.uber.com/oauth/v2/authorize"
        });
        JSO.enablejQuery($);
        jso.ajax({
            url: "https://login.uber.com/oauth/v2/authorize",
            oauth: {
                scopes: "profile history"
            },
            dataType: 'json'
        })
    jso.callback();
}

    $("#uberLogin").on("click", login)
 