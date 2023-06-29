# jitterbit-test
For Jitterbit  practical test

Project pretend to demonstrate use of docker orchestration on a micro-services architecture composed of client, 
API, queue service, data process service and no relational data storage.

## Installation

You need a evironment running Docker Engine version 24.0.2 or higher.
To run project you need start docker compose with the following commmand in project root directory: 

```bash
docker compose up -d
```

## Usage

On same evironment, start a internet browser and open this URL:

http://localhost:4200

Set the numbers on the two fields and click the button bellow.
After at most five seconds the result of sum operation is showed on a table at the bottom.
The newest results are shown at the top of the table.

## Improvements

Implementation of JWT token on the send-mongo-rabbitmq (API) and front-end (client) applications.
Authentication to access RabbitMQ send-mongo-rabbit (API) and receive-rabbitmq-save-mongo (worker).
Setup CORS origin on send-mongo-rabbit (API) application.
Standardization of parameters on all applications.
Code refactoring to determinate and apply design patterns where ists needed. 
Planning of port exposition on docker containers.
Unitary tests.
Documentation.
