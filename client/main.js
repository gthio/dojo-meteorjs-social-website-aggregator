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

Template.registerHelper('formatDate', function(date, format) {
  return moment(date).format(format);
});

Template.websites.helpers({
  websites: function(){

  return Websites.find({},
    {sort: {votes: -1, createdOn: -1}});
    
    /* 
    if (Session.get('searchFilter') == null ||
      Session.get('searchFilter') == '')
    {
      return Websites.find({},
        {sort: {votes: -1, createdOn: -1}});
    }
    else
    {
      return Websites.find({url: {$regex: Session.get('searchFilter'), $options: 'i'}},
        {sort: {votes: -1, createdOn: -1}});
    }
    */
    
  },
  
  isMyVote: function(websiteID,
    voteValue){
      
    var result = Votes.findOne({siteId: websiteID,
      userId: Meteor.userId()});
      
    if (voteValue &&
      result){
      return result.vote == voteValue;
    } 
    
    if (voteValue == null &&
      result == null){
      return true;
    }
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
  },  
});

Template.website.events({
});

Template.searchFilter.events({
  'keyup .searchInput': _.throttle(function(e, t) {
    var searchFilter = Session.get('searchFilter') || {};
    var searchValue = t.$('.searchInput').val();
 
    if(searchValue){
      if(this.number){
        searchValue = parseFloat(t.$('.searchInput').val());
      }
 
      searchFilter[this.columnName] = searchValue;
    }
    else{
      delete searchFilter[this.columnName];
    }
    Session.set('searchFilter', searchValue);
    
    console.log(searchValue);
 
  },500)
});
 
Template.searchFilter.helpers({
  searchValue: function() {
    var searchFilter = Session.get('searchFilter');
 
    if(searchFilter && searchFilter[this.columnName]){
      return searchFilter[this.columnName];
    } 
    else {
      return '';
    }
  }
});

Template.website_add_form.events({  
  'submit .js-add-website': function(event){        
      
    var url = event.target
      .website_url.value;
      
    if (url.toLowerCase().lastIndexOf('http') < 0){
      url = 'http://' + url;
    }
   
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

Template.comment.helpers({
  getUserName: function(userId) {
    var user = Meteor.users.findOne({_id: userId});
      
    if (user){
      return user.username;
    }
    else{
      return "Anonymous"; 
    }
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
