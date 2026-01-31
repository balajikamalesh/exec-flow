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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCredentialsByType } from "@/features/credentials/hooks/use-credentials";
import { CredentialType } from "@/generated/prisma/enums";
import Image from "next/image";

const AVAILABLE_MODELS = [
  "gpt-5.2-2025-12-11",
  "gpt-5-nano",
  "gpt-5-mini",
  "o1-mini",
  "o1-pro",
];

const OpenAIDialogSchema = z.object({
  variableName: z
    .string()
    .min(1, { message: "Variable name is required" })
    .regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, { message: "Invalid variable name" }),
  credentialId: z.string().min(1, "Credential is required"),
  model: z.enum(AVAILABLE_MODELS),
  systemPrompt: z.string().optional(),
  userPrompt: z.string().min(1, { message: "User prompt is required" }),
});

export type OpenAIFormType = z.infer<typeof OpenAIDialogSchema>;

type OpenAIDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof OpenAIDialogSchema>) => void;
  defaultCredentialId?: string;
  defaultModel?: string;
  defaultVariableName?: string;
  systemPrompt?: string;
  userPrompt: string;
};

export const OpenAIDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultCredentialId,
  defaultModel,
  defaultVariableName,
  systemPrompt,
  userPrompt,
}: OpenAIDialogProps) => {
  const { data: openAICredentials, isLoading } = useCredentialsByType(
    CredentialType.OPENAI,
  );

  const form = useForm<z.infer<typeof OpenAIDialogSchema>>({
    resolver: zodResolver(OpenAIDialogSchema),
    defaultValues: {
      credentialId: defaultCredentialId ?? "",
      variableName: defaultVariableName ?? "",
      model: defaultModel ?? "gpt-5-nano",
      userPrompt: userPrompt ?? "",
      systemPrompt: systemPrompt ?? "",
    },
  });

  const watchVariableName = form.watch("variableName") || "openAI";

  const handleSubmit = (values: z.infer<typeof OpenAIDialogSchema>) => {
    onSubmit(values);
    onOpenChange(false);
  };

  useEffect(() => {
    if (open) {
      form.reset({
        credentialId: defaultCredentialId ?? "",
        variableName: defaultVariableName ?? "",
        model: defaultModel ?? "gpt-5-nano",
        userPrompt: userPrompt ?? "",
        systemPrompt: systemPrompt ?? "",
      });
    }
  }, [open, defaultModel, defaultVariableName, systemPrompt, userPrompt, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>OpenAI Configuration</DialogTitle>
          <DialogDescription>
            Configure the Ai model and prompts for this node.
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
                  <Input {...field} placeholder="myApiCall" />
                  <FormDescription>
                    Use this name to reference the result in other nodes:{" "}
                    {`{{${watchVariableName}.aiResponse}}`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {AVAILABLE_MODELS.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="credentialId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OpenAI Credential</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading || openAICredentials?.length === 0}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a credential" />
                      </SelectTrigger>
                      <SelectContent>
                        {openAICredentials?.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            <div className="flex items-center gap-2">
                              <Image
                                src="/logo/openai.svg"
                                alt="OpenAI Logo"
                                width={16}
                                height={16}
                              />
                              <span>{option.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="systemPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System Prompt (Optional)</FormLabel>
                  <Textarea
                    {...field}
                    placeholder="You are a helpful assistant."
                    className="min-h-12 font-mono text-sm"
                  />
                  <FormDescription>
                    Sets the behavior of the assistant. Use {"{{variables}}"}{" "}
                    for simple values or {"{{json variables}}"} to stringify
                    objects
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Prompt</FormLabel>
                  <Textarea
                    {...field}
                    placeholder="Summarize the following text: {{json httpResponse.data}}"
                    className="min-h-30 font-mono text-sm"
                  />
                  <FormDescription>
                    The prompt to send to the AI. Use {"{{variables}}"} for
                    simple values or {"{{json variables}}"} to stringify objects
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
