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

const SlackDialogSchema = z.object({
  variableName: z
    .string()
    .min(1, { message: "Variable name is required" })
    .regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, { message: "Invalid variable name" }),
  content: z.string().min(1, "Message content is required"),
  webhookUrl: z.string().min(1, "Webhook URL must be a valid URL"),
});

export type SlackFormType = z.infer<typeof SlackDialogSchema>;

type SlackDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof SlackDialogSchema>) => void;
  defaultVariableName?: string;
  defaultContent?: string;
  defaultWebhookUrl?: string;
};

export const SlackDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultVariableName,
  defaultContent,
  defaultWebhookUrl,
}: SlackDialogProps) => {
  const form = useForm<z.infer<typeof SlackDialogSchema>>({
    resolver: zodResolver(SlackDialogSchema),
    defaultValues: {
      variableName: defaultVariableName ?? "",
      content: defaultContent ?? "",
      webhookUrl: defaultWebhookUrl ?? "",
    },
  });

  const watchVariableName = form.watch("variableName") || "slack";

  const handleSubmit = (values: z.infer<typeof SlackDialogSchema>) => {
    onSubmit(values);
    onOpenChange(false);
  };

  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultVariableName ?? "",
        content: defaultContent ?? "",
        webhookUrl: defaultWebhookUrl ?? "",
      });
    }
  }, [open, defaultVariableName, defaultContent, defaultWebhookUrl, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Slack Configuration</DialogTitle>
          <DialogDescription>
            Configure the Slack webhook settings for this node.
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
                  <Input {...field} placeholder="mySlack" />
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
                    placeholder="https://hooks.slack.com/services/..."
                  />
                  <FormDescription>
                    Get this from Slack: Workspace Settings &gt; Workflows &gt;
                    Webhooks
                  </FormDescription>
                  <FormDescription>
                    Make sure the "key" is "content" in the workflow settings.
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
                    The message content to send to the Slack channel. Use{" "}
                    {"{{variables}}"} or simple values and{" "}
                    {"{{json variables}}"} for objects.
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
