const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
   res.send('Simple Node server running');
});

const users = [
   { id: 1, name: 'Ram', email: 'ram@gmail.com' },
   { id: 2, name: 'Shyam', email: 'Shyam@gmail.com' },
   { id: 3, name: 'Jodu', email: 'Jodu@gmail.com' }
]


const uri = "mongodb+srv://RajibSarker:KAg8CwAmEqGgUFnb@cluster0.yw8lqr5.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
   try {
      const userCollection = client.db('simpleNode').collection('users');
      
      // const result = await userCollection.insertOne(user);
      // console.log(result);

      app.get('/users', async (req, res) => {
         const cursor = userCollection.find({});
         const users = await cursor.toArray();
         res.send(users)
      })


      app.post('/users', async (req, res) => {
         const user = req.body;
         // user.id = users.length + 1;
         // console.log('post api called');

         const result = await userCollection.insertOne(user);
         // users.push(user)
         // console.log(user);
         console.log(result);
         user._id = result.insertedId;
         res.send(user);
      })
   } catch (error) {
      console.error(error);
   }
}

run().catch((error) => console.error(error))

app.get('/users', (req, res) => {
   // console.log(req.query);
   if (req.query.name) {
      const search = req.query.name;
      console.log(search);
      const filtered = users.filter(usr => usr.name.toLowerCase().indexOf(search) >= 0);
      res.send(filtered);

   }
   else {
      res.send(users);
   }
});

// app.post('/users', (req, res) => {
//    const user = req.body;
//    user.id = users.length + 1;
//    console.log('post api called');
//    users.push(user)
//    console.log(user);
//    res.send(user);
// })

app.listen(port, () => {
   console.log(`Server running on port ${port}`);
})