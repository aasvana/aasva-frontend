import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart3,
  Headset,
  LayoutDashboard,
  PlugZap,
  ShieldCheck,
  Smartphone,
  Users,
} from "lucide-react";
import React from "react";
import { Reveal } from "./motion-primitives";

const features = [
  {
    icon: LayoutDashboard,
    title: "One unified dashboard",
    description:
      "Travel, clinic, store and books — every product reports into a single home screen.",
  },
  {
    icon: Users,
    title: "Roles & permissions",
    description:
      "Give agents, doctors, cashiers and accountants exactly the access they need — nothing more.",
  },
  {
    icon: ShieldCheck,
    title: "Bank-grade security",
    description:
      "Encrypted data, audited access logs and daily backups keep your business safe.",
  },
  {
    icon: BarChart3,
    title: "Real-time analytics",
    description:
      "Live revenue, bookings and inventory numbers across all your products, always in sync.",
  },
  {
    icon: Smartphone,
    title: "Works on any device",
    description:
      "Phone at the counter, tablet in the clinic, laptop at the desk — same experience everywhere.",
  },
  {
    icon: PlugZap,
    title: "Turn products on anytime",
    description:
      "Start with one product and switch on more as you grow. Your data carries over instantly.",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="py-20 lg:py-28 scroll-mt-20 bg-muted/40 dark:bg-neutral-900/40"
    >
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
        <Reveal className="max-w-2xl text-center mx-auto">
          <Badge variant="outline" className="rounded-full mb-4">
            Why us
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-balance">
            Built for convenience,{" "}
            <span className="text-muted-foreground">designed to scale</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            From a single travel desk to a multi-store enterprise — the platform
            adapts to the way you work.
          </p>
        </Reveal>

        <div className="mt-12 lg:mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={(i % 3) * 0.1}>
              <Card className="group h-full gap-0 py-6 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-900/5 dark:hover:shadow-black/30">
                <CardContent className="space-y-3">
                  <span className="flex justify-center items-center size-11 rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                    <feature.icon className="size-5" />
                  </span>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
            {[
              { icon: Headset, label: "24/7 human support" },
              { icon: ShieldCheck, label: "99.9% uptime SLA" },
              { icon: PlugZap, label: "Free migration help" },
            ].map((item) => (
              <span key={item.label} className="inline-flex items-center gap-x-2">
                <item.icon className="size-4 text-emerald-600 dark:text-emerald-400" />
                {item.label}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Features;
