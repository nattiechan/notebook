describe('Homepage', () => {
  const EXPECTED_TOTAL_ORDERS = 5;

  it('loads successfully', () => {
    cy.intercept('/orders').as('getAllOrders');

    cy.visit('http://localhost:8080/');
    cy.wait('@getAllOrders');
    cy.get('#searchBars').should('be.visible');
    cy.get('[data-test-id="results"]')
      .children()
      .should('have.length', EXPECTED_TOTAL_ORDERS);
  });

  it('successful search yields correct results', () => {
    cy.intercept('/orders', { fixture: 'allOrders' }).as('getAllOrders');
    cy.intercept('/orders/name*').as('getSearchResult');

    cy.visit('http://localhost:8080/');
    cy.wait('@getAllOrders');
    cy.get('#firstName').type('Joe');
    cy.get('input[type="submit"]').click();
    cy.wait('@getSearchResult');
    cy.get('[data-test-id="results"]').children().should('have.length', 1);
    cy.get('#firstName').clear();
    cy.get('[data-test-id="results"]')
      .children()
      .should('have.length', EXPECTED_TOTAL_ORDERS);
  });

  it('Clearing search bar returns all orders', () => {
    cy.intercept('/orders', { fixture: 'allOrders' }).as('getAllOrders');
    cy.intercept('/orders/name*', { fixture: 'joeSmith' }).as('getSearchResult');

    cy.visit('http://localhost:8080/');
    cy.wait('@getAllOrders');
    cy.get('#firstName').type('Joe');
    cy.get('input[type="submit"]').click();
    cy.wait('@getSearchResult');
    cy.get('#firstName').clear();
    cy.get('[data-test-id="results"]')
      .children()
      .should('have.length', EXPECTED_TOTAL_ORDERS);
  });

  it('alert is visible upon unsuccessful result', () => {
    cy.intercept('/orders', { fixture: 'allOrders' }).as('getAllOrders');
    cy.intercept('/orders/name*', { statusCode: 500 }).as('getSearchResult');

    cy.visit('http://localhost:8080/');
    cy.wait('@getAllOrders');
    cy.get('#searchBars').should('be.visible');
    cy.get('#firstName').type('Foo');
    cy.get('input[type="submit"]').click();
    cy.wait('@getSearchResult');
    cy.get('[data-test-id="results"]')
      .children()
      .should('have.length', EXPECTED_TOTAL_ORDERS);
    cy.get('#no-result').should('be.visible');
  });

  it('alert is visible upon empty search strings', () => {
    // We show the alert and not make any request
    // if the search boxes are empty and users click submit
    // So we do not need to stub the call here
    cy.intercept('/orders', { fixture: 'allOrders' }).as('getAllOrders');

    cy.visit('http://localhost:8080/');
    cy.wait('@getAllOrders');
    cy.get('#searchBars').should('be.visible');
    cy.get('input[type="submit"]').click();
    cy.get('[data-test-id="results"]')
      .children()
      .should('have.length', EXPECTED_TOTAL_ORDERS);
    cy.get('#no-input').should('be.visible');
  })
})
