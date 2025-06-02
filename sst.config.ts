/// <reference path="./.sst/platform/config.d.ts" />

export function getConfig(stage: string) {
  return {
    tags: {
      "org:architecture": "Examples",
      "org:repository": "sst-example-api",
      "org:release-version": "None",
      "org:environment": stage,
    },
    specialApiPaths: {
      openApiSpec: "/openapi",
      openApiDocs: "/docs",
    }
  }
}

export default $config({
  app(input) {
    return {
      name: "sst-example-api",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: { region: "ap-northeast-1" }
      }
    };
  },
  async run() {
    const config = getConfig($app.stage);
    const api = await import("./infra/api");

    return {
      openApiSpec: $interpolate`${api.apiGateway.url}${config.specialApiPaths.openApiSpec}`,
      docs: $interpolate`${api.apiGateway.url}${config.specialApiPaths.openApiDocs}`,
    };
  },
});
