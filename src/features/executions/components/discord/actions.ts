"use server";

import { inngest } from "@/inngest/client";
import { discordChannel } from "@/inngest/channels/discord";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";

export type DiscordToken = Realtime.Token<typeof discordChannel, ["status"]>;

export async function fetchDiscordRealtimeToken(): Promise<DiscordToken> {
  return await getSubscriptionToken(inngest, {
    channel: discordChannel(),
    topics: ["status"],
  });
}
