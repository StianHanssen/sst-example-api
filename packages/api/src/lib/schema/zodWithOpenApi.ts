import { z } from 'zod';
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

// Extend Zod with OpenAPI functionality
extendZodWithOpenApi(z);

export { z };
