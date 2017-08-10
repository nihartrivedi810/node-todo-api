const express = require('express');
const bodyParser = require('body-parser');
const {
  ObjectID
} = require('mongodb');

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

app.get('/todos', (req, res) => {
  Todo.find().then(
    (todos) => {
      res.send({
        todos,
      });
    },
    (e) => {
      res
        .status(400)
        .send(e);
    }
  )
});

app.get('/todos/:id', (req, res) => {
  const {
    id
  } = req.params;
  if (!ObjectID.isValid(id)) {
    res
      .status(404)
      .send();
  }
  Todo.findById(req.params.id).then(
    (todo) => {
      if (!todo) {
        return (res
          .status(404)
          .send());
      }
      res.send({
        todo,
      });
    },
    (e) => {
      res
        .status(400)
        .send();
    }
  )
});

app.delete('/todos/:id', (req, res) => {
  const {
    id
  } = req.params;
  if (!ObjectID.isValid(id)) {
    res
      .status(404)
      .send();
  }
  Todo.findByIdAndRemove(req.params.id).then(
    (todo) => {
      res.send({
        todo,
      });
    },
    (e) => {
      res
        .status(404)
        .send();
    }
  )
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
