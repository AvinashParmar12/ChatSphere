import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "ChatSphere API",
      version: "1.0.0",
      description:
        "REST API documentation for ChatSphere Backend",
    },

    servers: [
      {
        url: "http://localhost:5000",
        description: "Development Server",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: [
    "./src/docs/schemas/**/*.ts",
    "./src/docs/paths/**/*.ts",
  ],
};

const swaggerSpec =
  swaggerJsdoc(options);

export default swaggerSpec;