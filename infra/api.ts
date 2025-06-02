import * as handlers from "../packages/api/src/handlers";
import { getConfig } from "../sst.config";
import { getRawRoute } from "./utils";

const config = getConfig($app.stage);

export const apiGateway = new sst.aws.ApiGatewayV2("api", {
  link: [],
  transform: {
    api: {
      tags: config.tags,
    },
    route: {
      handler: (args) => {
        args.nodejs ??= { esbuild: { external: ["cpu-features"] } }; // To avoid error related to native modules, when bundling with esbuild
        args.tags ??= config.tags;
      },
    },
  },
});

/**
 * Adds a route to the API Gateway.
 * @param rawRoute - The raw route string
 * @param functionArgs - The function arguments
 * @returns The route configuration
 */
function addRoute(rawRoute: string, functionArgs: sst.aws.FunctionArgs) {
  const actualFunctionArgs = {
    ...functionArgs,
    permissions: functionArgs.permissions,
    environment: {
      STAGE: $app.stage,
      POWERTOOLS_DEV: $app.stage === "production" ? "false" : "true",
      ...functionArgs.environment,
    },
  };

  return apiGateway.route(rawRoute, actualFunctionArgs);
}

addRoute(getRawRoute(handlers.getOrderRoute), {
  handler: "api/src/handlers/orders/getOrder.handler",
});

addRoute(getRawRoute(handlers.postOrderRoute), {
  handler: "api/src/handlers/orders/postOrder.handler",
});

addRoute(`GET ${config.specialApiPaths.openApiSpec}`, {
  handler: "api/src/handlers/docs/getOpenApiSpec.handler",
});

addRoute(`GET ${config.specialApiPaths.openApiDocs}`, {
  handler: "api/src/handlers/docs/getOpenApiDocs.handler",
});
