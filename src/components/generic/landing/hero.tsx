"use client";

import { brand } from "@/constants/brand";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, CheckCircle2, IndianRupee, Play } from "lucide-react";
import Link from "next/link";
import React, { useRef } from "react";

const stats = [
  { value: "6+", label: "Products, one platform" },
  { value: "10k+", label: "Businesses onboard" },
  { value: "99.9%", label: "Uptime guaranteed" },
  { value: "24/7", label: "Human support" },
];

const bars = [35, 55, 40, 70, 50, 85, 62, 95, 74];

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const blobY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const mockupY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const cardLeftY = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const cardRightY = useTransform(scrollYProgress, [0, 1], [0, 70]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden pt-16 pb-20 lg:pt-24">
      <motion.div
        style={{ y: blobY }}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 size-[38rem] rounded-full bg-emerald-400/15 blur-3xl" />
        <div className="absolute top-40 -left-40 size-[26rem] rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute top-64 -right-40 size-[26rem] rounded-full bg-teal-400/10 blur-3xl" />
      </motion.div>

      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="max-w-3xl text-center mx-auto"
        >
          <Link href="/signup">
            <Badge
              variant="outline"
              className="group gap-2 rounded-full py-1.5 ps-1.5 pe-3 text-xs sm:text-sm border-gray-200 shadow-sm hover:border-emerald-300 transition cursor-pointer dark:border-neutral-800"
            >
              <Badge className="rounded-full gap-x-1.5 font-medium pointer-events-none">
                <span className="relative flex size-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-foreground opacity-75" />
                  <span className="relative inline-flex rounded-full size-2 bg-primary-foreground" />
                </span>
                New
              </Badge>
              POS &amp; Accounting are now live
              <ArrowRight className="size-3.5 text-muted-foreground group-hover:translate-x-0.5 transition" />
            </Badge>
          </Link>

          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-balance">
            One platform.
            <br />
            <span className="bg-linear-to-r from-emerald-500 via-teal-500 to-sky-500 bg-clip-text text-transparent">
              Every tool your business needs.
            </span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            {brand.name} brings travel management, healthcare records,
            e-commerce, accounting and point-of-sale together — so you run
            everything from one login, one dashboard, one bill.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="w-full sm:w-auto rounded-xl shadow-lg shadow-primary/25">
              <Link href="/signup">
                Get started free
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto rounded-xl">
              <a href="#products">
                <Play className="fill-current" />
                Explore products
              </a>
            </Button>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            No credit card required &middot; Free 14-day trial &middot; Cancel
            anytime
          </p>
        </motion.div>

        <motion.div
          style={{ y: mockupY }}
          initial={{ opacity: 0, y: 60, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative mt-16 lg:mt-20 max-w-5xl mx-auto"
        >
          <div className="pointer-events-none absolute -inset-x-8 -top-10 h-72 rounded-full bg-linear-to-r from-emerald-400/25 via-teal-400/15 to-sky-400/25 blur-3xl -z-10" />

          <div className="relative rounded-2xl border bg-card shadow-2xl shadow-gray-900/10 overflow-hidden dark:shadow-black/40">
            <div className="flex items-center gap-x-2 px-4 py-3 border-b">
              <span className="size-3 rounded-full bg-red-400" />
              <span className="size-3 rounded-full bg-amber-400" />
              <span className="size-3 rounded-full bg-emerald-400" />
              <div className="ms-4 flex-1 max-w-sm h-6 rounded-md bg-muted" />
            </div>

            <div className="grid sm:grid-cols-[auto_1fr]">
              <div className="hidden sm:flex flex-col items-center gap-y-4 border-e py-4 px-3">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`size-8 rounded-lg ${
                      i === 0 ? "bg-primary/15" : "bg-muted"
                    }`}
                  />
                ))}
              </div>

              <div className="p-5 sm:p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-4 w-36 rounded bg-foreground/20" />
                    <div className="mt-2 h-3 w-52 rounded bg-muted" />
                  </div>
                  <div className="h-8 w-24 rounded-lg bg-primary" />
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    ["Revenue", "+18.2%"],
                    ["Orders", "+9.4%"],
                    ["Patients", "+31"],
                    ["Vouchers", "+56"],
                  ].map(([label, delta]) => (
                    <div key={label} className="rounded-xl border p-3.5">
                      <div className="text-xs text-muted-foreground">{label}</div>
                      <div className="mt-1.5 h-5 w-16 rounded bg-foreground/15" />
                      <div className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        {delta}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid lg:grid-cols-5 gap-3">
                  <div className="lg:col-span-3 rounded-xl border p-4">
                    <div className="flex items-end gap-2 h-28">
                      {bars.map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: "8%" }}
                          whileInView={{ height: `${h}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.5 + i * 0.06, ease: "easeOut" }}
                          className="flex-1 rounded-t-md bg-linear-to-t from-primary/70 to-teal-400/80"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="lg:col-span-2 rounded-xl border p-4 space-y-3">
                    {["Payment received", "New booking", "Stock low alert"].map((row) => (
                      <div key={row} className="flex items-center gap-x-2.5">
                        <span className="size-6 rounded-full bg-muted shrink-0" />
                        <span className="text-xs text-muted-foreground truncate">{row}</span>
                        <span className="ms-auto size-1.5 rounded-full bg-emerald-500 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            style={{ y: cardLeftY }}
            className="hidden md:flex absolute -start-6 lg:-start-12 bottom-16 items-center gap-x-3 rounded-xl border bg-card shadow-lg px-4 py-3"
          >
            <span className="flex justify-center items-center size-9 rounded-lg bg-primary/10 text-primary">
              <CheckCircle2 className="size-4" />
            </span>
            <div>
              <p className="text-sm font-semibold">Voucher confirmed</p>
              <p className="text-xs text-muted-foreground">
                Maldives group &middot; just now
              </p>
            </div>
          </motion.div>

          <motion.div
            style={{ y: cardRightY }}
            className="hidden md:flex absolute -end-6 lg:-end-10 top-20 items-center gap-x-3 rounded-xl border bg-card shadow-lg px-4 py-3"
          >
            <span className="flex justify-center items-center size-9 rounded-lg bg-sky-100 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
              <IndianRupee className="size-4" />
            </span>
            <div>
              <p className="text-sm font-semibold">₹12,480 today</p>
              <p className="text-xs text-muted-foreground">POS sales &middot; Store #4</p>
            </div>
          </motion.div>
        </motion.div>

        <dl className="mt-16 lg:mt-20 grid grid-cols-2 gap-y-8 gap-x-6 lg:grid-cols-4 max-w-4xl mx-auto text-center">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
            >
              <dd className="text-3xl sm:text-4xl font-semibold tracking-tight bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                {s.value}
              </dd>
              <dt className="text-sm text-muted-foreground">{s.label}</dt>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default Hero;
