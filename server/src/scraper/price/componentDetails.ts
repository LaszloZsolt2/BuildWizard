import axios from "axios";
import * as cheerio from "cheerio";
import { ComponentWebshopDetails, WebshopDetails } from "../../types/webshop";

export function getComponentDetails(url: string) {
  if (!url || !url.length) {
    return Promise.reject("URL is required");
  }

  let results: ComponentWebshopDetails = {
    offers: [],
  };

  return axios
    .get(url)
    .then((response) => {
      const $ = cheerio.load(response.data);

      let details: ComponentWebshopDetails = {
        offers: [],
      };

      details.componentImage = $(".product-image-wrapper img").attr("src");

      $(".optoffer").each((index, element) => {
        const content = $(element).html();
        if (content) {
          let offer: WebshopDetails = {};
          const $ = cheerio.load(content);

          offer.price = parseFloat(
            $(".row-price span").text().replace(",", ".").replace(" ", "")
          );

          if (isNaN(offer.price)) {
            return;
          }

          offer.logo = $(".col-logo img").attr("src");
          if (!offer.logo) {
            offer.logo = $(".col-logo img").attr("data-lazy-src");
          }

          offer.shop = $(".shopname").text().trim();

          offer.url = $(".jumplink-overlay").attr("href");

          details.offers.push(offer);
        }
      });

      details.offers.sort((a, b) => (a.price || 0) - (b.price || 0));
      return details;
    })
    .catch((error) => {
      console.error(`Error fetching data: ${error.message}`);
      return [];
    });
}
