import { Logo } from "@/resources/assets/imgs";
import { brand } from "@/constants/brand";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const navLinks = [
  { label: "Products", href: "#products" },
  { label: "Why us", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Testimonials", href: "#testimonials" },
];

const Header = () => {
    return (
        <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-gray-200/70 dark:border-neutral-800">
            <nav className="relative max-w-7xl w-full flex items-center px-4 md:px-6 lg:px-8 h-16 mx-auto">
                <div className="flex items-center shrink-0">
                    <Link className="flex flex-row justify-center items-center rounded-xl text-xl font-semibold focus:outline-hidden focus:opacity-80" href="/" aria-label={brand.name}>
                        <Image src={Logo} alt={brand.name} height='100' width='100' className="w-9 h-9 rounded-md" />
                        <span className="text-black dark:text-white ms-2 text-xl font-bold">asvana</span>
                    </Link>
                </div>

                <div className="hidden lg:flex items-center justify-center gap-x-1 absolute left-1/2 -translate-x-1/2">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="py-2 px-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-x-1.5 ms-auto">
                    <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                        <Link href="/login">Sign in</Link>
                    </Button>
                    <Button asChild size="sm" className="rounded-lg shadow-sm">
                        <Link href="/signup">Get started</Link>
                    </Button>
                    <div className="lg:hidden">
                        <button type="button" className="hs-collapse-toggle size-9 flex justify-center items-center text-sm font-semibold rounded-lg border text-foreground hover:bg-accent focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none" id="hs-navbar-landing-collapse" aria-expanded="false" aria-controls="hs-navbar-landing" aria-label="Toggle navigation" data-hs-collapse="#hs-navbar-landing">
                            <svg className="hs-collapse-open:hidden shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" x2="21" y1="6" y2="6" />
                                <line x1="3" x2="21" y1="12" y2="12" />
                                <line x1="3" x2="21" y1="18" y2="18" />
                            </svg>
                            <svg className="hs-collapse-open:block hidden shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div id="hs-navbar-landing" className="hs-collapse hidden lg:hidden overflow-hidden transition-all duration-300 basis-full grow mt-3 absolute top-full inset-x-4 bg-card border rounded-2xl shadow-lg p-4 z-50">
                    <div className="flex flex-col gap-y-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="py-2.5 px-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                        <div className="border-t my-2" />
                        <Link href="/login" className="py-2.5 px-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                            Sign in
                        </Link>
                        <Button asChild size="sm" className="mt-1">
                            <Link href="/signup">Get started free</Link>
                        </Button>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
