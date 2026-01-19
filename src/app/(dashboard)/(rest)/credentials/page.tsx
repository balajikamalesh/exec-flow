import { requireAuth } from "@/lib/auth-utils";
import React from "react";

type Props = {};

const CredentialsPage = async (props: Props) => {
  await requireAuth();

  return <div>CredentialsPage</div>;
};

export default CredentialsPage;
