import { ZodError } from "zod";

export function validate(schema, pick = "body") {
  return (req, res, next) => {
    try {
      const data = pick === "query" ? req.query : pick === "params" ? req.params : req.body;
      const parsed = schema.parse(data);
      if (pick === "query") req.query = parsed;
      else if (pick === "params") req.params = parsed;
      else req.body = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ error: "Validation error", details: err.flatten() });
      }
      next(err);
    }
  };
}
