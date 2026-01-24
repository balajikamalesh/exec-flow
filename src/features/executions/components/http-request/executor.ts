import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";
import Handlebars from "handlebars";
import { httpRequestChannel } from "@/inngest/channels/http-request";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  return safeString;
});

type HttpRequestData = {
  variableName: string;
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  nodeId,
  context,
  step,
  data,
  publish,
}) => {
  await publish(
    httpRequestChannel().status({
      nodeId,
      status: "loading",
    }),
  );

  if (!data.url || !data.method || !data.variableName) {
    await publish(
      httpRequestChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError(
      "HTTP Request node is missing required configuration.",
    );
  }

  try {
    const result = await step.run("http_request", async () => {
      const method = data.method;
      const url = Handlebars.compile(data.url)(context);
      const body = data.body;

      const options: KyOptions = {
        method,
        throwHttpErrors: false,
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (body && ["POST", "PUT", "PATCH"].includes(method)) {
        const resolved = Handlebars.compile(body)(context);
        JSON.parse(resolved); // Validate JSON
        options.body = resolved;
        options.headers = {
          ...options.headers,
          "Content-Type": "application/json",
        };
      }

      const response = await ky(url, options);
      const contentType = response.headers.get("content-type");
      const responseBody = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

      const responsePayload = {
        httpResponse: {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          data: responseBody,
        },
      };

      return {
        ...context,
        [data.variableName]: responsePayload, // Store chained response under their variable name
      };
    });

    await publish(
      httpRequestChannel().status({
        nodeId,
        status: "success",
      }),
    );
    return result;
  } catch (error) {
    await publish(
      httpRequestChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw error;
  }
};
