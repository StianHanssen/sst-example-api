import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { Logger } from "@aws-lambda-powertools/logger";
import { injectLambdaContext } from "@aws-lambda-powertools/logger/middleware";
import { Metrics } from "@aws-lambda-powertools/metrics";
import { logMetrics } from "@aws-lambda-powertools/metrics/middleware";
import { parser } from "@aws-lambda-powertools/parser/middleware";
import { Tracer } from "@aws-lambda-powertools/tracer";
import { captureLambdaHandler } from "@aws-lambda-powertools/tracer/middleware";
import middy from "@middy/core";

import {
  type GetOrderEvent,
  getOrderEventSchema,
  type GetOrderResponse,
  getOrderResponseContentSchema,
  getOrderResponseSchema,
  getOrderSchema,
} from "../../schemas/orderSchemas";

const logger = new Logger();
const tracer = new Tracer();
const metrics = new Metrics();

export const getOrderRoute: RouteConfig = {
  method: "get",
  path: "/orders/{id}",
  summary: "Get an existing order",
  request: {
    params: getOrderSchema,
  },
  responses: {
    200: {
      description: "Order retrieved successfully",
      content: {
        "application/json": {
          schema: getOrderResponseContentSchema,
        },
      },
    },
  },
}

async function handlerLogic(event: GetOrderEvent): Promise<GetOrderResponse> {
  const orderId = event.pathParameters.id;
  logger.info("Retrieving order", { orderId });

  return getOrderResponseSchema.parse({
    statusCode: 200,
    body: {
      orderId,
      message: "Order retrieved successfully"
    }
  });
}

export const handler = middy()
  .use(captureLambdaHandler(tracer))
  .use(injectLambdaContext(logger, { logEvent: true }))
  .use(logMetrics(metrics, { captureColdStartMetric: true }))
  .use(parser({ schema: getOrderEventSchema }))
  .handler(handlerLogic);
