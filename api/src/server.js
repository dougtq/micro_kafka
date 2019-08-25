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

// Inclusão q adiciona middleware que coloca o kafka producer na request
App.use((req, res, nxt) => {
    req.producer = producer


    return nxt()
})

// Inclusão de rotas da API
App.use(routes)

async function up() {
    await producer.connect()

    App.listen(2727, "localhost", () => {
        console.log("Server rodando")
    })
}

up().catch(console.error)
