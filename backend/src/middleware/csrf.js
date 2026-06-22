const allowedOrigins = () => [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:5174"
].filter(Boolean).map(o => o.replace(/\/$/, ''));

export function csrfProtection(req, res, next) {
  const unsafeMethods = ["POST", "PUT", "DELETE", "PATCH"];
  if (!unsafeMethods.includes(req.method)) return next();
  if (req.headers["x-requested-with"] === "XMLHttpRequest") return next();
  const origin = req.headers["origin"];
  const hosts = allowedOrigins();
  if (origin && hosts.includes(origin)) return next();
  res.status(403).json({ error: "CSRF validation failed" });
}
