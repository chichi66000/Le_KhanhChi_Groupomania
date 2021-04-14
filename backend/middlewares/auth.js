const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, "RANDOM_TOKEN_SECRET", (err, user) => {
      console.log(err)

      if (err) return res.sendStatus(403)

      req.user = user

      next()
    });
    // const userId = decodedToken.userId;
    // if (req.body.userId && req.body.userId !== userId) {
    //   return res.status(401).json("Invalid user ID") ;
    // } else {
    //   next();
    // }
  } catch {
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};
