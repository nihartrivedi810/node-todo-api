const {
  User
} = require('../models/user');

const authenticate = (req, res, next) => {
  var token = req.header('x-auth');

  User.findByToken(token)
    .then(user => {
      if (!user) {
        throw new Error;
      }

      req.user = user;
      req.tokem = token;

      return res.send(user);
    })
    .catch((e) => {
      res
        .status(401)
        .send();
    });
}

module.exports = {
  authenticate
};
