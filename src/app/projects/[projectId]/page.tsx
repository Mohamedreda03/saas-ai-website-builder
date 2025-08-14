import React from "react";

interface Props {
  params: Promise<{ projectId: string }>;
}

export default async function page({ params }: Props) {
  const { projectId } = await params;

  return <div>page {projectId}</div>;
}
