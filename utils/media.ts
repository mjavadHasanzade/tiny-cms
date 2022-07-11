export const size = {
  xsm: "350px",
  sm: "480px",
  smH: "660px",
  xsH: "550px",
  md: "800px",
  reg: "900px", // regular !!!
  lg: "1280px",
  xl: "1440px",
  xxl: "1600px",
};

export const media = {
  sm: `(min-width: ${size.sm})`,
  maxSm: `(max-width: ${size.sm})`,
  maxEsm: `(max-width: ${size.xsm})`,
  md: `(min-width: ${size.md})`,
  lg: `(min-width: ${size.lg})`,
  reg: `(min-width: ${size.reg})`,
  maxLg: `(max-width: ${size.lg})`,
  xl: `(min-width: ${size.xl})`,
  xxl: `(min-width: ${size.xxl})`,
  smH: `(max-height: ${size.smH})`,
  xsH: `(max-height: ${size.xsH})`,
  mdH: `(max-height: ${size.md})`,
  regH: `(max-height: ${size.reg})`,
  betweenNormalLaptops: `screen, (min-width: ${size.lg}) and (max-width: ${size.xl})`,
  betweenMobTablet: `only screen and (min-width: ${size.sm}) and (max-width: ${size.reg})`,
  betweenTabletNormalLaptop: `only screen and (min-width: ${size.reg}) and (max-width: 1024px)`,
  biggerThanNormal: `(min-width: ${size.xl})`,
};

export const minMaxGenerator = (min: number, max: number) => {
  return `only screen and (min-width: ${min}px) and (max-width: ${max}px)`;
};
