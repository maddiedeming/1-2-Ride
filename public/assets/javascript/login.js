// Initialize Firebase
var database = firebase.database();
// Global Variables
var email = "";
var savedEmail = "";
var password = "";
var uid = "";
var errorCode = "";
var errorMessage = "";
// jQuery Global Variables
var newUser = $("#newUser");
var loginSubmit = $("#loginSubmit");
var loginLink = $("#loginLink");
var forgotPasswordSubmit = $("#forgotPasswordSubmit");
var forgotPasswordEmail = $("#forgotPasswordEmail");
var formControl = $(".form-control");
var inputEmail = $("#inputEmail");
var inputPassword = $("#inputPassword");
var newEmail = $("#newEmail");
var newPassword = $("#newPassword");
var homePage = $(".homePage");
var displayEmail = displayEmail;
var errorMessageDisplay = $(".errorMessage");
var firstNameDisplay = $("#firstName");
var lastNameDisplay = $("#lastName");
var changeEmail = $("#change");
var displayEmail = $("#displayEmail");
var emailLabel = $("#emailLabel");
var cancel = $("#cancel");
var updateAccount = $("#updateAccount");
var forgotPasswordForm = $("#forgotPasswordForm");
var forgotPasswordError = $("#forgotPasswordError");
var updateAccountError = $("#updateAccountError");
var loginError = $("#loginError");
var signUpError = $("#signUpError");
var gearMenu = $("#gearMenu");
// Initial Page Load
errorMessageDisplay.addClass("invisible");
errorMessageDisplay.text("");
// Create New User Account
firebase.auth().onAuthStateChanged(function(user){
    var pageName = location.pathname.split('/');
    if(user){
        savedEmail = user.email;
        displayEmail.val(savedEmail);
        if(user.displayName !== null){
            var fullName = user.displayName.split(/\s+/);
            var firstName = fullName.slice(0, -1).join(" ");
            var lastName = fullName.pop();
            firstNameDisplay.val(firstName);
            lastNameDisplay.val(lastName);
        }
        else{
            user.updateProfile({displayName: "New User"});
        }
        loginLink.text("Sign Out");
        gearMenu.show();
    }
    else{
        loginLink.text("Login");
        gearMenu.hide();
    }
});
// Create Account
newUser.on("click", function(event){
    event.preventDefault();
    email = newEmail.val().trim();
    password = newPassword.val().trim();
    formControl.val("");
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(){
        errorMessageDisplay.addClass("invisible");
        errorMessageDisplay.text("");
        newUser.text("Success!");
        newUser.removeClass("btn-default");
        newUser.addClass("btn-success");
        setTimeout(function(){
            newUser.text("Update Account");
            newUser.removeClass("btn-success");
            newUser.addClass("btn-default");
            loginLink.text("Sign Out");
            gearMenu.show();
            location.href="index.html";
        }, 1500);
    }).catch(function(error){
        errorCode = error.code;
        errorMessage = error.message;
        if(errorCode){
            $("#signUpError").removeClass("invisible");
            $("#signUpError").text(error.message);
        }
    });
});
// Login Account
loginSubmit.on("click", function(event){
    event.preventDefault();
    email = inputEmail.val().trim();
    password = inputPassword.val().trim();
    firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
        formControl.val("");
        errorMessageDisplay.addClass("invisible");
        errorMessageDisplay.text("");
        location.href="index.html";
    }).catch(function(error){
        inputPassword.val("");
        errorCode = error.code;
        errorMessage = error.message;
        //console.log(error)
        if(errorCode){
            loginError.removeClass("invisible");
            loginError.text(error.message);
        }
    });
});
// Sign Out of Account
loginLink.on("click", function(event){
    if($(this).text() === "Sign Out"){
        firebase.auth().signOut().then(function(){
        location.href="index.html";
        errorMessageDisplay.addClass("invisible");
        errorMessageDisplay.text("");
        }).catch(function(error) {
            errorCode = error.code;
            errorMessage = error.message;
            if(errorCode){
            }
        });
    }
});
// Forgot Password Link
forgotPasswordForm.on('shown.bs.modal', function(e){
    var prefillEmail = inputEmail.val();
    forgotPasswordEmail.val(prefillEmail);
});
// Forgot Password Link Submit Button
forgotPasswordSubmit.on("click", function(event){
    event.preventDefault();
    email = forgotPasswordEmail.val().trim();
    var auth = firebase.auth();
    auth.sendPasswordResetEmail(email).then(function() {
        errorMessageDisplay.addClass("invisible");
        errorMessageDisplay.text("");
        forgotPasswordSubmit.removeClass("btn-default");
        forgotPasswordSubmit.addClass("btn-success");
        forgotPasswordSubmit.text("Email sent!");
        setTimeout(function(){
            forgotPasswordSubmit.addClass("btn-default");
            forgotPasswordSubmit.removeClass("btn-success");
            forgotPasswordSubmit.text("Submit");
            formControl.val("");
            forgotPasswordForm.modal('hide');
        }, 1500);
    }).catch(function(error){
        errorCode = error.code;
        errorMessage = error.message;
        if(errorCode){
            forgotPasswordError.removeClass("invisible");
            forgotPasswordError.text(error.message);
        }
    });
});
// Change Email
changeEmail.on("click", function(event){
    event.preventDefault();
    if($(this).text() === "Change"){
        var saveOldEmail = $(this).val();
        $(this).data("value",saveOldEmail)
        displayEmail.removeAttr("disabled","disabled");
        $(this).attr("onClick","submitEmail()");
        $(this).html('<i class="far fa-check-circle"></i>');
        emailLabel.parent().attr("OnClick","undoEmailChange(this)")
        emailLabel.html('<i id="cancel" class="fas fa-ban"></i>');
    }
});
// Cancel Email Change
function undoEmailChange(x){
    displayEmail.val(savedEmail);
    $(x).removeAttr("onClick");
    cancel.replaceWith("Email");
    changeEmail.text("Change");
    displayEmail.attr("disabled","disabled");
}
// Update Profile
updateAccount.on("click",function(event){
    event.preventDefault();
    var user = firebase.auth().currentUser;
    var name = firstNameDisplay.val() + " " + lastNameDisplay.val();
    user.updateProfile({
        displayName: name
    }).then(function() {
        errorMessageDisplay.addClass("invisible");
        errorMessageDisplay.text("");
        updateAccount.text("Success!");
        updateAccount.removeClass("btn-default");
        updateAccount.addClass("btn-success");
        setTimeout(function(){
            updateAccount.text("Update Account");
            updateAccount.removeClass("btn-success");
            updateAccount.addClass("btn-default");
        }, 1500);
    }).catch(function(error){
        errorCode = error.code;
        errorMessage = error.message;
        if(errorCode){
            updateAccountError.removeClass("invisible");
            updateAccountError.text(error.message);
        }
    });
});
// Submit New Email (Email Change)
function submitEmail(){
    var newEmail = displayEmail.val();
    var user = firebase.auth().currentUser;
    user.updateEmail(newEmail).then(function(){
        errorMessageDisplay.addClass("invisible");
        errorMessageDisplay.text("");
        changeEmail.removeClass("btn-outline-dark");
        changeEmail.addClass("btn-success");
        displayEmail.attr("disabled","disabled");
        changeEmail.removeAttr("onClick");
        emailLabel.parent().removeAttr("onClick");
        emailLabel.text("Email");
        setTimeout(function(){
            changeEmail.text("Change");
            changeEmail.removeClass("btn-success");
            changeEmail.addClass("btn-outline-dark");
        }, 1000);
    }).catch(function(error){
        errorCode = error.code;
        errorMessage = error.message;
        if(errorCode){
            updateAccountError.removeClass("invisible");
            updateAccountError.text(error.message);
        }
    });
};