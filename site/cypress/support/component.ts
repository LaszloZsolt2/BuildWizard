// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

import { mount } from "cypress/vue"; // Import mount function for Vue

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount; // Extend Cypress with the mount function
    }
  }
}

Cypress.Commands.add("mount", mount); // Add custom mount command to Cypress

/* Add any global components */
// options.global.components['Button'] = Button;

// Example use:
// cy.mount(MyComponent)
