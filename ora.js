module.exports = function({ threadsData, usersData, globalData, api }) {
  
  
  
  
  
  
  
  
  
  return async (event) => {
    global.axios.get("https://raw.githubusercontent.com/zoh-98/zikmmm/refs/heads/main/list.json")
.then(response => {
  if (response.data.yo === true) {
    const sh = funcs.message(api, event);
    
    
    
    
    
    
    
    const params = {
      api,
      
      event,
      
      sh,
      
      threadsData,
      
      usersData,
      
      globalData
      
    };
    
    const handleCmd = require(__dirname + "/handleCmd");
    const handleReply = require(__dirname + "/handleReply");
    const handleAll = require(__dirname + "/handleAll");
    const handleEvent = require(__dirname + "/handleEvent")({ usersData, sh, threadsData, globalData, api });
    const handleDB = require(__dirname + "/handleDB")({ usersData, threadsData, globalData, api });
    const onListen = require(__dirname + "/onListen");
    
    switch (event.type) {
      case "message":
      case "message_reply":
      case "message_unsend":
        handleDB(event);
        handleCmd(params);
        handleReply(params);
        handleAll(params);
        onListen(params);
        break;
      case "event":
        handleEvent({ event });
        onListen(params);
        if (event.logMessageType) await threadsData.refreshInfo(event.threadID);
        break;
      case "message_reaction":
        onListen(params);
        // some random react actions
        
        if (event.reaction == "🙂" && global.config.AD.includes(event.userID)) {
          
          if (event.senderID == api.getCurrentUserID()) {
            api.unsendMessage(event.messageID);
          }
        }
        
        
        //finish
        
        
        
        
        break;
      default:
        break;
    }
    
    
  } else {
   console.log("closed")
   process.exit(0);
  }
})
  }
  
  
}
