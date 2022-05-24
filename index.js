const express = require('express')
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c5gx8.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productCollections = client.db('mobile-manufacture').collection("products")
        // Read all data
        app.get('/products', async (req, res) => {
            const query = req.query;
            const cursor = productCollections.find(query);
            const result = await cursor.toArray()
            console.log(result);
            res.send(result);
        })

        // Find a data

        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await productCollections.findOne(filter);
            res.send(result);
        })

        // Update a data

        app.put('/update/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    ...data,
                },
            };
            const result = await productCollections.updateOne(filter, updateDoc, options);
            res.send(result);
        })

    } finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})