import React from "react";

import { requireAuth } from "@/lib/auth-utils";

type Props = {};

const ExecutionsPage = async (props: Props) => {
  await requireAuth();

  return <div>ExecutionsPage</div>;
};

export default ExecutionsPage;
