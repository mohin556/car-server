const express = require('express')
const app = express()
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');
const { config } = require('dotenv');
const ObjectID = require('mongodb').ObjectId;
require('dotenv').config();
console.log(process.env.DB_USER)
const port = process.env.PORT || 5055
 
app.use(cors());
app.use(bodyParser.json());

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2iwiq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log(err)
  const washCollection = client.db("carwash").collection("service");
  const adminCollection =  client.db("carwash").collection("admin");
  const reviewCollection =  client.db("carwash").collection("review");
  const listCollection =  client.db("carwash").collection("alloder");

app.get('/services',(req,res)=>{
  washCollection.find()
  .toArray((err,items)=>{
    res.send(items);
    
  })
})
app.get('/oder/:id',(req,res)=>{
  washCollection.find({_id: ObjectID(req.params.id)})
  .toArray((err,oders) =>{
    console.log(oders)
    res.send(oders[0])
  })
})
// app.post('/isAdmin',(req,res)=>{
//   const email = req.body.email;

//   adminCollection.find({email: email})
//   .toArray((err,admins)=>{
//     if(admins.length === 0){
//       res.send(admins.length > 0)
   
//     }
//   })

// })

app.get('/onlyAdmin',(req,res)=>{
  // const email = req.body.email;
  adminCollection.find({email : req.query.email})
  .toArray((err,admins)=>{
    console.log(admins);
    if(admins.length === 0) {
      res.json({ isAdmin : true}).status(200);
    } else {
      res.json({isAdmin : false, message : "Permisson Denied"}).status(403)
    }
    // res.send(admins.length > 0)
  })
})




 app.post('/isAdmin',(req,res)=>{
   const email = req.body.email;
   adminCollection.find({email: email})
   .toArray((err,admins)=>{
     console.log(admins)
     res.send(admins.length > 0)
   })
 })

 app.get('/reviews',(req,res)=>{
  reviewCollection.find()
  .toArray((err,items)=>{
    res.send(items);
    
  })

})

app.delete('/delete/:id', (req,res)=>{
  console.log(req.params.id)
  washCollection.deleteOne({_id: ObjectID(req.params.id)})
  .then(result =>{
    res.send(result.deletedCount > 0)
  })
  // const id = req.params.id;
  // washCollection.deleteOne({_id: ObjectID(id)})
  // .then(result =>{
  //   console.log(result.deletedCount);
  // })

})



 app.post('/addReviews', (req,res)=>{
  const reviews = req.body;
  // console.log('adding perfect',reviews)
  reviewCollection.insertOne(reviews)  
  .then (result =>{
    console.log(result.insertedCount)
    res.send(result.insertedCount>0)
    res.redirect('/')
   
  })
  
})




app.post('/addAdmin', (req,res)=>{
  const newAdmin = req.body;

  console.log('adding perfect',newAdmin)
  adminCollection.insertOne(newAdmin)  
  .then (result =>{
    console.log(result.insertedCount)
    res.send(result.insertedCount>0)
  })
  
})

app.post('/oderList', (req,res)=>{
  const list = req.body;

  console.log('adding perfect',list)
  listCollection.insertOne(list)  
  .then (result =>{
    
    res.send(result.insertedCount>0)
  })
  
})

app.get('/odersList',(req,res)=>{
  listCollection.find()
  .toArray((err,items)=>{
    res.send(items);
    
  })

})


 app.post('/addEvent', (req,res)=>{
   const newEvent = req.body;

   console.log('adding perfect',newEvent)
   washCollection.insertOne(newEvent)  
   .then (result =>{
     console.log(result.insertedCount)
     res.send(result.insertedCount>0)
   })
   
 })
//   client.close();
});





app.listen(process.env.PORT || port)
