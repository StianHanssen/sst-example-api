import { Logger } from "@aws-lambda-powertools/logger";
import { injectLambdaContext } from "@aws-lambda-powertools/logger/middleware";
import { Metrics } from "@aws-lambda-powertools/metrics";
import { logMetrics } from "@aws-lambda-powertools/metrics/middleware";
import { Tracer } from "@aws-lambda-powertools/tracer";
import { captureLambdaHandler } from "@aws-lambda-powertools/tracer/middleware";
import middy from "@middy/core";

const logger = new Logger();
const tracer = new Tracer();
const metrics = new Metrics();

async function handlerLogic(event: any) {
  logger.info("Serving RapiDoc UI");

  // Get the API URL from the request
  const apiUrl = `https://${event.requestContext.domainName}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <script type="module" src="https://unpkg.com/rapidoc/dist/rapidoc-min.js"></script>
      </head>
      <body>
        <rapi-doc
          spec-url="${apiUrl}/openapi"
          theme="light"
          render-style="read"
          show-header="false"
          allow-authentication="true"
          allow-server-selection="true"
          allow-api-list-style-selection="true"
        > </rapi-doc>
      </body>
    </html>
  `;

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html",
      "Access-Control-Allow-Origin": "*",
    },
    body: html,
  };
}

export const handler = middy()
  .use(captureLambdaHandler(tracer))
  .use(injectLambdaContext(logger, { logEvent: true }))
  .use(logMetrics(metrics, { captureColdStartMetric: true }))
  .handler(handlerLogic);