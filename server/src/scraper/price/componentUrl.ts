import axios from "axios";
import * as cheerio from "cheerio";

export function getComponentUrl(query: string, categories: string[]) {
  return axios
    .get(
      `https://www.compari.ro/CategorySearch.php?st=${encodeURIComponent(
        query
      )}`
    )
    .then((response) => {
      const $ = cheerio.load(response.data);
      let links: string[] = [];

      $(".product-box-container a").each((index, element) => {
        const link = $(element).attr("href");
        if (link) {
          links.push(link);
        }
      });

      // remove duplicates
      links = [...new Set(links)];
      links = links.filter(
        (link) =>
          link !== "#" && categories.some((category) => link.includes(category))
      );

      return links[0];
    })
    .catch((error) => {
      console.error(`Error fetching data: ${error.message}`);
    });
}
