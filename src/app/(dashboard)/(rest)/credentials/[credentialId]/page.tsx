import React from "react";

import { requireAuth } from "@/lib/auth-utils";

interface PageProps {
  params: Promise<{
    credentialId: string;
  }>;
}

const CredentialIdPage = async ({ params }: PageProps) => {
  await requireAuth();
  const { credentialId } = await params;

  return <div>{credentialId}</div>;
};

export default CredentialIdPage;
