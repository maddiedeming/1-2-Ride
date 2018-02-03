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
// Create New User Account
firebase.auth().onAuthStateChanged(function(user){
    if(user){
        $(".loginLink").text("Sign Out");
    }
    else{
        $(".loginLink").text("Login");
    }
});
// Create Account
$("#newUser").on("click", function(event){
    event.preventDefault();
    email = $("#newEmail").val().trim();
    password = $("#newPassword").val().trim();
    $(".form-control").val("");
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(){
        location.href="index.html";
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
$("#loginSubmit").on("click", function(event){
    event.preventDefault();
    email = $("#inputEmail").val().trim();
    password = $("#inputPassword").val().trim();
    $(".form-control").val("");
    firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
        location.href="index.html";
    }).catch(function(error){
        errorCode = error.code;
        errorMessage = error.message;
        if(errorCode){
            alert(errorMessage);
        }
    });
});
// Sign Out of Account
$(".loginLink").on("click", function(event){
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
$("#forgotPasswordSubmit").on("click", function(event){
    event.preventDefault();
    email = $("#forgotPasswordEmail").val().trim();
    $(".form-control").val("");
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