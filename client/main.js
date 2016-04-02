
Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function(){
  this.render('welcome', {
    to:"main"
  });
});

Router.route('/websites', function(){
  
  this.render('navbar', {
    to:"navbar"
  });
  
  this.render('websites', {
    to:"main"
  });
});

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

Template.websites.helpers({
  
  websites: function(){
	  return Websites.find({},
      {sort: {votes: -1, createdOn: -1}});
  }
});

Template.websites.events({
  
  'click .js-show-website-form': function (event){

    $("#website_add_form").modal('show');
  },
  
});

Template.website_add_form.events({
  
  'submit .js-add-website': function(event){
    

    
    var title = event.target
      .website_title.value;
    
    var description = event.target
      .website_description.value;
      
    var url = event.target
      .website_url.value;
    
    if (Meteor.user()) {
      Websites.insert({
        
        title: title,
        description: description,
        url: url,
        createdOn: new Date(),
        createdBy: Meteor.user()._id
      });
    }
    
    $("#website_add_form").modal('show');
    
    return false;
  }
  
});
