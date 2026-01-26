"use server";

import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";
import { stripeTriggerChannel } from "@/inngest/channels/stripe-trigger";

export type StripeTriggerToken = Realtime.Token<
  typeof stripeTriggerChannel,
  ["status"]
>;

export async function fetchStripeTriggerRealtimeToken(): Promise<StripeTriggerToken> {
  return await getSubscriptionToken(inngest, {
    channel: stripeTriggerChannel(),
    topics: ["status"],
  });
}
