const authService = require("../services/authService");

async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    const result = authService.login(username, password);

    res.json({
      message: "Login berhasil",
      data: result
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  login
};
