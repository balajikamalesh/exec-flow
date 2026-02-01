"use client";

import { useEffect } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const DiscordDialogSchema = z.object({
  variableName: z
    .string()
    .min(1, { message: "Variable name is required" })
    .regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, { message: "Invalid variable name" }),
  username: z.string().optional(),
  content: z
    .string()
    .min(1, "Message content is required")
    .max(2000, "Message content must be less than 2000 characters"),
  webhookUrl: z.string().min(1, "Webhook URL must be a valid URL"),
});

export type DiscordFormType = z.infer<typeof DiscordDialogSchema>;

type DiscordDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof DiscordDialogSchema>) => void;
  defaultVariableName?: string;
  defaultUsername?: string;
  defaultContent?: string;
  defaultWebhookUrl?: string;
};

export const DiscordDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultVariableName,
  defaultUsername,
  defaultContent,
  defaultWebhookUrl,
}: DiscordDialogProps) => {
  const form = useForm<z.infer<typeof DiscordDialogSchema>>({
    resolver: zodResolver(DiscordDialogSchema),
    defaultValues: {
      variableName: defaultVariableName ?? "",
      username: defaultUsername ?? "",
      content: defaultContent ?? "",
      webhookUrl: defaultWebhookUrl ?? "",
    },
  });

  const watchVariableName = form.watch("variableName") || "discord";

  const handleSubmit = (values: z.infer<typeof DiscordDialogSchema>) => {
    onSubmit(values);
    onOpenChange(false);
  };

  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultVariableName ?? "",
        username: defaultUsername ?? "",
        content: defaultContent ?? "",
        webhookUrl: defaultWebhookUrl ?? "",
      });
    }
  }, [
    open,
    defaultVariableName,
    defaultUsername,
    defaultContent,
    defaultWebhookUrl,
    form,
  ]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Discord Configuration</DialogTitle>
          <DialogDescription>
            Configure the Discord webhook settings for this node.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="variableName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variable Name</FormLabel>
                  <Input {...field} placeholder="myDiscord" />
                  <FormDescription>
                    Use this name to reference the result in other nodes:{" "}
                    {`{{${watchVariableName}.text}}`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="webhookUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Webhook URL</FormLabel>
                  <Input
                    {...field}
                    placeholder="https://discord.com/api/webhooks/..."
                  />
                  <FormDescription>
                    Get this from Discord: Channel Settings &gt; Integrations
                    &gt; Webhooks
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message Content</FormLabel>
                  <Textarea
                    {...field}
                    placeholder="Summary: {{aiResponse}}"
                    className="min-h-12 font-mono text-sm"
                  />
                  <FormDescription>
                    The message content to send to the Discord channel. Use{" "}
                    {"{{variables}}"} or simple values and{" "}
                    {"{{json variables}}"} for objects.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bot Username (Optional)</FormLabel>
                  <Input {...field} placeholder="Workflow Bot" />
                  <FormDescription>
                    Override the webhook's default username.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save settings</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
