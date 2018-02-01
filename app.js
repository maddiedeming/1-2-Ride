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
//On Load
$("#logout").hide();
// Create New User Account
$("#newUser").on("click", function(event){
    event.preventDefault();
    email = $("#newEmail").val().trim();
    password = $("#newPassword").val().trim();
    $(".form-control").val("");
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(){
        $("#createAccount").modal("hide");
        $("#loginMenu").hide();
        $("#logout").show();
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
$("#submit").on("click", function(event){
    event.preventDefault();
    email = $("#inputEmail").val().trim();
    password = $("#inputPassword").val().trim();
    $(".form-control").val("");
    firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
        $("#loginMenu").hide();
        $("#logout").show();
    }).catch(function(error){
        errorCode = error.code;
        errorMessage = error.message;
        if(errorCode){
            // Alert is temporary. Only for testing purposes at the moment.
            // Will use popover.
            alert(errorMessage);
        }
    });
});
// Sign Out of Account
$("#logout").on("click", function(event){
    firebase.auth().signOut().then(function(){
        $("#loginMenu").show();
        $("#logout").hide();
    }).catch(function(error) {
        errorCode = error.code;
        errorMessage = error.message;
        if(errorCode){
            // Alert is temporary. Only for testing purposes at the moment.
            // Will use popover.
            alert(errorMessage);
        }
    });
});
// Forgot Password Link
// This works, just need to integrate it better with the UI. Saving for later.
// $("#togglePassword").on("click", function(event){
//     event.preventDefault();
//     $("#forgotPassword").show();
//     email = $("#existingEmail").val().trim();
//     $(".form-control").val("");
//     var auth = firebase.auth();
//     auth.sendPasswordResetEmail(email).then(function() {
//         alert("Email Sent!")
//     }).catch(function(error) {
//         errorCode = error.code;
//         errorMessage = error.message;
//     });
// });