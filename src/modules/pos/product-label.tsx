"use client";

import { renderToStaticMarkup } from "react-dom/server";
import { PosProduct } from "./schema";
import { formatMoney } from "./constants";
import { cn } from "@/lib/utils";

const CODE39_PATTERNS: Record<string, string> = {
  "0": "101001101101",
  "1": "110100101011",
  "2": "101100101011",
  "3": "110110010101",
  "4": "101001101011",
  "5": "110100110101",
  "6": "101100110101",
  "7": "101001011011",
  "8": "110100101101",
  "9": "101100101101",
  A: "110101001011",
  B: "101101001011",
  C: "110110100101",
  D: "101011001011",
  E: "110101100101",
  F: "101101100101",
  G: "101010011011",
  H: "110101001101",
  I: "101101001101",
  J: "101011001101",
  K: "110101010011",
  L: "101101010011",
  M: "110110101001",
  N: "101011010011",
  O: "110101101001",
  P: "101101101001",
  Q: "101010110011",
  R: "110101011001",
  S: "101101011001",
  T: "101011011001",
  U: "110010101011",
  V: "100110101011",
  W: "110011010101",
  X: "100101101011",
  Y: "110010110101",
  Z: "100110110101",
  "-": "100101011011",
  ".": "110010101101",
  " ": "100110101101",
  $: "100100100101",
  "/": "100100101001",
  "+": "100101001001",
  "%": "101001001001",
  "*": "100101101101",
};

function code39Pattern(input: string): string {
  const valid = input
    .toUpperCase()
    .replace(/[^0-9A-Z\-.$/+ ]/g, "")
    .trim();
  const data = `*${valid || "X"}*`;
  return data
    .split("")
    .map((ch) => CODE39_PATTERNS[ch] ?? CODE39_PATTERNS["*"])
    .join("0");
}

export function Barcode({
  value,
  width = 120,
  height = 40,
  className,
}: {
  value: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  const pattern = code39Pattern(value);
  const segments: { bar: boolean; width: number }[] = [];
  for (let i = 0; i < pattern.length; ) {
    const ch = pattern[i];
    let j = i;
    while (j < pattern.length && pattern[j] === ch) j++;
    segments.push({ bar: ch === "1", width: j - i });
    i = j;
  }
  const total = segments.reduce((sum, s) => sum + s.width, 0);
  const unit = width / total;
  let x = 0;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      aria-label={`Barcode ${value}`}
    >
      {segments.map((s, idx) => {
        const w = s.width * unit;
        const rect = (
          <rect
            key={idx}
            x={x}
            y={0}
            width={w}
            height={height}
            fill={s.bar ? "#000" : "transparent"}
          />
        );
        x += w;
        return rect;
      })}
    </svg>
  );
}

function LabelContent({
  product,
  businessName,
  currency,
}: {
  product: PosProduct;
  businessName: string;
  currency: string;
}) {
  const sku = product.sku || product.id.slice(0, 8).toUpperCase();
  return (
    <div
      className="label"
      style={{
        display: "inline-block",
        width: "40mm",
        height: "30mm",
        boxSizing: "border-box",
        border: "0.3mm solid #d1d5db",
        borderRadius: "1mm",
        padding: "1.5mm 2mm",
        overflow: "hidden",
        background: "#fff",
        color: "#111",
        textAlign: "left",
        pageBreakInside: "avoid",
        margin: "0 2mm 2mm 0",
      }}
    >
      <div
        style={{
          fontSize: "6.5pt",
          fontWeight: 700,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: "#059669",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {businessName}
      </div>
      <div
        style={{
          marginTop: "0.5mm",
          fontSize: "9pt",
          fontWeight: 700,
          lineHeight: 1.15,
          height: "7.5mm",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}
      >
        {product.name}
      </div>
      <div
        style={{
          fontSize: "14pt",
          fontWeight: 800,
          color: "#111",
          marginTop: "0.5mm",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {formatMoney(product.price, currency)}
      </div>
      <div
        style={{
          marginTop: "0.5mm",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "1mm",
        }}
      >
        <Barcode value={sku} width={92} height={26} />
        <div style={{ textAlign: "right", minWidth: "12mm" }}>
          <div
            style={{
              fontSize: "6pt",
              fontWeight: 700,
              letterSpacing: "0.05em",
              color: "#4b5563",
            }}
          >
            {sku}
          </div>
          <div
            style={{
              fontSize: "5.5pt",
              color: "#9ca3af",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {product.category}
          </div>
        </div>
      </div>
    </div>
  );
}

const PRINT_CSS = `
  @page { margin: 4mm; }
  body {
    margin: 0;
    padding: 0;
    font-family: Arial, Helvetica, sans-serif;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .label { margin: 0 2mm 2mm 0 !important; }
`;

export function printProductLabels(params: {
  product: PosProduct;
  copies: number;
  businessName: string;
  currency: string;
}) {
  const { product, copies, businessName, currency } = params;
  const labels = Array.from({ length: copies }, (_, i) =>
    renderToStaticMarkup(
      <LabelContent
        key={i}
        product={product}
        businessName={businessName}
        currency={currency}
      />
    )
  ).join("");

  const win = window.open("", "_blank", "width=820,height=640");
  if (!win) return;
  win.document.write(
    `<!doctype html><html><head><meta charset="utf-8"><title>Product Label — ${product.name}</title><style>${PRINT_CSS}</style></head><body>${labels}</body></html>`
  );
  win.document.close();
  win.focus();
  win.print();
}

export function ProductLabel({
  product,
  businessName,
  currency,
  className,
}: {
  product: PosProduct;
  businessName: string;
  currency: string;
  className?: string;
}) {
  return (
    <div
      className={cn("relative", className)}
      style={{
        width: "40mm",
        height: "30mm",
        overflow: "hidden",
      }}
    >
      <LabelContent
        product={product}
        businessName={businessName}
        currency={currency}
      />
    </div>
  );
}
