import React from "react";

import { requireAuth } from "@/lib/auth-utils";

type Props = {};

const CredentialsPage = async (props: Props) => {
  await requireAuth();

  return <div>CredentialsPage</div>;
};

export default CredentialsPage;
