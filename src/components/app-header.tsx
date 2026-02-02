import React from "react";

import { SidebarTrigger } from "./ui/sidebar";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const AppHeader = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/register");
  }

  return (
    <header className="flex h-16.25 shrink-0 items-center justify-between gap-2 border-b px-4 bg-background">
      <SidebarTrigger />
      <div className="border-l pl-4">
        <span className="font-semibold text-[#8a79ab]">
          Hi! {session.user.name}
        </span>
      </div>
    </header>
  );
};

export default AppHeader;
