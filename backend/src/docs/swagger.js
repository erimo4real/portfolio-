import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Portfolio API",
      version: "1.0.0",
      description: "API documentation for the portfolio backend"
    },
    servers: [{ url: "/api" }],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "auth_token"
        }
      }
    }
  },
  apis: ["./src/modules/**/*.js"]
};

export const swaggerSpec = swaggerJsdoc(options);
