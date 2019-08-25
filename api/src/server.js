import express from "express"
import {
    Kafka,
    logLevel
} from "kafkajs"

import routes from "./routes"

const App = express()

const kafka = new Kafka({
    clientId: 'api',
    brokers: ['localhost:9092'],
    logLevel: logLevel.WARN,
    retry: {
        initialRetryTime: 300,
        retries: 10
    },
})

const producer = kafka.producer()
const consumer = kafka.consumer({
    groupId: "certificate-group-receiver"
})

// Inclusão q adiciona middleware que coloca o kafka producer na request
App.use((req, res, nxt) => {
    req.producer = producer


    return nxt()
})

// Inclusão de rotas da API
App.use(routes)

async function up() {
    await producer.connect()

    await consumer.subscribe({
        topic: 'certification-response'
    });

    await consumer.run({
        eachMessage: async ({
            message
        }) => {
            console.log('Resposta', String(message.value));
        },
    })

    App.listen(2727, "localhost", () => {
        console.log("Server rodando")
    })
}

up().catch(console.error)
