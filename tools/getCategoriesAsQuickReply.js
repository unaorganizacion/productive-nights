const MODE_ADD = 1;
const MODE_REMOVE = 2;

module.exports = function (userObject, mode, categories) {
  let categoriesQuickResponse = [];
  let insertNextButton = false;
  let nextButtonIndex;

  let compileCategoriesException = [];
  
  for (let category of userObject.interest) {
    if (mode === MODE_REMOVE) {
      compileCategoriesException.push(category);
    }
  }
  
  if (categories.length < 1)
    categories = require("../tools/compileCategories")(userObject.userData.locale, 0, compileCategoriesException);
  
  for (let category of categories) {
    if (
      typeof userObject.interest === "undefined" ||
      (
        (mode === MODE_ADD && userObject.interest.indexOf(category.id) >= 0) ||
        (mode === MODE_REMOVE && userObject.interest.indexOf(category.id) === -1)
      )
    ) continue;
    
    if (category.name !== "NEXT") {
      categoriesQuickResponse.push({
        "content_type":"text",
        "title":category.name,
        "payload": `CATEGORY_${category.id}_${mode}`
      });
    } else {
      insertNextButton = true;
      nextButtonIndex = category.id;
    }
  }
  
  console.log(insertNextButton, categoriesQuickResponse.length);

  if (typeof userObject.interest !== "undefined" && userObject.interest.length > 0) {
    categoriesQuickResponse.unshift({
      "content_type": "text",
      "title": "HECHO",
      "payload": `CATEGORY_END`
    });
  }
  
  if (insertNextButton) {
    categoriesQuickResponse.push({
      "content_type": "text",
      "title": "MÁS",
      "payload": `CATEGORY_NEXT_${nextButtonIndex}_${mode}`
    });
  }
  
  return categoriesQuickResponse;
};