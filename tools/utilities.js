module.exports = {
  cleanUserInterests: function (interests) {
    let registeredInterests = [];
    if (interests.length > 0) {
      for (let i in interests) {
        if (interests.hasOwnProperty(i) && isNaN(interests[i])) {
          delete interests[i];
          continue;
        }
        if (interests.hasOwnProperty(i) && registeredInterests.indexOf(interests[i]) !== -1) {
          delete interests[i];
          continue;
        }
      }
    }
    
    return interests;
  }
};