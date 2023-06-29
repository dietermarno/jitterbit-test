using System.Text;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using MongoDB.Driver;
using MongoDB.Bson;
using Newtonsoft.Json;
using receive;

Console.WriteLine("Waiting for Rabbit MQ to stabilize...");
Thread.Sleep(10000);
Console.WriteLine("Trying to connect Rabbit MQ...");

var factory = new ConnectionFactory { 
    HostName = "rabbitmq",
    Port = 5672
};
using var connection = factory.CreateConnection();
using var channel = connection.CreateModel();

channel.QueueDeclare(queue: "calculations",
                     durable: false,
                     exclusive: false,
                     autoDelete: false,
                     arguments: null);

Console.WriteLine("Waiting for messages...");

var consumer = new EventingBasicConsumer(channel);
consumer.Received += (model, ea) =>
{
    var body = ea.Body.ToArray();
    var message = Encoding.UTF8.GetString(body);
    operationSchema? jsonMessage = JsonConvert.DeserializeObject<operationSchema>(message);
    Console.WriteLine($"Received message {message}");

    Console.WriteLine("Trying to connect Mongo DB...");
    var dbClient = new MongoClient("mongodb://root:example@mongo-database:27017?authSource=admin");
    IMongoDatabase db = dbClient.GetDatabase("local");

    var calculations = db.GetCollection<BsonDocument>("calculations");
    var builder = Builders<BsonDocument>.Filter;
    if (jsonMessage is not null)
    {
        var filter = Builders<BsonDocument>.Filter.Eq("_id", ObjectId.Parse(jsonMessage._id));
        var document = calculations.Find(filter).ToList().FirstOrDefault();
        if (document is not null)
        {
            Console.WriteLine("Updating Mongo DB record...");
            var update = Builders<BsonDocument>.Update
                .Set("calculationStatus", "solved")
                .Set("result", document.GetValue("number1").ToDecimal() + document.GetValue("number2").ToDecimal());
            calculations.UpdateOne(filter, update);
        }
    }
};
channel.BasicConsume(queue: "calculations",
                     autoAck: true,
                     consumer: consumer);

while (channel.IsOpen) {
    Thread.Sleep(5000);
}

Console.WriteLine("Rabbit MQ Channel is down. Exiting...");
