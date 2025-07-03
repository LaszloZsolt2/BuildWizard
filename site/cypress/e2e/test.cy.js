describe("Testing", () => {
  it("Operations", () => {
    cy.visit("http://localhost:5173/buildwizard/");
    cy.wait(1000);

    //1. Find Motherboard button
    cy.contains("Motherboard")
      .should("exist")
      .scrollIntoView({ duration: 1500, block: "center" })
      .should("be.visible")
      .click();

    //2. Checking the URL
    cy.url().should("include", "motherboard");
    cy.get("table").should("be.visible");

    // Checking that at least one component appears in the table
    cy.get("table tbody tr", { timeout: 10000 }).should(
      "have.length.greaterThan",
      0
    );

    // 3. Scroll down and click Next, then Back
    cy.scrollTo("bottom", { duration: 800 });
    cy.contains("Next").should("be.visible").click();
    cy.wait(1000);
    cy.scrollTo("bottom", { duration: 800 });
    cy.contains("Back").should("be.visible").click();
    cy.wait(1000);

    // Scroll back to the top
    cy.scrollTo("top", { duration: 1000 });

    const kijeloltNevek = [];

    //4. Select the table checkboxes based on an array
    const kijelolendoSorok = [1, 2, 4, 5, 7];

    kijelolendoSorok.forEach((index, i) => {
      cy.get("table tbody tr")
        .eq(index)
        .find('input[type="checkbox"]')
        .check({ force: true });

      cy.wait(500);

      // Check: checkbox is selected
      cy.get("table tbody tr")
        .eq(index)
        .find(".p-checkbox")
        .should("have.class", "p-checkbox-checked");

      // Store the component name (3rd column - index 2)
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

      // If we are at the second checkbox, check whether the Compare button is visible
      if (i === 1) {
        cy.contains("button", "Compare").should("be.visible");
      }
    });

    //5. Try selecting one more item that exceeds the selection limit
    cy.wait(500);
    cy.get("table tbody tr")
      .eq(9)
      .find('input[type="checkbox"]')
      .check({ force: true });

    //6. Check if the "Selection Limit" message appeared (e.g. dialog)
    cy.contains("Selection Limit").should("be.visible");
    cy.wait(1000);
    // Close the dialog using the X button
    cy.get("button.p-dialog-close-button").click();
    cy.wait(1000);

    //7. Click the Compare button
    cy.wait(1000);
    cy.contains("button", "Compare").should("be.visible").click();

    //8. Wait for the page to load and for the cards to appear
    cy.url().should("include", "/compare");
    cy.get(".bg-neutral-700", { timeout: 10000 }).should(
      "have.length.at.least",
      1
    );

    //9. Compare the selected components with the names on the cards
    cy.get(".bg-neutral-700 h2").then(($cards) => {
      const cardNames = [...$cards].map((el) => el.textContent?.trim());

      kijeloltNevek.forEach((nev) => {
        expect(cardNames).to.include(nev);
      });
    });

    //10. Check the color of the values on the cards based on min/max
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
                      `${labelName} (${value}): Elvárt szín: ${expectedClass}, actual color: ${actualClass}`
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

    //11. Store the name of the 2nd card before clicking the Add button
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

        cy.log(`Name of the component clicked via the Add button: ${nev}`);

        // Click the Add button
        cy.get(".bg-neutral-700")
          .eq(1)
          .within(() => {
            cy.contains("button", "Add").should("be.visible").click();
          });
        // After returning, check that the URL is /buildwizard
        cy.url({ timeout: 10000 }).should("include", "/buildwizard");

        // Wait a moment for the page to load
        cy.wait(2000);

        // Check that the name is present in the 'Motherboards' row of the table
        cy.get("table").should("be.visible");

        // Find the corresponding row based on the name
        cy.get("table tbody tr")
          .contains("td", nev)
          .should("exist")
          .and("be.visible");
      });

    //12. Check that the name is also present in localStorage
    cy.get("@motherboardNev").then((expectedNev) => {
      cy.window().then((win) => {
        const stored = win.localStorage.getItem("selectedComponents");

        expect(stored).to.not.be.null;

        const parsed = JSON.parse(stored);

        // Check if it contains the "motherboards" key and if the name matches
        expect(parsed).to.have.property("motherboards");
        expect(parsed.motherboards).to.have.property("name", expectedNev);
        cy.log("Motherboard name in localStorage:", parsed.motherboards.name);
      });
    });

    cy.wait(1500);

    //Memory

    //1. Scroll down to the expected position of the Memory button
    cy.scrollTo("center", 1500, { duration: 1000 });

    //2. Click the Memory button
    cy.get('a[href*="type=memories"]')
      .should("be.visible")
      .click({ force: true });

    cy.wait(1000);

    //3. Check: URL and table
    cy.url().should("include", "memories");
    cy.get("table").should("be.visible");
    cy.get("table tbody tr", { timeout: 10000 }).should(
      "have.length.greaterThan",
      0
    );
    //4. Search for the name
    cy.get('input[placeholder*="Search"]')
      .should("be.visible")
      .clear()
      .type("Silicon Power GAMING 16 GB");

    cy.wait(1000);

    //5. Check that the result is displayed
    cy.get("table tbody tr").should(
      "contain.text",
      "Silicon Power GAMING 16 GB"
    );

    //6. Find the correct row in the table and click the Add button

    cy.get("button").contains("Add").first().click({ force: true });

    //7. Check whether it redirects to the homepage

    cy.url().should("eq", "http://localhost:5173/buildwizard/");

    cy.wait(1500);

    //Cpu

    //1. Scroll down to the expected position of the CPU button
    cy.scrollTo("center", 800, { duration: 1000 });
    // Now locate and click the CPU button
    cy.get('a[href*="type=cpus"]').should("be.visible").click({ force: true });

    //2. Check: URL and table
    cy.url().should("include", "cpu");
    cy.get("table").should("be.visible");
    cy.get("table tbody tr", { timeout: 10000 }).should(
      "have.length.greaterThan",
      0
    );

    // 3. Scroll down and click Next twice
    cy.scrollTo("bottom", { duration: 800 });
    cy.contains("Next").should("be.visible").click();
    cy.wait(1000);
    cy.scrollTo("bottom", { duration: 800 });
    cy.contains("Next").should("be.visible").click();
    cy.wait(1000);

    // 4. Click the Add button
    cy.get("table tbody tr")
      .eq(2)
      .then(($row) => {
        const cpuNev = $row.find("td").eq(2).text().trim();
        cy.wrap(cpuNev).as("hozzaadottCpuNev");
        cy.scrollTo("right", { duration: 1000 });
        cy.wrap($row).find("button").contains("Add").click({ force: true });
      });

    // 5. Check whether it redirects to the homepage
    cy.url().should("eq", "http://localhost:5173/buildwizard/");

    // 6. Check CPU name
    cy.get("@hozzaadottCpuNev").then((cpuNev) => {
      cy.log("Verified CPU name:", cpuNev);
      expect(cpuNev).to.not.be.empty;

      cy.contains("table", "CPU")
        .should("be.visible")
        .within(() => {
          cy.contains("td", cpuNev).should("exist");
        });
    });

    // 7. Check that total price and total power consumption are displayed
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

    // 8. Find and click the Delete button
    cy.get("@hozzaadottCpuNev").then((cpuNev) => {
      cy.contains("table", "CPU")
        .should("be.visible")
        .within(() => {
          // Select the correct row based on the CPU name
          cy.contains("td", cpuNev)
            .parent()
            .find("button[aria-label='Delete']")
            .click({ force: true });
          // Check that the CPU is no longer in the table
          cy.contains("td", cpuNev).should("not.exist");
        });
    });

    cy.wait(1000);

    // 9. Search for Elden Ring + click on the result + click the Build button

    // Type "Elden Ring" into the search bar
    cy.get('input[placeholder="Search..."]')
      .should("be.visible")
      .clear()
      .type("Elden Ring");

    cy.wait(500);

    // Wait for the search result list to appear
    cy.get('ul[role="listbox"]', { timeout: 8000 }).should("be.visible");

    // Find and click on the "Elden Ring" result
    cy.get('ul[role="listbox"] li')
      .contains("Elden Ring")
      .should("be.visible")
      .click({ force: true });

    cy.wait(1000);

    // Build button click
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

    // 10. Check the build cards
    // Check that at least 3 cards are displayed
    cy.get(".bg-neutral-800.bg-opacity-70")
      .should("have.length", 3)
      .then(($cards) => {
        // Extract component names from the third card
        const selectedCard = $cards.eq(2);
        const partNames = [];
        selectedCard.find("p.text-white").each((index, element) => {
          const text = Cypress.$(element).text().trim();
          if (text.length > 0) {
            partNames.push(text);
          }
        });

        // Click on the third card
        cy.wrap(selectedCard).click({ force: true });

        cy.wait(3000);

        // Accept the build
        cy.contains("button", "Accept build")
          .should("be.visible")
          .click({ force: true });

        cy.wait(2000);

        // Check that the component names on the cards appear in the table
        partNames.forEach((partName) => {
          cy.get("table tbody tr td:nth-child(2)").should(
            "contain.text",
            partName
          );
        });
      });

    let totalFromTable = 0;
    let totalPriceFromSummary = 0;

    // 11. Collect and sum the prices listed in the table
    cy.get("table tbody tr td:nth-child(3)")
      .each(($cell) => {
        const priceText = $cell.text().trim();
        const price = parseFloat(priceText.replace(/[^0-9.]/g, ""));
        if (!isNaN(price)) {
          totalFromTable += price;
        }
      })
      .then(() => {
        cy.log("Summed prices from the table:", totalFromTable);

        // Retrieve the Total price value
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

            cy.log("Value of the Total price field:", totalPriceFromSummary);

            // Check: if it doesn't match, show a warning
            const difference = Math.abs(totalFromTable - totalPriceFromSummary);

            if (difference > 0.01) {
              cy.log(
                `Warning: The summed prices (${totalFromTable}) and the Total price (${totalPriceFromSummary}) do not match.`
              );
            } else {
              cy.log("The prices match correctly.");
            }
          });
      });
  });
});
