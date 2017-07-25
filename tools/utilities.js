module.exports = {
  cleanUserInterests: function (interests) {
    let registeredInterests = [];
    if (interests.length > 0) {
      try {
          for (let i in interests) {
              if (interests.hasOwnProperty(i) && isNaN(interests[i])) {
                  interests.splice(i, 1);
                  continue;
              }
              if (interests.hasOwnProperty(i) && registeredInterests.indexOf(interests[i]) !== -1) {
                  interests.splice(i, 1);
                  continue;
              }
          }
      } catch (e) { console.log("error in clean user interest", e); }
    }
    
    return interests;
  }
};