import Link from "next/link";
import { siteConfig } from "~/lib/config";

export function Footer() {
  return (
    <footer className="flex items-center justify-between bg-gray-900 px-6 py-6 text-white md:px-8">
      <div className="text-sm">&copy; 2024. All rights reserved.</div>
      <nav className="hidden items-center gap-6 md:flex">
        <Link href="#" className="hover:underline" prefetch={false}>
          About
        </Link>
        <Link href="#" className="hover:underline" prefetch={false}>
          Terms of Service
        </Link>
        <Link href="#" className="hover:underline" prefetch={false}>
          Privacy Policy
        </Link>
        <Link href="#" className="hover:underline" prefetch={false}>
          Contact
        </Link>
      </nav>
    </footer>
  );
}
