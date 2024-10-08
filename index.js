const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


//middleware
app.use(express.json());
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://med-ease-375.netlify.app"
    ]
}));

// mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ixszr3u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {


        // collection
        const serviceCollection = client.db('Med-Ease').collection('all-services')

        // get all services
        app.get('/services', async (req, res) => {
            const result = await serviceCollection.find().toArray();
            res.send(result)
        })


        // add a service post method
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log(service)
            const result = await serviceCollection.insertOne(service);
            res.send(result)
        })

        // path for update service
        app.patch('/services/:id', async (req, res) => {
            const id = req.params.id;
            const updated_info = req.body;
            const query = { _id: new ObjectId(id) }
            const updateDoc = {
                $set: {
                    ...updated_info
                }
            }
            const result = await serviceCollection.updateOne(query, updateDoc);
            res.send(result)
        })

        // delete service
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        })




        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


// test server
app.get((req, res) => {
    res.send('server is working')
})
app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})