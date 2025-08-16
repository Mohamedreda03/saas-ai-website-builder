"use client";

import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PROJECT_TEMPLATES } from "../../constants";

const formSchmea = z.object({
  value: z.string().min(1, "value is required").max(10000, "value is too long"),
});

type FormSchemaType = z.infer<typeof formSchmea>;

export default function ProjectForm() {
  const [isFocused, setIsFocused] = useState(false);

  const router = useRouter();

  const queryClient = useQueryClient();

  const trpc = useTRPC();
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchmea),
    defaultValues: {
      value: "",
    },
  });

  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess(data) {
        form.reset();
        queryClient.invalidateQueries(trpc.projects.getMany.queryOptions());

        router.push(`/projects/${data.id}`);
        // TODO: revalidate usage status
      },

      onError: (error) => {
        // TODO: Redirect to pricing page if specific error

        toast.error(error.message);
      },
    })
  );

  const isPending = createProject.isPending;
  const isDisabled = createProject.isPending || !form.formState.isValid;

  async function onSubmit(data: FormSchemaType) {
    await createProject.mutateAsync({
      value: data.value,
    });
  }

  const onSelectTemplate = (value: string) => {
    form.setValue("value", value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  return (
    <Form {...form}>
      <section className="space-y-6">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(
            "relative border p-4 pt-1 rounded-xl bg-sidebar transition-all",
            isFocused && "shadow-xs"
          )}
        >
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TextareaAutosize
                    {...field}
                    disabled={isPending}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    minRows={2}
                    maxRows={8}
                    className="pt-4 resize-none border-none w-full outline-none bg-transparent"
                    placeholder="What would you like to build?"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                        e.preventDefault();
                        form.handleSubmit(onSubmit)(e);
                      }
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex gap-x-2 items-end justify-between pt-2">
            <div className="text-[10px] text-muted-foreground font-mono">
              <kbd className="ml-auto inline-flex pointer-events-none h-5 select-none items-center rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span>&#8984;</span>Enter
              </kbd>
              &nbsp; to submit
            </div>
            <Button
              disabled={isDisabled}
              className={cn(
                "size-8 rounded-full transition-transform rotate-45",
                isDisabled && "bg-muted-foreground border"
              )}
            >
              {isPending ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                <ArrowUpIcon />
              )}
            </Button>
          </div>
        </form>
        <div className="flex-wrap justify-center gap-2 hidden md:flex max-w-3xl">
          {PROJECT_TEMPLATES.map((template) => (
            <Button
              key={template.title}
              variant="outline"
              size="sm"
              className="bg-white dark:bg-sidebar"
              onClick={() => onSelectTemplate(template.prompt)}
            >
              {template.emoji} {template.title}
            </Button>
          ))}
        </div>
      </section>
    </Form>
  );
}
