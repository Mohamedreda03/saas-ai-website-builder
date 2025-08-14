"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();
  const trpc = useTRPC();
  const invoke = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (data) => {
        toast.success("Message sent successfully!");
        router.push(`/projects/${data.id}`);
      },
      onError: (error) => {
        toast.error("Failed to send message.");
        console.log(error);
      },
    })
  );
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col gap-2 border shadow rounded-2xl max-w-sm w-full p-4">
        <Textarea
          placeholder="Type your message here..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={invoke.isPending}
        />
        <Button
          onClick={() => invoke.mutate({ value: inputValue })}
          disabled={invoke.isPending}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
