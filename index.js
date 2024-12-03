const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 2500

app.use(cors())
app.use(express.json())

app.get('/', (req, res)=>{
    res.send('Sports Equipment server is running...')
})

app.listen(port, ()=>{
    console.log(`Server is running on ${port}`)
})