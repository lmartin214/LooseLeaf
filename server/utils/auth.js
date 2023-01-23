const jwt = require('jsonwebtoken');

const secret =  process.env.JWT_TOKEN;
const expiration = '2h';
//This code exports an authMiddleware and signToken function to allow for authentication.
module.exports = {
  authMiddleware: function ({ req }) {
    // allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return req;
    }

    try { //authMiddleware checks the token sent with the request and verifies it
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Wrong token');
    }

    return req;
  },
  signToken: function ({ firstName, email, _id }) { //creates and signs a token
    const payload = { firstName, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};