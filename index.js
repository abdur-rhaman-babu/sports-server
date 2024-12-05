    require("dotenv").config();
    const express = require("express");
    const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
    const cors = require("cors");
    const app = express();
    const port = process.env.PORT || 2500;

    app.use(cors());
    app.use(express.json());

    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6avkk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

    const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    });

    async function run() {
    try {
        const sportEquipmentCollection = client
        .db("equipDB")
        .collection("products");

        app.post("/products", async (req, res) => {
        const product = req.body;
        const result = await sportEquipmentCollection.insertOne(product);
        res.send(result);
        });

        app.get("/products", async (req, res) => {
        const query = sportEquipmentCollection.find();
        const result = await query.toArray();
        res.send(result);
        });

        app.get("/products/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await sportEquipmentCollection.findOne(query);
        res.json(result);
        });

        app.get("/products/email/:email", async (req, res) => {   
        const email = req.params.email;
        const query = { user_email:email };
        const result = await sportEquipmentCollection.find(query).toArray()
        res.send(result)
        });
        
    } catch (error) {
        console.log(error);
    }
    }
    run().catch(console.dir);

    app.get("/", (req, res) => {
    res.send("Sports Equipment server is running...");
    });

    app.listen(port, () => {
    console.log(`Server is running on ${port}`);
    });
