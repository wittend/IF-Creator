import type { FunctionDef, ParsedInterface, ProjectOptions } from "../types.ts";

export function generateOpenApiSpec(parsed: ParsedInterface, options?: ProjectOptions): string {
  const title = parsed.name ? `${parsed.name} Gateway API` : "High-Level Gateway API";
  const prefix = options?.apiPrefix || "/api/v1";

  const paths: Record<string, any> = {};
  const schemas: Record<string, any> = {};

  for (const fn of parsed.functions) {
    const route = `${prefix}/${fn.name}`;
    const reqSchemaName = `${capitalize(fn.name)}Request`;
    const resSchemaName = `${capitalize(fn.name)}Response`;

    // Build Request Schema
    const properties: Record<string, any> = {};
    const required: string[] = [];

    for (const p of fn.parameters) {
      properties[p.name] = mapTypeToOpenApi(p.type);
      if (p.doc) properties[p.name].description = p.doc;
      if (!p.isOptional) {
        required.push(p.name);
      }
    }

    schemas[reqSchemaName] = {
      type: "object",
      properties,
      required: required.length > 0 ? required : undefined,
    };

    // Build Response Schema
    schemas[resSchemaName] = {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        data: fn.returnType.isVoid
          ? { type: "null" }
          : mapTypeToOpenApi(fn.returnType.type),
        error: { type: "string", nullable: true },
      },
      required: ["success"],
    };

    paths[route] = {
      post: {
        summary: fn.doc || `Execute ${fn.name}`,
        description: `High-level REST endpoint wrapping native/core function '${fn.name}'.`,
        operationId: fn.name,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: `#/components/schemas/${reqSchemaName}`,
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Successful operation",
            content: {
              "application/json": {
                schema: {
                  $ref: `#/components/schemas/${resSchemaName}`,
                },
              },
            },
          },
          "400": {
            description: "Invalid input parameters",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ApiError",
                },
              },
            },
          },
          "500": {
            description: "Internal execution failure",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ApiError",
                },
              },
            },
          },
        },
      },
    };
  }

  schemas["ApiError"] = {
    type: "object",
    properties: {
      success: { type: "boolean", example: false },
      error: { type: "string", example: "Error message details" },
      code: { type: "string", example: "INVALID_ARGUMENT" },
    },
    required: ["success", "error"],
  };

  const openApiDoc = {
    openapi: "3.1.0",
    info: {
      title,
      version: "1.0.0",
      description: `Auto-generated OpenAPI 3.1 specification for ${parsed.name} multi-tier interface.`,
    },
    servers: [
      {
        url: `http://localhost:${options?.restPort || 8000}`,
        description: "Local Gateway Server",
      },
    ],
    paths,
    components: {
      schemas,
    },
  };

  return JSON.stringify(openApiDoc, null, 2);
}

function mapTypeToOpenApi(normalized: string): Record<string, any> {
  switch (normalized) {
    case "integer":
      return { type: "integer" };
    case "number":
      return { type: "number" };
    case "string":
      return { type: "string" };
    case "boolean":
      return { type: "boolean" };
    case "array":
      return { type: "array", items: { type: "string" } };
    case "object":
      return { type: "object", additionalProperties: true };
    case "void":
      return { type: "null" };
    default:
      return { type: "string", description: `Custom type: ${normalized}` };
  }
}

function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}
