function login(username, password) {
  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const adminToken = process.env.ADMIN_TOKEN || "pos-porto-admin-token";

  if (username !== adminUsername || password !== adminPassword) {
    const error = new Error("Username atau password admin salah");
    error.statusCode = 401;
    throw error;
  }

  return {
    token: adminToken,
    admin: {
      username: adminUsername,
      role: "admin"
    }
  };
}

module.exports = {
  login
};
