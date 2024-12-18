require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 2500;

app.use(cors({ origin: ["http://localhost:5173/"], credentials: true }));
app.use(express.json());
app.use(cookieParser());

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

    app.get("/myApplication", async (req, res) => {
      const email = req.query.email;
      const query = { user_email: email };
      const result = await sportEquipmentCollection.find(query).toArray();
      res.send(result);
    });

    app.delete("/products/email/:email/:id", async (req, res) => {
      const email = req.params.email;
      const id = req.params.id;
      const query = { _id: new ObjectId(id), user_email: email };
      const result = await sportEquipmentCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/products/email/:email/:id", async (req, res) => {
      const email = req.params.email;
      const id = req.params.id;
      const query = { _id: new ObjectId(id), user_email: email };
      const result = await sportEquipmentCollection.findOne(query);
      res.send(result);
    });

    app.put("/products/email/:email/:id", async (req, res) => {
      const email = req.params.email;
      const id = req.params.id;
      const query = { _id: new ObjectId(id), user_email: email };
      const options = { upsert: true };
      const product = req.body;
      const updatedProduct = {
        $set: {
          photo: product.photo,
          item_name: product.item_name,
          category: product.category,
          price: product.price,
          customization: product.customization,
          processing_time: product.processing_time,
          stock_status: product.stock_status,
          rating: product.rating,
          user_email: product.user_email,
          user_name: product.user_name,
          description: product.description,
        },
      };
      const result = await sportEquipmentCollection.updateOne(
        query,
        updatedProduct,
        options
      );
      res.send(result);
    });

    app.get("/products", async (req, res) => {
      const result = await sportEquipmentCollection
        .find()
        .sort({ price: 1 })
        .toArray();
      res.send(result);
    });

    app.get("/products-limited", async (req, res) => {
      const result = await sportEquipmentCollection.find().limit(6).toArray();
      res.send(result);
    });

    // Auth related apis
    app.post("/jwt", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: false,
        })
        .send({ success: true });
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
