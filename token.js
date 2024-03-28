const jwt = require("jsonwebtoken");

const ACTIVATION_SECRET = "ASIUDOASNDUH(*@HQIENDQ";

const createJwtToken = (user) => {
  const token = jwt.sign({ user }, ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
  return token;
};

module.exports = createJwtToken;
