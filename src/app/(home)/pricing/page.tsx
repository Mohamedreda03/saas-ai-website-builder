"use client";

import { useCurrentTheme } from "@/hooks/use-current-theme";
import { PricingTable } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Image from "next/image";

export default function PricingPage() {
  const currentTheme = useCurrentTheme();
  return (
    <div className="flex flex-col max-w-3xl mx-auto w-full">
      <section className="space-y-6 pt-[26vh] 2xl:pt-48">
        <div className="flex flex-col items-center">
          {/* <Image
            src="/logo.svg"
            alt="Aiwa"
            width={50}
            height={50}
            className="hidden md:block"
          /> */}
          <img
            src="/logo.png"
            alt="Aiwa"
            className="hidden md:block w-28 h-28"
          />
        </div>
        <h1 className="text-xl md:text-3xl font-bold text-center">Pricing</h1>
        <p className="text-center text-muted-foreground text-sm md:text-base">
          Choose the plan that is right for you.
        </p>
        <PricingTable
          appearance={{
            elements: {
              pricingTableCard: "border! shadow-none! rounded-lg!",
            },
            theme: currentTheme === "dark" ? dark : undefined,
          }}
        />
      </section>
    </div>
  );
}
