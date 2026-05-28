const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "gearguard-dev-secret-key";

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const bearerToken = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!bearerToken) {
    const fallbackUserId = req.headers["x-user-id"];
    if (fallbackUserId) {
      req.user = {
        id: fallbackUserId,
        companyId: req.headers["x-company-id"] || null,
        role: req.headers["x-user-role"] || "user",
        legacy: true,
      };
      return next();
    }

    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const payload = jwt.verify(bearerToken, JWT_SECRET);
    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role || "user",
      companyId: payload.companyId || payload.company || null,
    };
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticate;
