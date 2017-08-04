var menu = {
    "persistent_menu": [
        {
            "locale": "default",
            "composer_input_disabled": true,
            "call_to_actions": [
                {
                    "type": "postback",
                    "title": "🔥 Lo de hoy",
                    "payload": "TODAY_PAYLOAD"
                },
                {
                    "type": "postback",
                    "title": "🏷️ Categor\u00edas",
                    "payload": "CATEGORIES_PAYLOAD"
                },
                {
                    "type": "nested",
                    "title": "Otros",
                    "call_to_actions": [
                        {
                            "type": "postback",
                            "title": "⏯️ Pausar\/Reanudar promos",
                            "payload": "TOGGLE_OFFERTS_PAYLOAD"
                        },
                        {
                            "type": "postback",
                            "title": "💬 Contacto",
                            "payload": "CONTACT_PAYLOAD"
                        }
                    ]
                }
            ]
        }
    ]
};
