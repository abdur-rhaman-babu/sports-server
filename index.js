require('dotenv').config()
const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')
const app = express()
const port = process.env.PORT || 2500

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6avkk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
    try {
      
    } catch (error) {
        console.log(error)
    }
}
run().catch(console.dir);



app.get('/', (req, res)=>{
    res.send('Sports Equipment server is running...')
})

app.listen(port, ()=>{
    console.log(`Server is running on ${port}`)
})