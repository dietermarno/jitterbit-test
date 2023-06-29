const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()
const amqp = require('amqplib/callback_api');
const mongoose = require('mongoose');
const cfg = require('./setConfig');

var webAPI = express();
webAPI.use(cors({
    origin: '*',
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));
webAPI.listen(cfg.webServerConfig.port, () => {
    console.log(`Server running on port ${cfg.webServerConfig.port}`);
});

const operationSchema = new mongoose.Schema({
    number1: Number,
    number2: Number,
    result: Number,
    calculationStatus: String
});
const calculation = mongoose.model('calculations', operationSchema);

webAPI.get("/", cors(), (req, res) => {
    res.json({"app": "Jitterbit NodeJS Web Test"});
});

webAPI.get("/getSolved", cors(), (req, res) => {
    mongoConnect(cfg)
    .then(async function () {
        calculation.find({ calculationStatus: 'solved' }).sort({ _id: -1 }).then(result => {
          res.json(result);
          mongoose.connection.close()
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        });        
    })
    .catch(err => {
        console.log(err);
        res.json(err);
    })
});

webAPI.post("/execCalculation", cors(), jsonParser, (req, res) => {
    console.log(JSON.stringify(req.body));
    mongoConnect(cfg)
    .then(async function () {
        const calculationRecord = new calculation({ number1: req.body.number1, number2: req.body.number2, result: 0, calculationStatus: 'pending' });
        await calculationRecord.save().then(newCalculation => {
            amqp.connect(`amqp://${cfg.rabbitConfig.host}:${cfg.rabbitConfig.port}`, function (error0, connection) {
                if (error0) {
                    throw error0;
                }
                connection.createChannel(function (error1, channel) {
                    if (error1) {
                        throw error1;
                    }
                    const queue = 'calculations';
                    const msg = JSON.stringify(newCalculation);

                    channel.assertQueue(queue, {
                        durable: false
                    });

                    channel.sendToQueue(queue, Buffer.from(msg));
                    console.log(" [x] Sent %s", msg);
                    res.json(newCalculation);
                });
                setTimeout(function () {
                    mongoose.connection.close()
                    connection.close();
                }, 500);
            });
        });

    })
    .catch(err => {
        console.log(err);
        res.json(err);
    })
});

async function mongoConnect(config) {
    const connectionString = `mongodb://`
        + `${config.mongoDBConfig.user}:`
        + `${config.mongoDBConfig.password}@`
        + `${config.mongoDBConfig.host}:`
        + `${config.mongoDBConfig.port}/`
        + `${config.mongoDBConfig.database}?authSource=admin`;
    await mongoose.connect(connectionString)
        .then(connection => {
            return connection;
        })
        .catch(err => {
            throw err;
        });
}