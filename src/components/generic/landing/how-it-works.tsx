import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, MousePointerClick, Puzzle, Rocket } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Reveal } from "./motion-primitives";

const steps = [
  {
    icon: MousePointerClick,
    step: "01",
    title: "Create your account",
    description:
      "Sign up in under a minute. No credit card, no sales call, no setup fees.",
  },
  {
    icon: Puzzle,
    step: "02",
    title: "Pick your products",
    description:
      "Choose travel, healthcare, e-commerce, accounting, POS — or any combination.",
  },
  {
    icon: Rocket,
    step: "03",
    title: "Go live today",
    description:
      "Import your data or start fresh. Everything works together from day one.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 scroll-mt-20">
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
        <Reveal className="max-w-2xl text-center mx-auto">
          <Badge variant="outline" className="rounded-full mb-4">
            How it works
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-balance">
            Up and running in{" "}
            <span className="text-muted-foreground">three steps</span>
          </h2>
        </Reveal>

        <div className="relative mt-12 lg:mt-16 grid md:grid-cols-3 gap-10 md:gap-6 max-w-5xl mx-auto">
          <div
            aria-hidden="true"
            className="hidden md:block absolute top-7 left-[16%] right-[16%] border-t-2 border-dashed"
          />
          {steps.map((step, i) => (
            <Reveal key={step.step} delay={i * 0.15}>
              <div className="relative flex flex-col items-center text-center">
                <div className="relative z-10 flex justify-center items-center size-14 rounded-2xl bg-card border shadow-sm text-primary">
                  <step.icon className="size-6" />
                  <span className="absolute -top-2 -end-2 flex justify-center items-center size-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-5 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2} className="mt-12 text-center">
          <Button asChild size="lg" className="rounded-xl shadow-lg shadow-primary/25">
            <Link href="/signup">
              Start for free
              <ArrowRight />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
};

export default HowItWorks;
