const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const cors = require('cors')

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


      //booking data getting 
      app.get('/bookings', async(req, res) =>{
        const cursor = bookingCollections.find({})
        const booking = await cursor.toArray()
        res.send(booking)
      })



      // //order get
      // app.get('/orders', async(req, res) =>{
      //   const cursor = ordersCollections.find({})
      //   const orders = await cursor.toArray()
      //   res.send(orders)
      // })



      // cancle order
      app.delete('/bookings/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: (id)};
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
  res.send('node server site run')
})

app.listen(port, ()=>{
  console.log('port is running on server', port);
})





// // other code 

// const express = require('express');
// const { MongoClient } = require('mongodb');
// const ObjectId = require('mongodb').ObjectId;
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// const port = process.env.PORT || 5000;

// // middleware
// app.use(cors());
// app.use(express.json());

// const uri = mongodb+srv://${ process.env.DB_USER }:${ process.env.DB_PASS }@cluster0.417rb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// async function run() {

//     try {
//         await client.connect();
//         const database = client.db("easy_travelling");
//         const servicesCollection = database.collection("services");
//         const ordersCollections = database.collection("orders");


//         // GET API
//         app.get('/services', async (req, res) => {
//             const cursor = servicesCollection.find({});
//             const services = await cursor.toArray();
//             res.send(services);
//         });

//           //POST API
//           app.post('/orders', async (req, res) => {
//             const orders = req.body;
//             const result = await ordersCollections.insertOne(orders);
//             res.json(result)
//         });


//         //order get
//         app.get('/orders', async (req, res) => {
//             const cursor = ordersCollections.find({})
//             const orders = await cursor.toArray()
//             res.send(orders)
//         })

       

//         // // GET SINGLE SERVICE
//         // app.get('/services/:id', async (req, res) => {
//         //     const id = req.params.id;

//         //     const query = { _id: ObjectId(id) };
//         //     const service = await servicesCollection.findOne(query);
//         //     res.json(service);
//         // })

       
//         // load single service get api
//         // app.delete('/services/:id', async (req, res) => {
//         //     const id = req.params.id;
//         //     const query = { _id: ObjectId(id) };
//         //     const result = await servicesCollection.deleteOne(query);
//         //     res.json(result);
//         // })

//           // delete service
//           app.delete('/services/:id', async (req, res) => {
//             const id = req.params.id;
//             // const query = { _id: ObjectId(id) };
//             const query = { _id: (id) };
//             const result = await ordersCollections.deleteOne(query);
//             res.json(result);
//         })

//     }
//     finally {
//         // await client.close();
//     }

// }
// run().catch(console.dir);

// app.get('/', (req, res) => {
//     res.send('Easy Travelling');
// });
// app.listen(port, () => {
//     console.log('server running at port', port);
// });