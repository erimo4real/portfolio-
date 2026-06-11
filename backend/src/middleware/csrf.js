export function csrfProtection(req, res, next) {
  const unsafeMethods = ["POST", "PUT", "DELETE", "PATCH"];
  if (!unsafeMethods.includes(req.method)) return next();
  const requestedWith = req.headers["x-requested-with"];
  if (requestedWith === "XMLHttpRequest") return next();
  const origin = req.headers["origin"];
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.FRONTEND_URL?.replace(/\/$/, ''),
    "http://localhost:5173",
    "http://localhost:5174"
  ].filter(Boolean);
  if (origin && allowedOrigins.some(o => origin.startsWith(o))) return next();
  res.status(403).json({ error: "CSRF validation failed" });
}
