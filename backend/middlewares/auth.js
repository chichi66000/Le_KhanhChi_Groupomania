const jwt = require('jsonwebtoken');

module.exports =async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    await jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
      console.log(err)

      if (err) return res.sendStatus(401)

      req.user = user

      next()
    })
  } catch {
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};
