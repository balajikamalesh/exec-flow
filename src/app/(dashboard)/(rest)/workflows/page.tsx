import { requireAuth } from "@/lib/auth-utils";
import React from "react";

type Props = {};

const WorkflowsPage = async (props: Props) => {
  await requireAuth();

  return <div></div>;
};

export default WorkflowsPage;
