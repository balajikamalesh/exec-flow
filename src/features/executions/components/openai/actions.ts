"use server";

import { inngest } from "@/inngest/client";
import { openaiChannel } from "@/inngest/channels/openai";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";

export type OpenAIToken = Realtime.Token<typeof openaiChannel, ["status"]>;

export async function fetchOpenAIRealtimeToken(): Promise<OpenAIToken> {
  return await getSubscriptionToken(inngest, {
    channel: openaiChannel(),
    topics: ["status"],
  });
}
