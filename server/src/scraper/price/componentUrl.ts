import axios from "axios";
import * as cheerio from "cheerio";

export function getComponentUrl(query: string) {
  return axios
    .get(
      `https://www.compari.ro/CategorySearch.php?st=${encodeURIComponent(query)}`
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

      // remove empty hrefs
      links = links.filter((link) => link !== "#");

      const excludedSubstrings = [
        "Jump.php",
        "sisteme-desktop",
        "jocuri-pc",
        "notebook-laptop",
        "nas-drive",
        "ochelari-vr",
        "sistem-pos",
        "placa-de-captura",
        "hrana-pentru-caini",
        "stergatoare",
        "telefoane-mobile",
        "hard-disk-extern",
        "routere",
        "casca-schi",
      ];

      links = links.filter(
        (link) =>
          !excludedSubstrings.some((substring) => link.includes(substring))
      );

      return links[0];
    })
    .catch((error) => {
      console.error(`Error fetching data: ${error.message}`);
    });
}
