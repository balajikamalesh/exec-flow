import React from "react";
import { SidebarTrigger } from "./ui/sidebar";

type Props = {};

const AppHeader = (props: Props) => {
  return (
    <header className="flex h-16.25 shrink-0 items-center gap-2 border-b px-4 bg-background">
      <SidebarTrigger />
    </header>
  );
};

export default AppHeader;
