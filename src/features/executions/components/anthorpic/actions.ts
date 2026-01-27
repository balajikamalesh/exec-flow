"use server";

import { inngest } from "@/inngest/client";
import { anthropicChannel } from "@/inngest/channels/anthropic";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";

export type AnthropicToken = Realtime.Token<
  typeof anthropicChannel,
  ["status"]
>;

export async function fetchAnthropicRealtimeToken(): Promise<AnthropicToken> {
  return await getSubscriptionToken(inngest, {
    channel: anthropicChannel(),
    topics: ["status"],
  });
}
