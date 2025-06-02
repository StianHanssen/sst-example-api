import { APIGatewayProxyEventV2Schema } from "@aws-lambda-powertools/parser/schemas/api-gatewayv2";

import { baseResponseSchema, jsonBodySchema } from "../lib/schema/helpers";
import { z } from "../lib/schema/zodWithOpenApi";

// ======= POST /orders =======

export const postOrderSchema = z.object({
  id: z.number().positive().openapi({
    example: 12345,
  }),
  description: z.string().openapi({
    example: "This is a description",
  }),
  items: z.array(
    z.object({
      id: z.number().positive().openapi({
        example: 1,
      }),
      quantity: z.number().openapi({
        example: 2,
      }),
      description: z.string().openapi({
        example: "Product X",
      }),
    })
  ).openapi("items"),
  optionalField: z.string().optional().openapi({
    example: "This is an optional field",
  }),
});

export const postOrderEventSchema = APIGatewayProxyEventV2Schema.extend({
  body: jsonBodySchema(postOrderSchema),
});

export type PostOrderEvent = z.infer<typeof postOrderEventSchema>;

export const postOrderResponseContentSchema = z.object({
    orderId: z.number().openapi({
      example: 12345,
    }),
    message: z.string().openapi({
      example: "Order created successfully",
    }),
});

export const postOrderResponseSchema = baseResponseSchema.extend({
  body: postOrderResponseContentSchema.transform((data) => JSON.stringify(data)),
});

export type PostOrderResponse = z.infer<typeof postOrderResponseSchema>;


// ======= GET /orders =======

export const getOrderSchema = z.object({
  id: z.coerce.number().positive().openapi({
    example: 12345,
  }),
});

export const getOrderEventSchema = APIGatewayProxyEventV2Schema.extend({
  pathParameters: getOrderSchema,
});

export type GetOrderEvent = z.infer<typeof getOrderEventSchema>;

export const getOrderResponseContentSchema = z.object({
  orderId: z.number().openapi({
    example: 12345,
  }),
  message: z.string().openapi({
    example: "Order retrieved successfully",
  }),
});

export const getOrderResponseSchema = baseResponseSchema.extend({
  body: getOrderResponseContentSchema.transform((data) => JSON.stringify(data)),
});

export type GetOrderResponse = z.infer<typeof getOrderResponseSchema>;
