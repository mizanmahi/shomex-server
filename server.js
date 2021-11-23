const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

//* Middle wires
app.use(cors());
app.use(express.json());

//@ Mongo config

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@phero-crud.9f5td.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
});

const run = async () => {
   try {
      await client.connect();
      console.log('Database connected!');

      const database = client.db('shomexDB');
      const serviceCollection = database.collection('services');
      const ordersCollection = database.collection('orders');
      const newsLetterEmailCollection = database.collection('newsletterMails');

      //* APis

      //@ GET all the services
      app.get('/services', async (req, res) => {
         const cursor = serviceCollection.find({});
         const result = await cursor.toArray();

         res.json(result);
      });

      //@ GET a single service by _id
      app.get('/service/:id', async (req, res) => {
         const { id } = req.params;
         const result = await serviceCollection.findOne({ _id: ObjectId(id) });

         // res.json(result);
         res.json(result);
      });

      //@ POST an order
      app.post('/order', async (req, res) => {
         const orderDetails = req.body;

         const result = await ordersCollection.insertOne(orderDetails);
         // res.json(result);
         res.json(result);
      });

      //@ GET all personalized orders
      app.get('/myOrders/:userEmail', async (req, res) => {
         const { userEmail } = req.params;

         const cursor = ordersCollection.find({ userEmail: userEmail });
         const result = await cursor.toArray();

         res.json(result);
      });

      //@ GET all orders
      app.get('/allOrders', async (req, res) => {
         const cursor = ordersCollection.find({});
         const result = await cursor.toArray();

         res.json(result);
      });

      //@ POST a single service
      app.post('/addService', async (req, res) => {
         const newService = req.body;
         const result = await serviceCollection.insertOne(newService);

         res.json(result);
      });

      //@ PUT: Update a single service pending status
      app.put('/approve/:id', async (req, res) => {
         const { id } = req.params;
         const result = await ordersCollection.updateOne(
            { _id: ObjectId(id) },
            { $set: { orderStatus: 'approved' } },
            { upsert: true }
         );
         res.json(result);
      });

      //@ DELETE an order
      app.delete('/deleteOrder/:id', async (req, res) => {
         const { id } = req.params;
         const result = await ordersCollection.deleteOne({ _id: ObjectId(id) });

         res.json(result);
      });

      //@ POST:  Save a newsletter subscriber mail
      app.post('/newsletter', async (req, res) => {
         const emailInfo = req.body;
         const result = await newsLetterEmailCollection.insertOne(emailInfo);

         res.json(result);
      });


   } catch (error) {
      console.log(error.message);
   } finally {
      // await client.close()
   }
};

run().catch(console.dir);

app.get('/', (req, res) => {
   res.send('<h1>Shomex server is up and running!</h1>');
});

app.listen(PORT, () => {
   console.log(`Shomex server is running on port ${PORT}`);
});

