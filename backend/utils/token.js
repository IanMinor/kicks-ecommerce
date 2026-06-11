const crypto = require("crypto");

const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;

function base64UrlEncode(value) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function base64UrlDecode(value) {
  return JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
}

function getSecret() {
  return process.env.AUTH_SECRET || process.env.JWT_SECRET || "dev-only-auth-secret";
}

function sign(data) {
  return crypto.createHmac("sha256", getSecret()).update(data).digest("base64url");
}

function createToken(user) {
  const header = base64UrlEncode({ alg: "HS256", typ: "JWT" });
  const payload = base64UrlEncode({
    id_usuario: user.id_usuario,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
  });
  const signature = sign(`${header}.${payload}`);

  return `${header}.${payload}.${signature}`;
}

function verifyToken(token) {
  try {
    const [header, payload, signature] = token.split(".");

    if (!header || !payload || !signature) return null;

    const expectedSignature = sign(`${header}.${payload}`);
    if (signature.length !== expectedSignature.length) return null;

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    const decoded = base64UrlDecode(payload);
    if (!decoded.exp || decoded.exp < Math.floor(Date.now() / 1000)) return null;

    return decoded;
  } catch {
    return null;
  }
}

module.exports = { createToken, verifyToken };
