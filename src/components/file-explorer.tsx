"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment, useCallback, useMemo, useState } from "react";
import { Hint } from "./hint";
import { Button } from "./ui/button";
import { CopyCheckIcon, CopyIcon } from "lucide-react";
import { CodeView } from "./code-view";
import { convertFilesToTreeItems } from "@/lib/utils";
import TreeView from "./tree-view";

type FileCollection = { [path: string]: string };

const getLanguageFromExtension = (filename: string): string => {
  const extension = filename.split(".").pop()?.toLowerCase();
  return extension || "text";
};

interface FileBreadcrumbProps {
  filePath: string;
}

const FileBreadcrumb = ({ filePath }: FileBreadcrumbProps) => {
  const pathSegments = filePath.split("/");
  const maxSegments = 3;

  const renderBreadcrumbItem = () => {
    if (pathSegments.length <= maxSegments) {
      // show all segments if 4 or less
      return pathSegments.map((segment, index) => {
        const isLast = index === pathSegments.length - 1;
        return (
          <Fragment key={index}>
            <BreadcrumbItem>
              {isLast ? (
                <BreadcrumbPage className="font-medium">
                  {segment}
                </BreadcrumbPage>
              ) : (
                <span className="text-muted-foreground">{segment}</span>
              )}
            </BreadcrumbItem>
            {!isLast && <BreadcrumbSeparator />}
          </Fragment>
        );
      });
    } else {
      const firstSegment = pathSegments[0];
      const lastSegment = pathSegments[pathSegments.length - 1];

      return (
        <>
          <BreadcrumbItem>
            <span className="text-muted-foreground">{firstSegment}</span>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium">
                {lastSegment}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbItem>
        </>
      );
    }
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>{renderBreadcrumbItem()}</BreadcrumbList>
    </Breadcrumb>
  );
};

interface FileExplorerProps {
  files: FileCollection;
}

export default function FileExplorer({ files }: FileExplorerProps) {
  const [copied, setCopied] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(() => {
    const fileKeys = Object.keys(files);
    return fileKeys.length > 0 ? fileKeys[0] : null;
  });

  const treeData = useMemo(() => convertFilesToTreeItems(files), [files]);

  const handleFileSelect = useCallback(
    (filePath: string) => {
      if (files[filePath]) setSelectedFile(filePath);
    },
    [files]
  );

  const handleCopy = useCallback(() => {
    if (selectedFile) {
      navigator.clipboard.writeText(files[selectedFile]);
      setCopied(true);
    }

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, [selectedFile, files]);

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={20} minSize={20} className="bg-sidebar">
        <TreeView
          data={treeData}
          value={selectedFile}
          onSelect={handleFileSelect}
        />
      </ResizablePanel>
      <ResizableHandle className="hover:bg-primary transition-colors" />
      <ResizablePanel defaultSize={70} minSize={60} className="bg-sidebar">
        {selectedFile && files[selectedFile] ? (
          <div className="h-full w-full flex flex-col">
            <div className="border-b bg-sidebar px-4 py-2 flex justify-between items-center gap-x-2">
              <FileBreadcrumb filePath={selectedFile} />
              <Hint text="Copy to clipboard" side="bottom">
                <Button
                  variant="outline"
                  className="ml-auto"
                  size="icon"
                  onClick={handleCopy}
                  disabled={copied}
                >
                  {copied ? (
                    <CopyCheckIcon className="text-green-700" />
                  ) : (
                    <CopyIcon />
                  )}
                </Button>
              </Hint>
            </div>
            <div className="overflow-auto flex-1">
              <CodeView
                code={files[selectedFile]}
                lang={getLanguageFromExtension(selectedFile)}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Select a file to view it&apos;s contents</p>
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
