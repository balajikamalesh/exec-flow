import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";

type HttpRequestData = {
  url?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  nodeId,
  context,
  step,
  data,
}) => {
  debugger;
  if (!data?.url || !data?.method) {
    throw new NonRetriableError(
      "HTTP Request node is missing required configuration.",
    );
  }

  const result = await step.run("http_request", async () => {
    const method = data?.method || "GET";
    const url = data.url!;
    const body = data.body;

    const options: KyOptions = {
      method,
      throwHttpErrors: false,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (body && ["POST", "PUT", "PATCH"].includes(method) && data.body) {
      options.body = body;
    }

    const response = await ky(url, options);
    const contentType = response.headers.get("content-type")
    const responseBody = contentType?.includes("application/json") ? 
            await response.json() : await response.text();
            
    return {
      ...context,
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: responseBody,
      },
    };
  });

  // TODO: Publish success state for HTTP request
  return result;
};
