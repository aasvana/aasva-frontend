"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/generic/landing/motion-primitives";
import { brand } from "@/constants/brand";
import { Logo } from "@/resources/assets/imgs";
import { motion } from "motion/react";
import {
  ArrowRight,
  BarChart3,
  Calculator,
  Check,
  LayoutDashboard,
  Lock,
  MousePointerClick,
  Plane,
  Play,
  Puzzle,
  Rocket,
  ScanBarcode,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Stethoscope,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const products = [
  {
    icon: Plane,
    name: "Travel Management",
    status: "Live",
    gradient: "from-sky-400 to-blue-600",
    glow: "from-sky-500 via-blue-500 to-transparent",
    description:
      "Run your entire agency — vouchers, itineraries, clients and vendors in one place.",
    points: ["Confirmation vouchers", "Itineraries & bookings", "Client & vendor CRM"],
    wide: true,
  },
  {
    icon: Stethoscope,
    name: "Healthcare Suite",
    status: "Live",
    gradient: "from-rose-400 to-pink-600",
    glow: "from-rose-500 via-pink-500 to-transparent",
    description:
      "Every patient, every visit, one tap away.",
    points: ["Patient records", "Appointments"],
  },
  {
    icon: ShoppingBag,
    name: "E-commerce",
    status: "Beta",
    gradient: "from-violet-400 to-purple-600",
    glow: "from-violet-500 via-purple-500 to-transparent",
    description: "Storefronts that scale from first sale to full catalog.",
    points: ["Online store", "Orders & payments"],
  },
  {
    icon: Calculator,
    name: "Accounting",
    status: "Beta",
    gradient: "from-emerald-400 to-teal-600",
    glow: "from-emerald-500 via-teal-500 to-transparent",
    description: "Clean books, zero spreadsheet chaos.",
    points: ["Invoices & expenses", "GST-ready reports"],
  },
  {
    icon: ScanBarcode,
    name: "POS System",
    status: "Live",
    gradient: "from-amber-400 to-orange-600",
    glow: "from-amber-500 via-orange-500 to-transparent",
    description: "Blazing billing for counters, online or off.",
    points: ["Instant billing", "Multi-store"],
  },
  {
    icon: Sparkles,
    name: "HR, Inventory, CRM & more",
    status: "Coming soon",
    gradient: "from-slate-400 to-slate-600",
    glow: "from-slate-500 via-slate-400 to-transparent",
    description:
      "The platform keeps growing — new products ship into the same dashboard, same login, same bill.",
    points: [],
    wide: true,
  },
];

const marqueeItems = [
  "Travel Management",
  "Healthcare",
  "E-commerce",
  "Accounting",
  "POS",
  "HR & Payroll",
  "Inventory",
  "CRM",
];

const features = [
  {
    icon: LayoutDashboard,
    title: "One electric command center",
    description:
      "Travel desk, clinic, storefront and books — every product beams into a single live dashboard.",
    wide: true,
    visual: "bars",
  },
  {
    icon: Users,
    title: "Roles & permissions",
    description: "Agents, doctors, cashiers, accountants — everyone sees exactly what they should.",
    visual: "avatars",
  },
  {
    icon: BarChart3,
    title: "Real-time analytics",
    description:
      "Revenue, bookings and stock update live across all products. No exports, no waiting.",
    wide: true,
    visual: "spark",
  },
  {
    icon: Lock,
    title: "Bank-grade security",
    description: "Encrypted, audited, backed up. Sleep well.",
  },
  {
    icon: Smartphone,
    title: "Any device",
    description: "Counter, clinic or couch — same speed everywhere.",
  },
  {
    icon: Zap,
    title: "Modular by design",
    description: "Turn products on when you need them. Data carries over instantly.",
  },
];

const steps = [
  {
    icon: MousePointerClick,
    title: "Create your account",
    description: "60 seconds. No card, no calls, no setup fees.",
    gradient: "from-violet-500 to-fuchsia-500",
  },
  {
    icon: Puzzle,
    title: "Pick your products",
    description: "Travel, healthcare, commerce, books, POS — any mix.",
    gradient: "from-fuchsia-500 to-orange-400",
  },
  {
    icon: Rocket,
    title: "Go live today",
    description: "Import data or start fresh. It all just works together.",
    gradient: "from-orange-400 to-rose-500",
  },
];

const testimonials = [
  {
    quote:
      "We ran four tools before this. Now the whole agency lives in one dashboard — I check it with my morning chai and know exactly where we stand.",
    name: "Priya Sharma",
    role: "Founder, Wanderlust Holidays",
    initials: "PS",
    ring: "from-sky-400 to-blue-600",
  },
  {
    quote:
      "Patient histories were paper files. Now every visit and prescription is one tap away. Nothing slips through the cracks anymore.",
    name: "Dr. Arjun Mehta",
    role: "Physician, CityCare Clinic",
    initials: "AM",
    ring: "from-rose-400 to-pink-600",
  },
  {
    quote:
      "Rush hour at the counter used to be chaos. Now billing is instant and stock updates itself. Second store? Same login, zero setup.",
    name: "Rahul Verma",
    role: "Owner, Verma Electronics",
    initials: "RV",
    ring: "from-amber-400 to-orange-600",
  },
];

const stats = [
  { value: "6+", label: "Products on one platform" },
  { value: "10k+", label: "Businesses onboard" },
  { value: "99.9%", label: "Uptime, guaranteed" },
  { value: "4.9", label: "Average user rating", star: true },
];

const GridPattern = () => (
  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_60%,transparent_100%)]" />
);

