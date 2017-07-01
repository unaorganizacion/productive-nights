const MODE_ADD = 1;
const MODE_REMOVE = 2;

module.exports = function (interests = [], mode, locale, offset = 0, exceptions = []) {
  if (locale.includes("_")) {
    locale = locale.split("_")[0];
  }
  
  let
    categoriesList = require("../categories"),
    categories = [],
    maxCategories = 9,
    countCategories = 0,
    index = null,
    lastIndex = null
  ;

  categoriesList.sort(function(a, b) {
    let attrSort = 
        (typeof a.names[locale] !== 'undefined' && a.names[locale].length > 0) ?
        locale :
        'default';
    
    var nameA = a.names[attrSort].toUpperCase(); // ignore upper and lowercase
    var nameB = b.names[attrSort].toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    // names must be equal
    return 0;
  });
  
  for (let key in categoriesList) {
    let category = categoriesList[key];
    if (
        (mode === MODE_ADD && interests.indexOf(category.id) >= 0) ||
        (mode === MODE_REMOVE && interests.indexOf(category.id) === -1)
    ){
        continue;
    }
    // categories must have default name
    if (countCategories >= maxCategories) {
      index = key;
      break;
    }
    
    if (key < offset) continue;
    if (!("default" in category.names)) continue;
    let categoryNameFound = false;
    for (let catLocale in category.names) {
      let name = category.names[catLocale];
      if (catLocale === locale) {
        categories.push({
          id: category.id,
          name: name
        });
        categoryNameFound = true;
        countCategories++;
      }
    }
    
    if (!categoryNameFound && exceptions.indexOf(category.id) === -1) {
      categories.push({
        id: category.id,
        name: category.names["default"]
      });
      countCategories++;
    }
    lastIndex = key;
  }
  
  if (countCategories >= maxCategories) {
    if (index === null)
      index = lastIndex + 1;
    categories.push({
        id: index,
        name: "NEXT"
      });
  }
  else if (offset > 0) {
    categories.push({
        id: 0,
        name: "NEXT"
      });
  }
  
  return categories;
};