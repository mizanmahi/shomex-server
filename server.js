const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
// const ObjectId = require('mongodb').ObjectId;
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

      const result = await serviceCollection.insertOne({
         name: 'Shomex',
         age: 'newborn',
      });
      console.log(result.insertedId);
   } catch (error) {
      console.log(error.message);
   } finally {
      // await client.close()
   }
};

run().catch(console.dir);

app.get('/', (req, res) => {
   res.send('<h1>Hello From Shomex Server!</h1>');
});

app.listen(PORT, () => {
   console.log(`Shomex server is running on port ${PORT}`);
});
