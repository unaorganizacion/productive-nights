const MODE_ADD = 1;
const MODE_REMOVE = 2;

module.exports = function (userObject, mode, categories = [], offset = 0) {
  let categoriesQuickResponse = [];
  let insertNextButton = false;
  let nextButtonIndex;
  
  categories = require("../tools/compileCategories")(userObject.interest, mode, userObject.userData.locale, offset);
  
  for (let i in categories) {
    let category = categories[i];
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
      "title": "⏪MÁS",
      "payload": `CATEGORY_NEXT_${nextButtonIndex}_${mode}`
    });
  }
  
  return categoriesQuickResponse;
};