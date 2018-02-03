// Firebase
var config = {
    apiKey: "AIzaSyBq2X4aPR6j4XLD_uFwfZ5V_YGztrgIfkM",
    authDomain: "ride-96547.firebaseapp.com",
    databaseURL: "https://ride-96547.firebaseio.com",
    projectId: "ride-96547",
    storageBucket: "ride-96547.appspot.com",
    messagingSenderId: "918464797775"
};
firebase.initializeApp(config);
var database = firebase.database();
//Global Variables
var email = "";
var password = "";
var uid = "";
var errorCode = "";
var errorMessage = "";
//jQuery Global Variable
var newUser = $("#newUser");
var loginSubmit = $("#loginSubmit");
var loginLink = $(".loginLink");
var forgotPasswordSubmit = $("#forgotPasswordSubmit");
var forgotPasswordEmail = $("#forgotPasswordEmail");
var formControl = $(".form-control");
var inputEmail = $("#inputEmail");
var inputPassword = $("#inputPassword");
var newEmail = $("#newEmail");
var newPassword = $("#newPassword");
var homePage = $(".homePage");
// Create New User Account
firebase.auth().onAuthStateChanged(function(user){
    var pageName = location.pathname.split('/');
    if(user){
        homePage.attr("href","index2.html");
        user.providerData.forEach(function (profile){
            // console.log("Sign-in provider: " + profile.providerId);
            // console.log("  Provider-specific UID: " + profile.uid);
            // console.log("  Name: " + profile.displayName);
            // console.log("  Email: " + profile.email);
            // console.log("  Photo URL: " + profile.photoURL);
          });
        loginLink.text("Sign Out");
        if(pageName[pageName.length - 1] === "index.html"){
            location.href="index2.html";
        }
    }
    else{
        loginLink.text("Login");
        homePage.attr("href","index.html");
        if(pageName[pageName.length - 1] === "index2.html"){
            location.href="index.html";
        }
    }
});

// Create Account
newUser.on("click", function(event){
    event.preventDefault();
    email = newEmail.val().trim();
    password = newPassword.val().trim();
    formControl.val("");
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(){
        location.href="index2.html";
    }).catch(function(error){
        errorCode = error.code;
        errorMessage = error.message;
        if(errorCode === "auth/email-already-in-use"){
            alert(errorMessage);
        }
        else if(errorCode === "auth/weak-password"){
            alert(errorMessage);
        }
    });
});
// Login Account
loginSubmit.on("click", function(event){
    event.preventDefault();
    email = inputEmail.val().trim();
    password = inputPassword.val().trim();
    formControl.val("");
    firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
        location.href="index2.html";
    }).catch(function(error){
        errorCode = error.code;
        errorMessage = error.message;
        if(errorCode){
            alert(errorMessage);
        }
    });
});
// Sign Out of Account
loginLink.on("click", function(event){
    if($(this).text() === "Sign Out"){
        firebase.auth().signOut().then(function(){
            location.href="index.html";
        }).catch(function(error) {
            errorCode = error.code;
            errorMessage = error.message;
            if(errorCode){
                alert(errorMessage);
            }
        });
    }
});
// Forgot Password Link
forgotPasswordSubmit.on("click", function(event){
    event.preventDefault();
    email = forgotPasswordEmail.val().trim();
    formControl.val("");
    var auth = firebase.auth();
    auth.sendPasswordResetEmail(email).then(function() {
        alert("Email Sent!")
    }).catch(function(error){
        errorCode = error.code;
        errorMessage = error.message;
        if(errorCode){
            alert(errorMessage);
        }
    });
});
//
var user = firebase.auth().currentUser;
// Update Profile
$("").on("click", function(event){
    user.updateProfile({
        displayName: "",
        photoURL: ""
    }).then(function() {

    }).catch(function(error){

    });
});
// Change Email
$("").on("click", function(event){
    user.updateEmail("user@example.com").then(function() {

    }).catch(function(error) {

    });
});