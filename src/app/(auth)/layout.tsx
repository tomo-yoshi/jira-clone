'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  const pathname = usePathname();
  const isSignIn = pathname === "/sign-in";
  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex items-center justify-between">
            <Image src="/logo.svg" alt="logo" width={152} height={56} />
            <Link href={isSignIn ? "/sign-up" : "/sign-in"}>
              <Button asChild variant="secondary">
                <Link href={isSignIn ? "/sign-up" : "/sign-in"}>
                  {isSignIn ? "Sign up" : "Log in"}
                </Link>
              </Button>
            </Link>
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
          {children}
        </div>
      </div>
    </main>
  )
}

export default AuthLayout;