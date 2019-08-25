import {
    Router
} from "express"
import {
    CompressionTypes
} from "kafkajs"

const routes = Router()

routes.post("/certifications", async (req, res) => {
    //console.log("Producer Kafka", req.producer)

    const producer = req.producer

    await producer.send({
        "topic": "issue-certificate",
        "compression": CompressionTypes.GZIP,
        "messages": [{
            "key": "test",
            "value": "aaaa"
        }]
    })

    return res.status(201).json({
        "ok": true
    })
})

export default routes
