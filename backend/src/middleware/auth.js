import jwt from "jsonwebtoken";

export function requireAdmin(req, res, next) {
  // Try to get token from cookie first, then fall back to Authorization header
  let token = req.cookies?.auth_token;
  
  if (!token) {
    const header = req.headers.authorization || "";
    token = header.startsWith("Bearer ") ? header.slice(7) : null;
  }
  
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  
  try {
    const secret = process.env.JWT_SECRET || "dev-secret";
    const payload = jwt.verify(token, secret);
    if (payload.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    req.adminId = payload.sub;
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
}
