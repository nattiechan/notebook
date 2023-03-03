describe('Homepage', () => {
  it('loads successfully', () => {
    cy.visit('http://localhost:8080/');
    cy.get('#searchBars').should('be.visible')
    cy.get('#firstName').type('Joe')
  })
})
