"use server";

import { inngest } from "@/inngest/client";
import { slackChannel } from "@/inngest/channels/slack";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";

export type SlackToken = Realtime.Token<typeof slackChannel, ["status"]>;

export async function fetchSlackRealtimeToken(): Promise<SlackToken> {
  return await getSubscriptionToken(inngest, {
    channel: slackChannel(),
    topics: ["status"],
  });
}
