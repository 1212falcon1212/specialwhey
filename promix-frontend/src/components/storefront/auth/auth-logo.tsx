"use client";

import Link from "next/link";
import Image from "next/image";
import { useSettings } from "@/hooks/use-settings";

export function AuthLogo() {
  const { settings } = useSettings();
  const siteLogo = settings?.site_logo as string | undefined;

  return (
    <Link href="/" className="mx-auto mb-2 inline-block">
      {siteLogo ? (
        <Image src={siteLogo} alt="Special Whey" width={200} height={60} className="h-14 w-auto" unoptimized />
      ) : (
        <span className="text-2xl font-bold tracking-tight">
          Special <span className="text-[#ff6b2c]">Whey</span>
        </span>
      )}
    </Link>
  );
}
