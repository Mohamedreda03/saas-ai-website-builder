"use client";

import { Suspense, useState } from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { MessagesContainer } from "../components/messages-container";
import { Fragment } from "@/generated/prisma";
import ProjectHeader from "../components/project-header";
import FragmentWeb from "../components/fragment-web";
import { CodeIcon, CrownIcon, EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CodeView } from "@/components/code-view";
import FileExplorer from "@/components/file-explorer";

interface Props {
  projectId: string;
}

export function ProjectView({ projectId }: Props) {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={20}
          className="flex flex-col min-h-0"
        >
          <Suspense fallback={<div>Loading project header...</div>}>
            <ProjectHeader projectId={projectId} />
          </Suspense>
          <Suspense fallback={<div>Loading messages...</div>}>
            <MessagesContainer
              projectId={projectId}
              activeFragment={activeFragment}
              setActiveFragment={setActiveFragment}
            />
          </Suspense>
        </ResizablePanel>
        <ResizableHandle className="hover:bg-primary transition-colors" />
        <ResizablePanel defaultSize={65} minSize={50}>
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "preview" | "code")}
            className="h-full gap-y-0"
          >
            <div className="flex items-center w-full p-2 border-b gap-x-2">
              <TabsList className="h-8 p-0 border rounded-md">
                <TabsTrigger value="preview" className="rounded-md">
                  <EyeIcon /> <span>Preview</span>
                </TabsTrigger>
                <TabsTrigger value="code" className="rounded-md">
                  <CodeIcon /> <span>Code</span>
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-x-2">
                <Button size="sm" asChild>
                  <Link href={"/pricing"}>
                    <CrownIcon /> Upgrade
                  </Link>
                </Button>
              </div>
            </div>
            <TabsContent value="preview">
              {!!activeFragment && <FragmentWeb data={activeFragment} />}
            </TabsContent>
            <TabsContent value="code" className="min-h-0">
              {!!activeFragment?.files && (
                <FileExplorer
                  files={activeFragment.files as { [path: string]: string }}
                />
              )}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
