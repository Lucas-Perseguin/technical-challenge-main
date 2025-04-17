import amqblib from "amqplib";
import { configDotenv } from "dotenv";

configDotenv();

if (!process.env.RABBIT_URL) throw new Error("RABBIT_URL não está definido!");
export const queue = "viagens";
const coneccao = await amqblib.connect(process.env.RABBIT_URL);

const rabbit = await coneccao.createChannel();
await rabbit.assertQueue(queue);
console.log("RabbitMQ conectado!");

rabbit.consume(queue, (mensagem) => {
  if (mensagem !== null) {
      console.log('Received:', mensagem.content.toString());
      rabbit.ack(mensagem);
    } else {
      console.log('Consumer cancelled by server');
    }
})