const Nav = () => (
  <header className="sticky top-0 z-50 w-full bg-neutral-950/70 backdrop-blur-xl border-b border-white/10">
    <nav className="max-w-7xl w-full flex items-center px-4 md:px-6 lg:px-8 h-16 mx-auto">
      <Link href="/" className="flex items-center shrink-0">
        <Image src={Logo} alt={brand.name} width={36} height={36} className="w-9 h-9 rounded-lg" />
        <span className="ms-2 text-xl font-bold text-white">{brand.name}</span>
      </Link>
      <div className="hidden md:flex items-center gap-x-1 absolute left-1/2 -translate-x-1/2">
        {[
          ["Products", "#products"],
          ["Why us", "#features"],
          ["How it works", "#how"],
          ["Reviews", "#reviews"],
        ].map(([label, href]) => (
          <a
            key={href}
            href={href}
            className="py-2 px-3 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            {label}
          </a>
        ))}
      </div>
      <div className="flex items-center gap-x-2 ms-auto">
        <Link href="/login" className="hidden sm:inline-flex py-2 px-3 text-sm font-medium text-neutral-300 hover:text-white transition-colors">
          Sign in
        </Link>
        <Button asChild size="sm" className="rounded-lg bg-linear-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400 text-white shadow-lg shadow-fuchsia-500/25 border-0">
          <Link href="/signup">
            Get started
            <ArrowRight />
          </Link>
        </Button>
      </div>
    </nav>
  </header>
);

