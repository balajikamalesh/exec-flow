import { CredentialForm } from "@/features/credentials/components/CredentialForm";
import { requireAuth } from "@/lib/auth-utils";
import React from "react";

const NewPage = async () => {
  await requireAuth();

  return (
    <div className="p-4 md:px-10 md:py-6 h-full">
      <div className="max-w-3xl w-full mx-auto flex flex-col gap-y-8 h-full">
        <CredentialForm />
      </div>
    </div>
  );
};

export default NewPage;
