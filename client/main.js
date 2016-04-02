
Accounts.ui.config({
  passwordSignupFields: "USERNAME_AND_EMAIL"
});

Template.body.helpers({
  
  userName: function(){
    
    if (Meteor.user()){
      
      return Meteor.user().username;
    }
    else{
      
      return "Anonymous";
    }
  }
  
});