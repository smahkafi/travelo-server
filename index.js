const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;

// config dotenv
require('dotenv').config()

//port
const port = process.env.PORT || 5001

// middleware 
app.use(cors());
app.use(express.json())

// uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2rrk7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
      await client.connect();
      const database = client.db("travelo");
      const toursCollections = database.collection("tours");
      const bookingCollections = database.collection("bookings")

      // get api
      app.get('/tours', async(req, res) => {
        const cursor = toursCollections.find({});
        const tours = await cursor.toArray();
        res.send(tours)
      })

      // add booking api
      app.post('/bookings', async(req, res) => {
        const booking = req.body
        const result = await bookingCollections.insertOne(booking)
        console.log(result)
        res.send(result)
      })

      //getting booking data api
      app.get('/bookings', async(req, res) =>{
        const cursor = bookingCollections.find({})
        const booking = await cursor.toArray()
        res.send(booking)
      })

      // getting email api
      app.get('/bookings/:email', async (req, res) => {
        const email = req.params.email;
        const result = await bookingCollections.find({email}).toArray();
        res.json(result)
        
      })

       // Add New Vacation API
       app.post('/tours', async (req, res) => {
        console.log(req.body);
        const result = await toursCollections.insertOne(req.body);
        res.send(result);
    })


    app.put('/bookings/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const confirmationOrder = {
          $set: {
              status: 'Confirm'
          }
      }
      const result = await bookingCollections.updateOne(query, confirmationOrder)
      res.json(result)
    })


      // cancle order
      app.delete('/bookings/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await bookingCollections.deleteOne(query);
        res.send(result)
      }) 

    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

//root
app.get('/', (req, res)=>{
  res.send('Running Travel O Server')
})

app.listen(port, ()=>{
  console.log('Running Travel O Server on port', port);
})