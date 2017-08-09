const express = require('express');
const bodyParser = require('body-parser');

const {
  mongoose
} = require('./db/mongoose');
const {
  Todo
} = require('./models/todo');
const {
  User
} = require('./models/user');

const app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  })
  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res
      .status(400)
      .send(e);
  })
});

app.listen(3001, () => {
  console.log('Started listening on port 3001');
});
// const newTodo = new Todo({
//   text: "hahhaha checking if this works"
// })
//
// newTodo.save().then((doc) => {
//   console.log(doc, 'success');
// }, (err) => {
//   console.log(err, 'error');
// })
