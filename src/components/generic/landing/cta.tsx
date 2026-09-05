import { brand } from "@/constants/brand";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Reveal } from "./motion-primitives";

const Cta = () => {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-neutral-950 px-6 py-16 sm:px-16 lg:py-24 text-center">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-[36rem] rounded-full bg-emerald-500/20 blur-3xl" />
              <div className="absolute -bottom-40 -left-32 size-[28rem] rounded-full bg-sky-500/15 blur-3xl" />
              <div className="absolute -bottom-40 -right-32 size-[28rem] rounded-full bg-teal-500/15 blur-3xl" />
            </div>

            <div className="relative max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white text-balance">
                Ready to run your business the easy way?
              </h2>
              <p className="mt-4 text-lg text-neutral-400 text-pretty">
                Join thousands of travel agents, doctors and business owners who
                switched to {brand.name}. Free for 14 days — set up in minutes.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto rounded-xl bg-white text-neutral-900 hover:bg-neutral-200 shadow-lg shadow-black/20"
                >
                  <Link href="/signup">
                    Get started free
                    <ArrowRight />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto rounded-xl border-neutral-700 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  <a href={`mailto:${"hello@xmerge.io"}`}>
                    <Mail />
                    Talk to us
                  </a>
                </Button>
              </div>

              <p className="mt-4 text-xs text-neutral-500">
                No credit card required &middot; Cancel anytime
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Cta;
