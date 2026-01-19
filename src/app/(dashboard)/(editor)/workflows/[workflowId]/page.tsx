import React from "react";

interface PageProps {
  params: Promise<{
    workflowId: string;
  }>;
}

const WorkFlowIdPage = async ({ params }: PageProps) => {
  const { workflowId } = await params;
  return <div>{workflowId}</div>;
};

export default WorkFlowIdPage;
