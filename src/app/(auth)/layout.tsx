import Image from "next/image";
import Link from "next/link";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-muted flex min-h-svh min-w-screen flex-col justify-center items-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center self-center font-medium">
          <Image
            src="/logo/appLogo.svg"
            alt="ExecFlow Logo"
            width={150}
            height={50}
          />
        </Link>
        {children}
      </div>
    </div>
  );
};

export default Layout;
