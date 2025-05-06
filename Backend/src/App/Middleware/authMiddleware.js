const JWT = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    //Get Token
    const token = req.headers["authorization"].split(" ")[1];
    // console.log(token);

    //Verify Token
    JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).send({
          success: false,
          message: "Token is not valid | Un-Authorized User",
          err,
        });
      } else {
        req.body.id = decoded.id;
        next();
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to authenticate token",
      error,
    });
  }
};
