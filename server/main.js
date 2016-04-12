
Meteor.startup(function () {

  if (!Websites.findOne()){
    
    console.log("No websites yet. Creating starter data.");
    
    Websites.insert({
      title:"Goldsmiths Computing Department", 
      url:"http://www.gold.ac.uk/computing/", 
      description:"This is where this course was developed.", 
      createdOn:new Date()
    });
    
    Websites.insert({
      title:"University of London", 
      url:"http://www.londoninternational.ac.uk/courses/undergraduate/goldsmiths/bsc-creative-computing-bsc-diploma-work-entry-route", 
      description:"University of London International Programme.", 
      createdOn:new Date()
    });
    
    Websites.insert({
      title:"Coursera", 
      url:"http://www.coursera.org", 
      description:"Universal access to the world’s best education.", 
      createdOn:new Date()
    });
    
    Websites.insert({
      title:"Google", 
      url:"http://www.google.com", 
      description:"Popular search engine.", 
      createdOn:new Date()
    });
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

          var titleTagStart = '<title';
          var titleTagEnd = '</title>';
          
          var descriptionTagStart = 'description" content="';
          var descriptionTagEnd1 = '">';
          var descriptionTagEnd2 = '" />';
          var descriptionTagEnd3 = '"/>';
                    
          var keywordTagStart = '<meta name="keywords" content="';          
          var keyWordTagEnd = '" />';
          
          var titleStart = response.content.toLowerCase().indexOf(titleTagStart),            
            titleStartTo = response.content.toLowerCase().indexOf('>', titleStart),                      
            titleEnd = response.content.toLowerCase().indexOf(titleTagEnd),
            
            titleLength = titleStartTo - titleStart + 1,
            
            titleText = response.content.substring(titleStart + titleLength, titleEnd);
          
          var descriptionStart = response.content.toLowerCase().indexOf(descriptionTagStart, 1),
            descriptionEnd1 = response.content.toLowerCase().indexOf(descriptionTagEnd1, descriptionStart),
            descriptionEnd2 = response.content.toLowerCase().indexOf(descriptionTagEnd2, descriptionStart),
            descriptionEnd3 = response.content.toLowerCase().indexOf(descriptionTagEnd3, descriptionStart),
            descriptionEnd = (descriptionEnd2 > 0 && (descriptionEnd2 < descriptionEnd1)) ? descriptionEnd2 : descriptionEnd1,
            descriptionEnd = (descriptionEnd3 > 0 && (descriptionEnd3 < descriptionEnd)) ? descriptionEnd3 : descriptionEnd,
            descriptionText = response.content.substring(descriptionStart + descriptionTagStart.length, descriptionEnd);
          
            if (descriptionStart == -1){
              descriptionText = "";
            } 
          
          var keywordStart = response.content.toLowerCase().indexOf(keywordTagStart),
            keywordEnd = response.content.toLowerCase().indexOf(keyWordTagEnd, keywordStart),
            keywordText = response.content.substring(keywordStart + keywordTagStart.length, keywordEnd);
                  
          console.log(descriptionStart);
          console.log(descriptionEnd1);
          console.log(descriptionEnd2);
          console.log(descriptionEnd3);
          console.log(titleText);
          console.log("xxxx");
          console.log(descriptionText)
         
          Websites.insert({
            title: titleText,
                  description: descriptionText,
                  url: url,
                  createdOn: new Date(),
                  createdBy: userId
                });   
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
        Votes.update({siteId: siteId, 
          userId: userId}, {$set: {vote: vote}});
      }   
  }