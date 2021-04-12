// module.exports = async function error  (err, req, res, next) {
//   try { 
//     await res.status;
//     if ( !res.status(201)) {
//       res.status(400).json({ message: "err"}) ;
//       console.log( "something wrong");}
//     else { next()} 
//   }
//   catch { err => console.log(err)}
//   // console.error(err.stack);
//   // res.status(500).send('Something broke!');
// }

module.exports = function error (req, res, next) {
  if (req.isAuthenticated()) {
    console.log(req.user + "blalab")
    next()
  }
  else { res.sendStatus(401) }
}