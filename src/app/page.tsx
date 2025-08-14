"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const trpc = useTRPC();
  const invoke = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: () => {
        toast.success("Message sent successfully!");
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
        />
        <Button onClick={() => invoke.mutate({ value: inputValue })}>
          Send
        </Button>
      </div>
    </div>
  );
}
