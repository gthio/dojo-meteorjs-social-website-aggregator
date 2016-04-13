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
  },
  
  votes: function(websiteID){
       
    var total = 0;
    
    Votes.find({siteId: websiteID})
      .map(function(item){
        total += item.vote});
        
    return total;
  }
});

Template.websites.events({  
  'click .js-show-website-form': function (event){
    $("#website_add_form").modal('show');
  },
  
  'click .js-upvote': function(event) {
    if (Meteor.user()){
      Meteor.call('addVote', 
        Meteor.userId(),
        this._id,
        1)
    }
  },
  
  'click .js-downvote': function(event) {
    if (Meteor.user()){
      Meteor.call('addVote',
        Meteor.userId(),
        this._id,
        -1)
    }
  }  
  
});

Template.website.events({
});

Template.website_add_form.events({  
  'submit .js-add-website': function(event){        
      
    var url = event.target
      .website_url.value;
   
   if (Meteor.user()){
    Meteor.call('addWebsite',
      Meteor.user()._id,
      url);  
   }
   
    $("#website_add_form").modal('show');
    
    return false;
  }
});

Template.comments.helpers({
  commentByCreatedOn: function(websiteID){
    return Comments.find(
      {websiteID: websiteID},
      {sort: {createdOn: -1}});
  }
});

Template.add_comment.events({
  'submit .js-add-comment': function(event){
    
    if (Meteor.user()) {
            
      Comments.insert({        
        comment: event.target.comment_comment.value,
        websiteID: this._id,
        ownerID: Meteor.userId(),
        createdOn: new Date()
      });
    }
  }      
});