const Hero = () => (
  <section className="relative overflow-hidden pt-20 pb-16 lg:pt-28">
    <GridPattern />
    <div className="pointer-events-none absolute inset-0">
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-40 left-[15%] size-[34rem] rounded-full bg-violet-600/25 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
        transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-[10%] size-[30rem] rounded-full bg-fuchsia-600/20 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, 60, 0], y: [0, -30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-96 -left-32 size-[26rem] rounded-full bg-cyan-500/15 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -40, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[30rem] right-[20%] size-[22rem] rounded-full bg-orange-500/15 blur-3xl"
      />
    </div>

    <div className="relative max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="max-w-4xl text-center mx-auto"
      >
        <Badge className="rounded-full py-1.5 px-4 text-xs sm:text-sm bg-white/5 border border-white/10 text-neutral-300 hover:bg-white/5 gap-2">
          <Sparkles className="size-3.5 text-fuchsia-400" />
          6 products &middot; 1 platform &middot; 0 chaos
        </Badge>

        <h1 className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white text-balance leading-[1.05]">
          All your business tools.{" "}
          <span className="bg-linear-to-r from-violet-400 via-fuchsia-400 to-orange-300 bg-clip-text text-transparent">
            One electric platform.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto text-pretty">
          {brand.name} fuses travel, healthcare, e-commerce, accounting and POS
          into one vibrant command center — so your business runs itself while
          you focus on growing it.
        </p>

        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild size="lg" className="w-full sm:w-auto rounded-xl bg-linear-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400 text-white border-0 shadow-xl shadow-fuchsia-500/30 hover:shadow-fuchsia-500/50 hover:scale-[1.03] transition-all">
            <Link href="/signup">
              Start free — no card needed
              <ArrowRight />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto rounded-xl border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white backdrop-blur">
            <a href="#products">
              <Play className="fill-current" />
              See it in action
            </a>
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 70, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="relative mt-16 lg:mt-24 max-w-5xl mx-auto"
      >
        <div className="absolute -inset-x-4 -top-8 h-64 bg-linear-to-r from-violet-600/30 via-fuchsia-600/25 to-orange-500/25 blur-3xl -z-10 rounded-full" />

        <div className="relative rounded-2xl border border-white/10 bg-neutral-900/80 backdrop-blur-xl shadow-2xl shadow-fuchsia-500/10 overflow-hidden">
          <div className="flex items-center gap-x-2 px-4 py-3 border-b border-white/10">
            <span className="size-3 rounded-full bg-red-500/80" />
            <span className="size-3 rounded-full bg-amber-500/80" />
            <span className="size-3 rounded-full bg-emerald-500/80" />
            <div className="ms-4 flex-1 max-w-sm h-6 rounded-md bg-white/5" />
            <Badge variant="outline" className="border-white/10 text-neutral-400 text-[10px]">
              live
            </Badge>
          </div>

          <div className="p-5 sm:p-6 space-y-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                ["Revenue", "+18.2%", "from-violet-500 to-purple-500"],
                ["Orders", "+9.4%", "from-fuchsia-500 to-pink-500"],
                ["Patients", "+31", "from-rose-500 to-orange-400"],
                ["Vouchers", "+56", "from-cyan-500 to-sky-500"],
              ].map(([label, delta, grad]) => (
                <div key={label} className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
                  <div className="text-xs text-neutral-500">{label}</div>
                  <div className="mt-1.5 h-5 w-16 rounded bg-white/10" />
                  <div className={`mt-2 text-xs font-semibold bg-linear-to-r ${grad} bg-clip-text text-transparent`}>
                    {delta}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-5 gap-3">
              <div className="lg:col-span-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-end gap-2 h-32">
                  {[
                    ["35%", "from-violet-500 to-purple-400"],
                    ["55%", "from-fuchsia-500 to-pink-400"],
                    ["40%", "from-cyan-500 to-sky-400"],
                    ["70%", "from-rose-500 to-orange-400"],
                    ["50%", "from-violet-500 to-fuchsia-400"],
                    ["85%", "from-emerald-500 to-teal-400"],
                    ["62%", "from-amber-500 to-orange-400"],
                    ["95%", "from-fuchsia-500 to-violet-400"],
                    ["74%", "from-cyan-400 to-emerald-400"],
                  ].map(([h, g], i) => (
                    <motion.div
                      key={i}
                      initial={{ height: "6%" }}
                      whileInView={{ height: h as string }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: 0.6 + i * 0.07, ease: "easeOut" }}
                      className={`flex-1 rounded-t-md bg-linear-to-t ${g}`}
                    />
                  ))}
                </div>
              </div>
              <div className="lg:col-span-2 rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
                {[
                  ["Payment received", "bg-emerald-400"],
                  ["New booking", "bg-violet-400"],
                  ["Low stock alert", "bg-amber-400"],
                  ["Appointment booked", "bg-rose-400"],
                ].map(([row, dot]) => (
                  <div key={row} className="flex items-center gap-x-2.5">
                    <span className="size-6 rounded-full bg-white/5 shrink-0" />
                    <span className="text-xs text-neutral-400 truncate">{row}</span>
                    <span className={`ms-auto size-1.5 rounded-full ${dot} shrink-0`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:flex absolute -start-8 lg:-start-14 bottom-20 animate-float items-center gap-x-3 rounded-xl border border-white/10 bg-neutral-900/90 backdrop-blur shadow-xl shadow-violet-500/10 px-4 py-3">
          <span className="flex justify-center items-center size-9 rounded-lg bg-linear-to-br from-violet-500 to-fuchsia-500 text-white">
            <Check className="size-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-white">Voucher confirmed</p>
            <p className="text-xs text-neutral-500">Maldives group &middot; just now</p>
          </div>
        </div>

        <div className="hidden md:flex absolute -end-8 lg:-end-12 top-24 animate-float-delayed items-center gap-x-3 rounded-xl border border-white/10 bg-neutral-900/90 backdrop-blur shadow-xl shadow-orange-500/10 px-4 py-3">
          <span className="flex justify-center items-center size-9 rounded-lg bg-linear-to-br from-amber-500 to-orange-500 text-white">
            <Zap className="size-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-white">₹12,480 today</p>
            <p className="text-xs text-neutral-500">POS sales &middot; Store #4</p>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

const Marquee = () => (
  <section className="py-10 border-y border-white/5 bg-white/[0.02] overflow-hidden">
    <div className="relative">
      <div className="absolute inset-y-0 left-0 w-24 bg-linear-to-r from-neutral-950 to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-24 bg-linear-to-l from-neutral-950 to-transparent z-10" />
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {[...marqueeItems, ...marqueeItems].map((item, i) => (
          <span key={i} className="flex items-center gap-x-8 pe-8 text-lg font-semibold text-neutral-600">
            {item}
            <Sparkles className="size-4 text-fuchsia-500/50" />
          </span>
        ))}
      </div>
    </div>
  </section>
);

const ProductsBento = () => (
  <section id="products" className="py-24 lg:py-32 scroll-mt-16">
    <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
      <Reveal className="max-w-2xl text-center mx-auto">
        <Badge className="rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 hover:bg-fuchsia-500/10">
          Products
        </Badge>
        <h2 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight text-white text-balance">
          A toolbox that{" "}
          <span className="bg-linear-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            glows together
          </span>
        </h2>
        <p className="mt-4 text-lg text-neutral-400 text-pretty">
          Five products live today. More landing soon. One login for all of it.
        </p>
      </Reveal>

      <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((p, i) => (
          <Reveal key={p.name} delay={(i % 3) * 0.1} className={p.wide ? "sm:col-span-2" : ""}>
            <div className="group relative rounded-2xl bg-white/[0.06] p-px h-full">
              <div className={`absolute inset-0 rounded-2xl bg-linear-to-br ${p.glow} opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
              <div className={`relative rounded-[15px] bg-neutral-950 h-full p-6 ${p.wide ? "sm:flex sm:items-start sm:gap-x-8" : ""}`}>
                <div className={p.wide ? "flex-1" : ""}>
                  <div className="flex items-start justify-between">
                    <span className={`flex justify-center items-center size-11 rounded-xl bg-linear-to-br ${p.gradient} text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6`}>
                      <p.icon className="size-5" />
                    </span>
                    <Badge
                      className={`rounded-full border text-[11px] ${
                        p.status === "Live"
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                          : p.status === "Beta"
                            ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                            : "bg-white/5 border-white/10 text-neutral-400"
                      }`}
                    >
                      {p.status}
                    </Badge>
                  </div>
                  <h3 className="mt-4 font-semibold text-white">{p.name}</h3>
                  <p className="mt-1.5 text-sm text-neutral-400 leading-relaxed">{p.description}</p>
                </div>
                {p.points.length > 0 && (
                  <ul className={`mt-4 space-y-2 ${p.wide ? "sm:mt-0 sm:w-52 shrink-0" : ""}`}>
                    {p.points.map((point) => (
                      <li key={point} className="flex items-center gap-x-2.5 text-sm text-neutral-300">
                        <span className={`flex justify-center items-center size-5 rounded-full bg-linear-to-br ${p.gradient}`}>
                          <Check className="size-3 text-white" />
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const StatsBand = () => (
  <section className="py-6">
    <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-violet-600 via-fuchsia-600 to-orange-500 px-6 py-12 lg:py-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.2),transparent_50%)]" />
          <dl className="relative grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6 text-center text-white">
            {stats.map((s) => (
              <div key={s.label}>
                <dd className="text-4xl sm:text-5xl font-bold tracking-tight flex items-center justify-center gap-x-1">
                  {s.value}
                  {s.star && <Star className="size-6 fill-current" />}
                </dd>
                <dt className="mt-2 text-sm text-white/80">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>
    </div>
  </section>
);

const FeatureVisual = ({ type }: { type: string }) => {
  if (type === "bars") {
    return (
      <div className="flex items-end gap-1.5 h-16 w-40">
        {[40, 70, 45, 90, 60, 100, 75].map((h, i) => (
          <div
            key={i}
            className={`flex-1 rounded-t ${["bg-violet-500", "bg-fuchsia-500", "bg-cyan-400", "bg-rose-500", "bg-amber-400", "bg-emerald-400", "bg-purple-400"][i]}`}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    );
  }
  if (type === "avatars") {
    return (
      <div className="flex -space-x-2.5">
        {["from-violet-500 to-fuchsia-500", "from-rose-500 to-orange-400", "from-cyan-500 to-sky-500", "from-emerald-500 to-teal-500"].map((g, i) => (
          <span key={i} className={`size-9 rounded-full border-2 border-neutral-950 bg-linear-to-br ${g}`} />
        ))}
        <span className="size-9 rounded-full border-2 border-neutral-950 bg-white/10 flex items-center justify-center text-[10px] font-bold text-white">
          +9
        </span>
      </div>
    );
  }
  if (type === "spark") {
    return (
      <svg viewBox="0 0 160 48" className="w-44 h-12" fill="none">
        <path
          d="M2 40 C 20 38, 25 20, 40 24 S 60 40, 75 30 S 100 6, 120 12 S 145 20, 158 8"
          stroke="url(#sparkgrad)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="sparkgrad" x1="0" y1="0" x2="160" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8b5cf6" />
            <stop offset="0.5" stopColor="#d946ef" />
            <stop offset="1" stopColor="#fb923c" />
          </linearGradient>
        </defs>
      </svg>
    );
  }
  return null;
};

const FeaturesBento = () => (
  <section id="features" className="py-24 lg:py-32 scroll-mt-16 bg-white/[0.02] border-y border-white/5">
    <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
      <Reveal className="max-w-2xl text-center mx-auto">
        <Badge className="rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 hover:bg-violet-500/10">
          Why us
        </Badge>
        <h2 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight text-white text-balance">
          Serious infrastructure.{" "}
          <span className="bg-linear-to-r from-fuchsia-400 to-orange-300 bg-clip-text text-transparent">
            Seriously fun to use.
          </span>
        </h2>
      </Reveal>

      <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={(i % 3) * 0.1} className={f.wide ? "sm:col-span-2" : ""}>
            <div className="group relative rounded-2xl bg-white/[0.06] p-px h-full">
              <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-violet-500 via-fuchsia-500 to-orange-400 opacity-0 group-hover:opacity-25 transition-opacity duration-500" />
              <div className={`relative rounded-[15px] bg-neutral-950 h-full p-6 flex flex-col ${f.wide ? "sm:flex-row sm:items-center sm:gap-x-10" : ""}`}>
                <div className="flex-1">
                  <span className="flex justify-center items-center size-11 rounded-xl bg-linear-to-br from-violet-500/20 to-fuchsia-500/20 border border-white/10 text-fuchsia-400 transition-transform duration-300 group-hover:scale-110">
                    <f.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 font-semibold text-white">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-neutral-400 leading-relaxed">{f.description}</p>
                </div>
                {f.visual && (
                  <div className="mt-6 sm:mt-0 shrink-0 rounded-xl border border-white/10 bg-white/[0.03] p-4 flex items-center justify-center">
                    <FeatureVisual type={f.visual} />
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Steps = () => (
  <section id="how" className="py-24 lg:py-32 scroll-mt-16">
    <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
      <Reveal className="max-w-2xl text-center mx-auto">
        <Badge className="rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/10">
          How it works
        </Badge>
        <h2 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight text-white text-balance">
          Three steps.{" "}
          <span className="bg-linear-to-r from-orange-300 to-rose-400 bg-clip-text text-transparent">
            Zero friction.
          </span>
        </h2>
      </Reveal>

      <div className="mt-14 grid md:grid-cols-3 gap-10 md:gap-6 max-w-5xl mx-auto">
        {steps.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.15}>
            <div className="relative flex flex-col items-center text-center">
              <div className="relative">
                <div className={`absolute -inset-1.5 rounded-3xl bg-linear-to-br ${s.gradient} opacity-30 blur-lg`} />
                <div className={`relative flex justify-center items-center size-16 rounded-2xl bg-linear-to-br ${s.gradient} text-white shadow-xl`}>
                  <s.icon className="size-7" />
                </div>
                <span className="absolute -top-2.5 -end-2.5 flex justify-center items-center size-7 rounded-full bg-white text-neutral-950 text-xs font-bold shadow-lg">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-6 font-semibold text-white text-lg">{s.title}</h3>
              <p className="mt-2 text-sm text-neutral-400 leading-relaxed max-w-xs">{s.description}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2} className="mt-14 text-center">
        <Button asChild size="lg" className="rounded-xl bg-linear-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400 text-white border-0 shadow-xl shadow-fuchsia-500/30 hover:scale-[1.03] transition-all">
          <Link href="/signup">
            Start for free
            <ArrowRight />
          </Link>
        </Button>
      </Reveal>
    </div>
  </section>
);

const Testimonials = () => (
  <section id="reviews" className="py-24 lg:py-32 scroll-mt-16 bg-white/[0.02] border-y border-white/5">
    <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
      <Reveal className="max-w-2xl text-center mx-auto">
        <Badge className="rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10">
          Wall of love
        </Badge>
        <h2 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight text-white text-balance">
          Businesses{" "}
          <span className="bg-linear-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
            glow different
          </span>{" "}
          with us
        </h2>
      </Reveal>

      <div className="mt-14 grid md:grid-cols-3 gap-5">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.12}>
            <div className="group relative rounded-2xl bg-white/[0.06] p-px h-full">
              <div className={`absolute inset-0 rounded-2xl bg-linear-to-br ${t.ring} opacity-0 group-hover:opacity-25 transition-opacity duration-500`} />
              <div className="relative rounded-[15px] bg-neutral-950 h-full p-6 flex flex-col">
                <div className="flex gap-x-1 text-amber-400">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className="size-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-neutral-300 flex-1">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figure className="mt-6 flex items-center gap-x-3">
                  <span className={`rounded-full p-[2px] bg-linear-to-br ${t.ring}`}>
                    <span className="flex justify-center items-center size-10 rounded-full bg-neutral-950 text-sm font-bold text-white">
                      {t.initials}
                    </span>
                  </span>
                  <figcaption>
                    <div className="text-sm font-semibold text-white">{t.name}</div>
                    <div className="text-xs text-neutral-500">{t.role}</div>
                  </figcaption>
                </figure>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const FinalCta = () => (
  <section className="py-24 lg:py-32">
    <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
      <Reveal>
        <div className="relative rounded-3xl p-px overflow-hidden">
          <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,#8b5cf6,#d946ef,#fb923c,#22d3ee,#8b5cf6)] animate-spin-slow" />
          <div className="relative rounded-[23px] bg-neutral-950 px-6 py-16 sm:px-16 lg:py-24 text-center overflow-hidden">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-32 left-1/2 -translate-x-1/2 size-[30rem] rounded-full bg-fuchsia-600/20 blur-3xl" />
              <div className="absolute -bottom-32 -left-24 size-[24rem] rounded-full bg-violet-600/20 blur-3xl" />
              <div className="absolute -bottom-32 -right-24 size-[24rem] rounded-full bg-orange-500/15 blur-3xl" />
            </div>
            <div className="relative max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white text-balance">
                Your business deserves a{" "}
                <span className="bg-linear-to-r from-violet-400 via-fuchsia-400 to-orange-300 bg-clip-text text-transparent">
                  glow-up
                </span>
              </h2>
              <p className="mt-4 text-lg text-neutral-400 text-pretty">
                Join 10,000+ travel agents, doctors and owners already running
                on {brand.name}. Free for 14 days.
              </p>
              <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button asChild size="lg" className="w-full sm:w-auto rounded-xl bg-linear-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400 text-white border-0 shadow-xl shadow-fuchsia-500/30 hover:scale-[1.03] transition-all">
                  <Link href="/signup">
                    Claim your free trial
                    <ArrowRight />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto rounded-xl border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                  <Link href="/login">I already have an account</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

export default function LandingVibrant() {
  return (
    <div className="bg-neutral-950 min-h-screen">
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <ProductsBento />
        <StatsBand />
        <FeaturesBento />
        <Steps />
        <Testimonials />
        <FinalCta />
      </main>
    </div>
  );
}
