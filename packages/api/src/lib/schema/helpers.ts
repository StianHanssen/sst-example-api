import { z } from './zodWithOpenApi';

/**
 * Creates a schema that preprocesses JSON string bodies before validation.
 * @param schema The Zod schema to validate the parsed body against
 * @returns A Zod schema that handles JSON string preprocessing
 */
export function jsonBodySchema<T extends z.ZodType>(schema: T) {
  return z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        try {
          return JSON.parse(val);
        } catch (e) {
          return val;
        }
      }
      return val;
    },
    schema
  );
}

export const baseResponseSchema = z.object({
  headers: z.record(z.string()).default({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': '*',
  }),
  statusCode: z.number(),
  body: z.string(),
});
