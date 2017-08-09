const {MongoClient, ObjectID} = require('mongodb');

let obj = new ObjectID();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
  if(error){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').insertOne({
  //   text: 'Hahaha',
  //   completed: false,
  // }, (err, result) => {
  //   if(err){
  //     return console.log('Cannot add data to db', err);
  //   }
  //   console.log(JSON.stringify(result.ops));
  // });
  db.collection('Users').insertOne({
    name: 'Nihar',
    age: 22,
    location: 'India',
  }, (err, result) => {
    if(err){
      return console.log('Cannot add data to db', err);
    }
    console.log(JSON.stringify(result.ops));
  });

  db.close()
});
