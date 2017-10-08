let events = [
    "TODAY_PAYLOAD", // Lo de hoy
    "CATEGORIES_PAYLOAD", // Categorias
    "TOGGLE_OFFERTS_PAYLOAD", // Pausar / Reanudar mensajes
    "CONTACT_PAYLOAD", // Contacto
    "STARTER_PAYLOAD", // Get started
    "RESUME_OFFERTS_PAYLOAD",
    "FUN_PAYLOAD",
    "SHARE_PAYLOAD",
    "WEEKLY_PAYLOAD",
    "MENU-OPTIONS_PAYLOAD",
    "DISCOVER_PAYLOAD",
];

// only that day deals

module.exports = function (datastore) {
    return {
        get: function (userObject, event) {
            for (let _e of events) {
                if (/*_e === event*/true) {
                    let
                        eventArguments = event.split('_'),
                        eventFile = eventArguments[0].toLowerCase(),
                        eventObj = require(`./events/${eventFile}`),
                        eventObject = new eventObj(userObject)
                    ;

                    console.log("Invoking", eventFile, typeof eventObject.setArguments);

                    eventObject.setDatastore(datastore);
                  
                    if (typeof eventObject.setArguments !== 'undefined') {
                        eventObject.setArguments(eventArguments);
                    }

                    return eventObject;
                }
            }
        }
    };
};
