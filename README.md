# SST API Example

This repository demonstrates a modern API implementation using SST (Serverless Stack) on AWS. It showcases (in my opinion) a clean appraoch to building type-safe APIs with OpenAPI integration.

## Features

- API Gateway with Lambda functions for each endpoint
- OpenAPI specification generation and integration
- Interactive API documentation using RapiDoc
- Type-safe API validation using Zod
- Monorepo structure for future extensibility

## Requirements

- AWS Account with appropriate credentials
- [SST CLI](https://docs.sst.dev/installation)
- [pnpm](https://pnpm.io/installation)
- Node.js (LTS version recommended)

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/StianHanssen/sst-example-api
   cd sst-example-api
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the development environment:

   ```bash
   sst dev
   ```

4. Deploy to AWS:

   ```bash
   sst deploy --stage <stage>
   ```

## Project Structure

- `infra/` - SST infrastructure definitions
- `packages/` - Monorepo packages
  - `api/` - API implementation with OpenAPI and Zod integration
  - `core/` - Shared code and utilities

## API Documentation

Once deployed, SST will output a few URLs in the terminal, you can access:

- OpenAPI specification at `/openapi`
- Interactive API documentation at `/docs`

## Development

This project uses a monorepo structure, allowing for future expansion beyond just the API. The current implementation focuses on the API layer, but the structure supports adding additional services and shared code. The package `core` does nothing, and is just used to show an example of a central location for shared objects in the monorepo.
