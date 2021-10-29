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

      //* APis

      //@ GET all the services
      app.get('/services', async (req,res) => {
         const cursor = serviceCollection.find({});
         const result = await cursor.toArray();

         res.json(result);
      })

      //@ GET a single service by _id
      app.get('/service/:id', async (req,res) => {
         const { id } = req.params;
         console.log(id);
         const result = await serviceCollection.findOne({_id: ObjectId(id)});

         // res.json(result);
         res.json(result)
      })



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


//  ----------------------------------------------------------------
/* 

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
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_USER_PASS}@phero-crud.9f5td.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
});

const run = async () => {
   try {
      await client.connect();
      console.log('connected to mongo!');

      const database = client.db('emaProducts');
      const productsCollection = database.collection('products');
      const ordersCollection = database.collection('orders');

      //@ API Routes

      //* GET all products
      app.get('/products', async (req, res) => {
         const cursor = productsCollection.find({});
         const productCount = await cursor.count();

         const { page, size } = req.query;
         const sizeNumber = parseInt(size);
         let products;
         if (page && sizeNumber) {
            products = await cursor
               .skip(page * size)
               .limit(sizeNumber)
               .toArray();
         } else {
            products = await cursor.toArray();
         }
         res.json({ products, productCount });
      });

      //* POST Get all cart's products
      app.post('/cartProducts', async (req, res) => {
         const cursor = productsCollection.find({
            key: { $in: req.body },
         });

         const result = await cursor.toArray();

         res.json(result);
      });

      //* POST Save orders
      app.post('/order', async (req, res) => {
         const result = await ordersCollection.insertOne(req.body)
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
   res.send('<h1>Hello from the Ema John server!</h1>');
});

app.listen(PORT, () => {
   console.log(`Car app server is running on port ${PORT}`);
});


*/