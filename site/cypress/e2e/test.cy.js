describe("Tesztelések", () => {
  it(" Muveletek", () => {
    cy.visit("http://localhost:5173/buildwizard/");
    cy.wait(1000);

    //1. Megkeressük a Motherboard gombot
    cy.contains("Motherboard")
      .should("exist")
      .scrollIntoView({ duration: 1500, block: "center" })
      .should("be.visible")
      .click();

    //2. Ellenőrizzük az URL-t
    cy.url().should("include", "motherboard");
    cy.get("table").should("be.visible");

    // Ellenőrizzük, hogy megjelent legalább 1 alkatrész a táblázatban
    cy.get("table tbody tr", { timeout: 10000 }).should(
      "have.length.greaterThan",
      0
    );

    // 3. Scroll le és Next, majd Back
    cy.scrollTo("bottom", { duration: 800 });
    cy.contains("Next").should("be.visible").click();
    cy.wait(1000);
    cy.scrollTo("bottom", { duration: 800 });
    cy.contains("Back").should("be.visible").click();
    cy.wait(1000);

    // Scroll vissza a tetejére
    cy.scrollTo("top", { duration: 1000 });

    const kijeloltNevek = [];

    //4. A táblázat checkboxait tömb alapján kijelöljük
    const kijelolendoSorok = [1, 2, 4, 5, 7];

    kijelolendoSorok.forEach((index, i) => {
      cy.get("table tbody tr")
        .eq(index)
        .find('input[type="checkbox"]')
        .check({ force: true });

      cy.wait(500);

      // Ellenőrzés: checkbox bejelölve
      cy.get("table tbody tr")
        .eq(index)
        .find(".p-checkbox")
        .should("have.class", "p-checkbox-checked");

      // Alkatrész nevének eltárolása (3. oszlop - index 2)
      cy.get("table tbody tr")
        .eq(index)
        .find("td")
        .eq(2)
        .invoke("text")
        .then((text) => {
          const nev = text.trim();
          kijeloltNevek.push(nev);

          cy.log(`Eltárolt név: ${nev}`);
        });

      // Ha a második checkboxnál járunk, ellenőrizzük a Compare gomb megjelent-e
      if (i === 1) {
        cy.contains("button", "Compare").should("be.visible");
      }
    });

    //5. Próbáljunk meg egy újabbat bejelölni , ami túlmegy a kijelölési limiten
    cy.wait(500);
    cy.get("table tbody tr")
      .eq(9)
      .find('input[type="checkbox"]')
      .check({ force: true });

    //6. Ellenőrizzük, hogy megjelent-e a "Selection Limit" üzenet (pl. dialógus)
    cy.contains("Selection Limit").should("be.visible");
    cy.wait(1000);
    // Zárjuk be az X gombbal a dialógust
    cy.get("button.p-dialog-close-button").click();
    cy.wait(1000);

    //7. Kattintunk a Compare gombra
    cy.wait(1000);
    cy.contains("button", "Compare").should("be.visible").click();

    //8. Várjuk meg, míg betölt az oldal és a kártyák megjelennek
    cy.url().should("include", "/compare");
    cy.get(".bg-neutral-700", { timeout: 10000 }).should(
      "have.length.at.least",
      1
    );

    //9. Kijelölt alkatrészek összehasonlítása a kártyákon lévő nevekkel
    cy.get(".bg-neutral-700 h2").then(($cards) => {
      const cardNames = [...$cards].map((el) => el.textContent?.trim());

      kijeloltNevek.forEach((nev) => {
        expect(cardNames).to.include(nev);
      });
    });

    //10. Ellenőrizzük a kártyákon lévő értékek színét min max alapján
    cy.get(".bg-neutral-700").then(($cards) => {
      const ellenorizSzineketSzamAlapjan = (labelRegex, labelName) => {
        const ertekek = [];

        $cards.each((i, card) => {
          const labelElem = Array.from(card.querySelectorAll("*")).find((el) =>
            el.textContent.match(labelRegex)
          );

          if (labelElem) {
            const match = labelElem.textContent.match(labelRegex);
            if (match) {
              const value = parseInt(match[1]);
              ertekek.push({ index: i, value });
            }
          }
        });

        const szamok = ertekek.map((e) => e.value);
        const min = Math.min(...szamok);
        const max = Math.max(...szamok);

        ertekek.forEach(({ index, value }) => {
          const expectedClass =
            value === max
              ? "text-green-400"
              : value === min
              ? "text-red-600"
              : "text-orange-400";

          cy.get(".bg-neutral-700")
            .eq(index)
            .within(() => {
              cy.contains(labelName)
                .parent()
                .within(() => {
                  cy.get("span").then(($elem) => {
                    const actualClass = $elem.attr("class") || "";
                    cy.log(
                      `${labelName} (${value}): Elvárt szín: ${expectedClass}, tényleges szín: ${actualClass}`
                    );
                    const classes = (actualClass || "").split(" ");
                    const foundColor = classes.find((cls) =>
                      [
                        "text-green-400",
                        "text-red-600",
                        "text-orange-400",
                      ].includes(cls)
                    );
                    expect(foundColor).to.equal(expectedClass);
                  });
                });
            });
        });
      };

      ellenorizSzineketSzamAlapjan(/Max Memory.*?(\d+)\s*GB/i, "Max Memory");
      ellenorizSzineketSzamAlapjan(/Memory Slots.*?(\d+)/i, "Memory Slots");
    });

    //11. A 2. kártya nevét eltároljuk, mielőtt rákattintunk az Add gombra
    cy.get(".bg-neutral-700")
      .eq(1)
      .find("h2")
      .invoke("text")
      .then((kivalasztottNev) => {
        const nev = kivalasztottNev.trim();
        cy.wrap(nev).as("motherboardNev");

        cy.window().then((win) => {
          win.localStorage.setItem(
            "selectedComponents",
            JSON.stringify({
              motherboards: { name: nev },
            })
          );
        });

        cy.log(`Add gombra kattintott alkatrész neve: ${nev}`);

        // Kattintunk az Add gombra
        cy.get(".bg-neutral-700")
          .eq(1)
          .within(() => {
            cy.contains("button", "Add").should("be.visible").click();
          });
        // Visszatérés után ellenőrzés, hogy az URL /buildwizard
        cy.url({ timeout: 10000 }).should("include", "/buildwizard");

        // Várunk kicsit, hogy betöltsön az oldal
        cy.wait(2000);

        // Ellenőrizzük, hogy a táblázat 'Motherboards' sorában benne van a név
        cy.get("table").should("be.visible");

        // A megfelelő sor keresése a név alapján
        cy.get("table tbody tr")
          .contains("td", nev)
          .should("exist")
          .and("be.visible");
      });

    //12. Ellenőrizzük, hogy a localStorage-ben is benne van a név
    cy.get("@motherboardNev").then((expectedNev) => {
      cy.window().then((win) => {
        const stored = win.localStorage.getItem("selectedComponents");

        expect(stored).to.not.be.null;

        const parsed = JSON.parse(stored);

        // Ellenőrizzük, hogy van-e benne "motherboards" kulcs, és egyezik-e a név
        expect(parsed).to.have.property("motherboards");
        expect(parsed.motherboards).to.have.property("name", expectedNev);
        cy.log("Motherboard név a localStorage-ben:", parsed.motherboards.name);
      });
    });

    cy.wait(1500);

    //Memory resz

    //1. Görgetés lefelé a Memory gomb várható helyére
    cy.scrollTo("center", 1500, { duration: 1000 });

    //2. Kattintás a Memory gombra
    cy.get('a[href*="type=memories"]')
      .should("be.visible")
      .click({ force: true });

    cy.wait(1000);

    //3. Ellenőrzés: URL és táblázat
    cy.url().should("include", "memories");
    cy.get("table").should("be.visible");
    cy.get("table tbody tr", { timeout: 10000 }).should(
      "have.length.greaterThan",
      0
    );
    //4. Keresés a névre
    cy.get('input[placeholder*="Search"]')
      .should("be.visible")
      .clear()
      .type("Silicon Power GAMING 16 GB");

    cy.wait(1000);

    //5. Ellenőrzés, hogy az eredmény megjelenik
    cy.get("table tbody tr").should(
      "contain.text",
      "Silicon Power GAMING 16 GB"
    );

    //6. A táblázatban a megfelelő sor keresése és az Add gombra kattintás

    cy.get("button").contains("Add").first().click({ force: true });

    //7. Ellenőrizzük, hogy visszairányít-e a főoldalra

    cy.url().should("eq", "http://localhost:5173/buildwizard/");

    cy.wait(1500);

    //Cpu resz

    //1. Görgetés lefelé a CPU gomb várható helyére
    cy.scrollTo("center", 800, { duration: 1000 });
    // Most megkeressük és kattintunk a CPU gombra
    cy.get('a[href*="type=cpus"]').should("be.visible").click({ force: true });

    //2. Ellenőrzés: URL és táblázat
    cy.url().should("include", "cpu");
    cy.get("table").should("be.visible");
    cy.get("table tbody tr", { timeout: 10000 }).should(
      "have.length.greaterThan",
      0
    );

    // 3. Scroll le és kétszer Next
    cy.scrollTo("bottom", { duration: 800 });
    cy.contains("Next").should("be.visible").click();
    cy.wait(1000);
    cy.scrollTo("bottom", { duration: 800 });
    cy.contains("Next").should("be.visible").click();
    cy.wait(1000);

    // 4. Kattintás az Add gombra
    cy.get("table tbody tr")
      .eq(2)
      .then(($row) => {
        const cpuNev = $row.find("td").eq(2).text().trim();
        cy.wrap(cpuNev).as("hozzaadottCpuNev");
        cy.scrollTo("right", { duration: 1000 });
        cy.wrap($row).find("button").contains("Add").click({ force: true });
      });

    // 5. Ellenőrizzük, hogy visszairányít-e a főoldalra
    cy.url().should("eq", "http://localhost:5173/buildwizard/");

    // 6. CPU név ellenőrzése
    cy.get("@hozzaadottCpuNev").then((cpuNev) => {
      cy.log("Ellenőrzött CPU név:", cpuNev);
      expect(cpuNev).to.not.be.empty;

      cy.contains("table", "CPU")
        .should("be.visible")
        .within(() => {
          cy.contains("td", cpuNev).should("exist");
        });
    });

    // 7. Ellenőrizzük hogy ír összárat és összfogyasztást
    cy.get("div")
      .contains("Total price")
      .should("be.visible")
      .parent()
      .within(() => {
        cy.get("span")
          .invoke("text")
          .then((priceText) => {
            cy.log("Total price:", priceText);
            expect(priceText.trim()).to.match(/[\d,.]+/);
          });
      });

    cy.get("div")
      .contains("Estimated wattage")
      .should("be.visible")
      .parent()
      .within(() => {
        cy.get("span")
          .invoke("text")
          .then((wattText) => {
            cy.log("Estimated wattage:", wattText);
            expect(wattText.trim()).to.match(/[\d,.]+/);
          });
      });

    cy.wait(1000);

    // 8. Törlés gomb keresése és kattintás
    cy.get("@hozzaadottCpuNev").then((cpuNev) => {
      cy.contains("table", "CPU")
        .should("be.visible")
        .within(() => {
          // Kiválasztjuk a megfelelő sort a CPU név alapján
          cy.contains("td", cpuNev)
            .parent()
            .find("button[aria-label='Delete']")
            .click({ force: true });
          // Ellenőrzés, hogy a CPU már nincs a táblázatban
          cy.contains("td", cpuNev).should("not.exist");
        });
    });

    cy.wait(1000);

    // 9. Elden Ring keresés + találatra kattintás + Build gombra kattintás

    // Beírjuk az "Elden Ring" szöveget a keresőbe
    cy.get('input[placeholder="Search..."]')
      .should("be.visible")
      .clear()
      .type("Elden Ring");

    cy.wait(500);

    // Megvárjuk, amíg a keresési lista megjelenik
    cy.get('ul[role="listbox"]', { timeout: 8000 }).should("be.visible");

    // Megkeressük és rákattintunk az "Elden Ring" találatra
    cy.get('ul[role="listbox"] li')
      .contains("Elden Ring")
      .should("be.visible")
      .click({ force: true });

    cy.wait(1000);

    // Build gomb kattintás
    cy.get("button")
      .filter((index, button) => {
        const hasSvg = button.querySelector("svg") !== null;
        const hasBuildText = Array.from(button.querySelectorAll("*")).some(
          (el) => el.textContent.trim() === "Build"
        );
        return hasSvg && hasBuildText;
      })
      .first()
      .should("be.visible")
      .click({ force: true });

    cy.wait(3000);

    // 10. Build kártyák ellenőrzése
    // Ellenőrizzük, hogy legalább 3 kártya megjelenik
    cy.get(".bg-neutral-800.bg-opacity-70")
      .should("have.length", 3)
      .then(($cards) => {
        // Harmadik kártya alkatrésznevek kinyerése
        const selectedCard = $cards.eq(2);
        const partNames = [];
        selectedCard.find("p.text-white").each((index, element) => {
          const text = Cypress.$(element).text().trim();
          if (text.length > 0) {
            partNames.push(text);
          }
        });

        // Kattintás a harmadik kártyára
        cy.wrap(selectedCard).click({ force: true });

        cy.wait(3000);

        // Elfogadjuk a buildet
        cy.contains("button", "Accept build")
          .should("be.visible")
          .click({ force: true });

        cy.wait(2000);

        // Ellenőrzés: A kártyákon lévő alkatrésznevek szerepelnek a táblázatban
        partNames.forEach((partName) => {
          cy.get("table tbody tr td:nth-child(2)").should(
            "contain.text",
            partName
          );
        });
      });

    let totalFromTable = 0;
    let totalPriceFromSummary = 0;

    // 11. Összegyűjtjük a táblázatban szereplő árakat és összeadjuk
    cy.get("table tbody tr td:nth-child(3)")
      .each(($cell) => {
        const priceText = $cell.text().trim();
        const price = parseFloat(priceText.replace(/[^0-9.]/g, ""));
        if (!isNaN(price)) {
          totalFromTable += price;
        }
      })
      .then(() => {
        cy.log("Összeadott árak a táblázatból:", totalFromTable);

        // Lekérjük a Total price értékét
        cy.get("div")
          .contains("Total price")
          .should("be.visible")
          .parent()
          .find("span")
          .invoke("text")
          .then((totalPriceText) => {
            totalPriceFromSummary = parseFloat(
              totalPriceText.replace(/[^0-9.]/g, "")
            );

            cy.log("Total price mező értéke:", totalPriceFromSummary);

            // Ellenőrzés: ha nem egyezik, figyelmeztessen
            const difference = Math.abs(totalFromTable - totalPriceFromSummary);

            if (difference > 0.01) {
              cy.log(
                `Figyelmeztetés: Az összeadott árak (${totalFromTable}) és a Total price (${totalPriceFromSummary}) nem egyeznek.`
              );
            } else {
              cy.log("Az árak rendben egyeznek.");
            }
          });
      });
  });
});
