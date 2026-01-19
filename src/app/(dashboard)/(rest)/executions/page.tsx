import { requireAuth } from "@/lib/auth-utils";
import React from "react";

type Props = {};

const ExecutionsPage = async (props: Props) => {
  await requireAuth();

  return <div>ExecutionsPage</div>;
};

export default ExecutionsPage;
