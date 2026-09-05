import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import React from "react";
import { Reveal } from "./motion-primitives";

const testimonials = [
  {
    quote:
      "We ran vouchers, invoices and client records across four different tools. Now my whole agency lives in one place — I check the dashboard with my morning chai and know exactly where we stand.",
    name: "Priya Sharma",
    role: "Founder, Wanderlust Holidays",
    initials: "PS",
    tint: "bg-sky-100 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
  },
  {
    quote:
      "Patient histories used to be paper files. Now every visit, prescription and follow-up is one tap away. My reception runs smoother and nothing slips through the cracks.",
    name: "Dr. Arjun Mehta",
    role: "Physician, CityCare Clinic",
    initials: "AM",
    tint: "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
  },
  {
    quote:
      "The POS handles rush hour without breaking a sweat, and stock counts update instantly. When we opened our second store it just… worked. Same login, same data.",
    name: "Rahul Verma",
    role: "Owner, Verma Electronics",
    initials: "RV",
    tint: "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  },
];

const Testimonials = () => {
  return (
    <section
      id="testimonials"
      className="py-20 lg:py-28 scroll-mt-20 bg-muted/40 dark:bg-neutral-900/40"
    >
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
        <Reveal className="max-w-2xl text-center mx-auto">
          <Badge variant="outline" className="rounded-full mb-4">
            Testimonials
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-balance">
            Loved by businesses{" "}
            <span className="text-muted-foreground">big and small</span>
          </h2>
        </Reveal>

        <div className="mt-12 lg:mt-16 grid md:grid-cols-3 gap-5 lg:gap-6">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.12}>
              <Card className="h-full gap-0 py-6">
                <CardContent className="flex flex-col h-full space-y-5">
                  <div className="flex gap-x-1 text-amber-400">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className="size-4 fill-current" />
                    ))}
                  </div>

                  <blockquote className="text-sm leading-relaxed text-muted-foreground flex-1">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>

                  <figure className="flex items-center gap-x-3 pt-2">
                    <span
                      className={`flex justify-center items-center size-10 rounded-full font-semibold text-sm ${t.tint}`}
                    >
                      {t.initials}
                    </span>
                    <figcaption>
                      <div className="text-sm font-semibold">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </figcaption>
                  </figure>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
