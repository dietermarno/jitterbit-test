const config = require('config');

module.exports = {

    webServerConfig : {
        host: config.get('webserver.host'),
        port: config.get('webserver.port')
    },

    rabbitConfig : {
        host: config.get('rabbitmq.host'),
        port: config.get('rabbitmq.port')
    },

    mongoDBConfig : {
        host: config.get('mongodb.host'),
        port: config.get('mongodb.port'),
        user: config.get('mongodb.user'),
        password: config.get('mongodb.password'),
        database: config.get('mongodb.database')
    }
}
