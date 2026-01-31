import React, { Suspense } from "react";

import { requireAuth } from "@/lib/auth-utils";
import { CredentialView } from "@/features/credentials/components/CredentialForm";
import { prefetchCredential } from "@/features/credentials/server/prefetch";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import {
  CredentialsError,
  CredentialsLoading,
} from "@/features/credentials/components/credentials";

interface PageProps {
  params: Promise<{
    credentialId: string;
  }>;
}

const CredentialIdPage = async ({ params }: PageProps) => {
  await requireAuth();
  const { credentialId } = await params;

  prefetchCredential(credentialId);

  return (
    <div className="p-4 md:px-10 md:py-6 h-full">
      <div className="max-w-3xl w-full mx-auto flex flex-col gap-y-8 h-full">
        <HydrateClient>
          <ErrorBoundary fallback={<CredentialsError />}>
            <Suspense fallback={<CredentialsLoading />}>
              <CredentialView credentialId={credentialId} />
            </Suspense>
          </ErrorBoundary>
        </HydrateClient>
      </div>
    </div>
  );
};

export default CredentialIdPage;
