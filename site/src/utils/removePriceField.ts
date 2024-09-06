export function removePriceField(components: any) {
  let c = components;
  for (const key in c) {
    if (c[key] && Array.isArray(c[key])) {
      c[key] = c[key].map((c: any) => {
        const { price_data, ...rest } = c;
        return rest;
      });
    } else if (c[key]) {
      const { price, ...rest } = c[key];
      c[key] = rest;
    }
  }
  return c;
}
