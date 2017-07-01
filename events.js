let events = [
  "TODAY_PAYLOAD", // Lo de hoy
  "CATEGORIES_PAYLOAD", // Categorias
  "TOGGLE_OFFERTS_PAYLOAD", // Pausar / Reanudar mensajes
  "CONTACT_PAYLOAD", // Contacto
  "STARTER_PAYLOAD", // Get started
  "RESUME_OFFERTS_PAYLOAD"
];

// only that day deals

module.exports = function (datastore) {
  return {
    get: function ( userObject, event ) {
      for (let _e of events) {
        if (_e === event) {
          let
            eventFile = event.split('_')[0].toLowerCase(),
            eventObj = require(`./events/${eventFile}`),
            eventObject = new eventObj(userObject)
          ;
          
          console.log("Invoking", eventFile);
          
          eventObject.setDatastore(datastore);

          return eventObject;
        }
      }
    }
  };
};
