import { Kafka, logLevel, CompressionTypes } from "kafkajs"

const topic_name = "issue-certificate"

const kafka = new Kafka({
    clientId: 'certificate-generator',
    brokers: ['localhost:9092'],
    compression: CompressionTypes.GZIP,
    logLevel: logLevel.WARN,
    retry: {
        initialRetryTime: 300,
        retries: 2
    },
})

const consumer = kafka.consumer({ groupId: "certificate-group" })

const run = async () => {
    await consumer.connect()
    await consumer.subscribe({ "topic": topic_name })
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`

            console.debug(`- ${prefix} ${message.key} : ${message.value}`)
        }
    })

}

run().catch(console.error)
