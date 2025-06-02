import { Logger } from '@aws-lambda-powertools/logger';
import { parser } from '@aws-lambda-powertools/parser/middleware';
import { injectLambdaContext } from '@aws-lambda-powertools/logger/middleware';
import { Metrics } from '@aws-lambda-powertools/metrics';
import { logMetrics } from '@aws-lambda-powertools/metrics/middleware';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { captureLambdaHandler } from '@aws-lambda-powertools/tracer/middleware';
import middy from '@middy/core';
import { RouteConfig } from "@asteasolutions/zod-to-openapi";

import {
  postOrderSchema,
  postOrderResponseSchema,
  postOrderEventSchema,
  type PostOrderEvent,
  type PostOrderResponse,
  postOrderResponseContentSchema,
} from '../../schemas/orderSchemas';

const logger = new Logger();
const tracer = new Tracer();
const metrics = new Metrics();

export const postOrderRoute: RouteConfig = {
  method: 'post',
  path: '/order',
  summary: 'Create a new order',
  request: {
    body: {
      content: {
        'application/json': {
          schema: postOrderSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Order created successfully',
      content: {
        'application/json': {
          schema: postOrderResponseContentSchema,
        },
      },
    },
  },
}

async function handlerLogic(event: PostOrderEvent): Promise<PostOrderResponse> {
  for (const item of event.body.items) {
    // item is parsed as OrderItem
    logger.info('Processing item', { item });
  }

  return postOrderResponseSchema.parse({
    statusCode: 200,
    body: {
      orderId: event.body.id,
      message: "Order created successfully"
    }
  });
}

export const handler = middy()
  .use(captureLambdaHandler(tracer))
  .use(injectLambdaContext(logger, { logEvent: true }))
  .use(logMetrics(metrics, { captureColdStartMetric: true }))
  .use(parser({ schema: postOrderEventSchema }))
  .handler(handlerLogic);
