const { verifyToken } = require("../utils/token");

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Autenticación requerida" });
  }

  const user = verifyToken(token);
  if (!user) {
    return res.status(401).json({ message: "Sesión inválida o expirada" });
  }

  req.user = user;
  next();
}

module.exports = { requireAuth };
