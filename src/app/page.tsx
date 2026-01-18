import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";
import { Logout } from "./logout";

const Page = async () => {
  await requireAuth();

  const data = await caller.getUsers();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      protected server component
      <div>
      {JSON.stringify(data, null, 2)}
      </div>
      <Logout />
    </div>
  );
};

export default Page;
