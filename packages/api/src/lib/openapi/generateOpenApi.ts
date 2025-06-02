import { OpenApiGeneratorV3, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

import * as handlers from "../../handlers";

/**
 * Generates an OpenAPI document from the given routes.
 * @returns The OpenAPI document
 */
export function generateOpenAPI(): any {
  const registry = new OpenAPIRegistry()

  for (const routeConfig of Object.values(handlers)) {
    registry.registerPath(routeConfig);
  }

  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "SST API Demo",
      description: "This is a demo showing how to deploy an SST API with OpenAPI support",
    },
  });
}