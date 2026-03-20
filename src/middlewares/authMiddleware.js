function requireAdmin(req, _res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const expectedToken = process.env.ADMIN_TOKEN || "pos-porto-admin-token";

  if (!token || token !== expectedToken) {
    const error = new Error("Akses admin dibutuhkan");
    error.statusCode = 401;
    return next(error);
  }

  return next();
}

module.exports = {
  requireAdmin
};
