import amqblib from "amqplib";

if (!process.env.RABBIT_URL) throw new Error("RABBIT_URL não está definido!");
export const queue = "viagens";
const coneccao = await amqblib.connect(process.env.RABBIT_URL);

const rabbit = await coneccao.createChannel();
await rabbit.assertQueue(queue);
console.log("RabbitMQ conectado!");

export default rabbit;
