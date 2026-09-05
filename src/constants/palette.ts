export const palette = {
  orange: "#fb8a1e",
  blue: {
    deep: "#0231b7",
    strong: "#023fcd",
    royal: "#1846b3",
    bright: "#095cea",
    light: "#147afa",
  },
} as const;

export const gradients = {
  blue: `linear-gradient(135deg, ${palette.blue.deep} 0%, ${palette.blue.bright} 100%)`,
  blueLight: `linear-gradient(135deg, ${palette.blue.bright} 0%, ${palette.blue.light} 100%)`,
  orange: `linear-gradient(135deg, ${palette.orange} 0%, #fbaa1e 100%)`,
  brand: `linear-gradient(135deg, ${palette.blue.bright} 0%, ${palette.orange} 100%)`,
} as const;
