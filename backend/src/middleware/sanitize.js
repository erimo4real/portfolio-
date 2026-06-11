import xss from "xss";

function sanitizeValue(val) {
  if (typeof val === "string") return xss(val);
  if (Array.isArray(val)) return val.map(sanitizeValue);
  if (val && typeof val === "object") {
    const sanitized = {};
    for (const [key, value] of Object.entries(val)) {
      sanitized[key] = sanitizeValue(value);
    }
    return sanitized;
  }
  return val;
}

export function sanitizeInput(req, res, next) {
  if (req.body) req.body = sanitizeValue(req.body);
  if (req.query) req.query = sanitizeValue(req.query);
  if (req.params) req.params = sanitizeValue(req.params);
  next();
}
