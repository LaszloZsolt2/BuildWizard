export function buildQueryParams(ids: string[], components: any): string {
  const queryString: string[] = [];

  ids.forEach((id) => queryString.push(`ids[]=${encodeURIComponent(id)}`));

  function appendNestedParams(params: any, parentKey: string): void {
    for (const [key, value] of Object.entries(params)) {
      const encodedKey = `${parentKey}[${key}]`;
      if (typeof value === "object" && value !== null) {
        appendNestedParams(value, encodedKey);
      } else {
        queryString.push(
          `${encodedKey}=${encodeURIComponent(value as string)}`
        );
      }
    }
  }

  appendNestedParams(components, "components");

  return queryString.join("&");
}
