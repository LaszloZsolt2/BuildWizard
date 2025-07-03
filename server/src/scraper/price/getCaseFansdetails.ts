import puppeteer from "puppeteer";

interface WebshopOffer {
  price: number;
  shop: string;
  url: string;
  logo?: string;
}

interface ComponentDetails {
  componentImage?: string;
  offers: WebshopOffer[];
}

export async function getCaseFanDetails(
  url: string
): Promise<ComponentDetails> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "networkidle2" });

    await page.waitForSelector(".product-image img", { timeout: 8000 });

    await new Promise((r) => setTimeout(r, 2000));

    await page.waitForSelector(".product-gallery img", { timeout: 10000 });
    const componentImage = await page.$eval(
      ".product-gallery img",
      (img) => img.src
    );

    const offers: WebshopOffer[] = await page.$$eval(
      ".optoffer",
      (elements) => {
        return elements
          .map((el) => {
            const priceText =
              el.querySelector(".row-price span")?.textContent || "";

            const price = parseFloat(
              priceText.replace(",", ".").replace(/\s/g, "")
            );

            const shop =
              el.querySelector(".shopname")?.textContent?.trim() || "";
            const url =
              el.querySelector(".jumplink-overlay")?.getAttribute("href") || "";
            const logo =
              el.querySelector(".col-logo img")?.getAttribute("src") ||
              el
                .querySelector(".col-logo img")
                ?.getAttribute("data-lazy-src") ||
              "";

            return { price, shop, url, logo };
          })
          .filter((offer) => !isNaN(offer.price));
      }
    );

    await browser.close();

    return {
      componentImage,
      offers: offers.sort((a, b) => a.price - b.price),
    };
  } catch (error) {
    await browser.close();
    console.error("Error fetching component details:", error);
    return { offers: [] };
  }
}

(async () => {
  const url = "https://ventilator-carcasa-pc.compari.ro";
  const details = await getCaseFanDetails(url);
  console.log("Termékkép:", details.componentImage);
  console.log("Ajánlatok:");
  details.offers.forEach((offer) => {
    console.log(`${offer.shop}: ${offer.price} EUR - ${offer.url}`);
  });
})();
