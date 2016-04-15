
Meteor.startup(function () {

  if (!Websites.findOne()){
    
    console.log("No websites yet. Creating starter data.");
    
    Websites.insert({
      _id: "1",      
      title:"Goldsmiths Computing Department", 
      url:"http://www.gold.ac.uk/computing/", 
      description:"This is where this course was developed.", 
      createdOn:new Date()
    });
    
    Websites.insert({
      _id: "2",      
      title:"University of London", 
      url:"http://www.londoninternational.ac.uk/courses/undergraduate/goldsmiths/bsc-creative-computing-bsc-diploma-work-entry-route", 
      description:"University of London International Programme.", 
      createdOn:new Date()
    });
    
    Websites.insert({
      _id: "3",      
      title:"Coursera", 
      url:"http://www.coursera.org", 
      description:"Universal access to the world’s best education.", 
      createdOn:new Date()
    });
    
    Websites.insert({
      _id: "4",
      title:"Google", 
      url:"http://www.google.com", 
      description:"Popular search engine.", 
      createdOn:new Date()
    });
    
    Votes.insert({
      siteId: "3",
      userId: "1",
      vote:1      
    })

    Votes.insert({
      siteId: "3",
      userId: "2",
      vote:1  
    })    

    Votes.insert({
      siteId: "3",
      userId: "3",
      vote:1  
    })      
    
    Votes.insert({
      siteId: "4",
      userId: "1",
      vote:-1      
    })

    Votes.insert({
      siteId: "4",
      userId: "2",
      vote:-1  
    })    
      
  }
});

Meteor.methods({
  'addVote': function(userId, siteId, vote){
    return addVote(userId,
      siteId,
      vote);
  },
  
  'addWebsite': function(userId, url){
    
    var test = HTTP.call('GET',
      url, {},
      function(error, response) {
        if (error){
          console.log(error);
          
          return null;
        }
        else{         
          
          var id = Math.random().toString();
          var websiteData = Scrape.website(url);
                  
          Websites.insert({
            _id: id,
            title: websiteData.title,
            description: websiteData.description,
            url: websiteData.domain,
            createdOn: new Date(),
            createdBy: userId
          }); 

          for(tag of websiteData.tags){
            Tags.insert({
              siteId: id,
              url: websiteData.domain,
              tag: tag
            });              
          }          
        }
      });    
  },     
});

function addVote(userId, 
  siteId,
  vote) {
    
    if (Votes.find({userId: userId, siteId: siteId})
      .count() == 0){
    
        if (userId && siteId && vote){          
          Votes.insert({
            userId: userId,
            siteId: siteId,
            vote: vote
          });
        }
      }
      else{
        
        var current = Votes.findOne({siteId: siteId, 
          userId: userId});
        
        if (current.vote == vote){
          Votes.remove({siteId: siteId, 
            userId: userId});
        }
        else{        
          Votes.update({siteId: siteId, 
            userId: userId}, {$set: {vote: vote}});
        }
      }   
}