const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
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
const {
  authenticate
} = require('./middleware/authenticate');

const app = express();

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
  const todo = new Todo({
    text: req.body.text,
    _creator: req.user._id,
  })

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res
      .status(400)
      .send(e);
  })
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id,
  }).then(
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

app.get('/todos/:id', authenticate, (req, res) => {
  const {
    id
  } = req.params;
  if (!ObjectID.isValid(id)) {
    res
      .status(404)
      .send();
  }
  Todo.findOne({
    _id: id,
    _creator: req.user._id,
  }).then(
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

app.delete('/todos/:id', authenticate, (req, res) => {
  const {
    id
  } = req.params;
  if (!ObjectID.isValid(id)) {
    res
      .status(404)
      .send();
  }
  Todo.findByOneAndRemove({
    _id: id,
    _creator: req.user._id,
  }).then(
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
        .status(404)
        .send();
    }
  )
});

app.patch('/todos/:id', authenticate, (req, res) => {
  const {
    id
  } = req.params;

  const body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    res
      .status(404)
      .send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByOneAndUpdate({
    _id: id,
    _creator: req.user._id,
  }, {
    $set: body
  }, {
    new: true
  }).then(
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
        .status(404)
        .send();
    }
  )
});


app.post('/users', (req, res) => {
  const {
    body
  } = req;
  const user = new User({
    email: body.email,
    password: body.password,
  })
  user.save()
    .then((doc) => {
      return user.generateAuthToken();
    })
    .then((token) => {
      res.header('x-auth', token).send(user);
    })
    .catch((e) => {
      res
        .status(400)
        .send(e);
    })
});

app.post('/users/login', (req, res) => {
  const {
    body
  } = req;

  User.findByCredentials(body.email, body.password)
    .then(user => {
      user.generateAuthToken().then((token) => {
        res.header('x-auth', token).send(user);
      })
    }).catch(err => {
      res.status(400).send(err);
    });
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

app.listen(3001, () => {
  console.log('Started listening on port 3001');
});
