const DIMENSION_STEPS = [512, 400, 320, 256, 192];
const QUALITY_STEPS = [0.85, 0.7, 0.55, 0.4];

export function estimateDataUrlBytes(dataUrl: string): number {
  const comma = dataUrl.indexOf(",");
  const base64 = comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl;
  return Math.floor((base64.length * 3) / 4);
}

function supportsWebp(): boolean {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL("image/webp").startsWith("data:image/webp");
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not decode the image"));
    img.src = dataUrl;
  });
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read the file"));
    reader.readAsDataURL(file);
  });
}

function scaleTo(canvas: HTMLCanvasElement, maxDim: number): HTMLCanvasElement {
  const scale = Math.min(1, maxDim / Math.max(canvas.width, canvas.height));
  const width = Math.max(1, Math.round(canvas.width * scale));
  const height = Math.max(1, Math.round(canvas.height * scale));
  const out = document.createElement("canvas");
  out.width = width;
  out.height = height;
  const ctx = out.getContext("2d");
  if (ctx) {
    ctx.drawImage(canvas, 0, 0, width, height);
  }
  return out;
}

export type CompressImageOptions = {
  maxDim?: number;
  maxBytes?: number;
};

export async function compressImageToDataUrl(
  file: File,
  { maxDim = 512, maxBytes = 700_000 }: CompressImageOptions = {},
): Promise<string> {
  const source = await readFileAsDataUrl(file);
  if (file.size <= maxBytes) {
    return source;
  }

  const img = await loadImage(source);
  const base = document.createElement("canvas");
  base.width = img.naturalWidth || img.width;
  base.height = img.naturalHeight || img.height;
  base.getContext("2d")?.drawImage(img, 0, 0);

  const formats = supportsWebp()
    ? ["image/webp", "image/jpeg", "image/png"]
    : ["image/jpeg", "image/png"];

  let best: string | null = null;

  const dims = [maxDim, ...DIMENSION_STEPS.filter((step) => step < maxDim)];

  for (const dim of dims) {
    const scaled = scaleTo(base, dim);
    for (const mime of formats) {
      const withBackground =
        mime === "image/jpeg" ? flattenOnWhite(scaled) : scaled;
      for (const quality of QUALITY_STEPS) {
        const url = withBackground.toDataURL(mime, quality);
        if (!best || estimateDataUrlBytes(url) < estimateDataUrlBytes(best)) {
          best = url;
        }
        if (estimateDataUrlBytes(url) <= maxBytes) {
          return url;
        }
      }
    }
  }

  return best ?? source;
}

function flattenOnWhite(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const out = document.createElement("canvas");
  out.width = canvas.width;
  out.height = canvas.height;
  const ctx = out.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, out.width, out.height);
    ctx.drawImage(canvas, 0, 0);
  }
  return out;
}