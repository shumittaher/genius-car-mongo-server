const express = require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId
const app = express()
const port = process.env.PORT || 5000


app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.egg9z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        console.log('connection success')
        const database = client.db('car-mechanic')
        const collection = database.collection("services")

        //get
        app.get('/services', async (req, res) => {
            console.log('hit the get api')
            const cursor = collection.find({})
            const services = await cursor.toArray()
            res.send(services)

        })

        //get single
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id
            console.log('hit the single get api', id)
            const query = { _id: ObjectId(id) };
            const service = await collection.findOne(query)
            res.send(service)

        })

        //post
        app.post('/services', async (req, res) => {
            service = req.body
            console.log('hit the post api', service)
            const result = await collection.insertOne(service)
            res.send(result)
        })

    } finally {
        // await client.close();
    }
}


app.get('/', (req, res) => {
    res.send('Running Genius Server')
})

app.listen(port, () => {
    console.log('running genius server on port :', port)
})

run().catch(console.dir);
