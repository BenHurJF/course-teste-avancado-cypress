import 'cypress-localstorage-commands'

Cypress.Commands.add('assertLoadingIsShownAndHidden', () => {
  cy.contains('Loading ...').should('be.visible')
  cy.contains('Loading ...').should('not.exist')
})

Cypress.Commands.add('search', termSearch => {
  cy.get('input[type="text"]')
  .should('be.visible')
  .clear()
  .type(`${termSearch}`)
  cy.get('button:contains(Search)')
  .click()
  cy.ignorarExcecoesPage(`error`)
})

Cypress.Commands.add('ignorarExcecoesPage', (err) => {
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });
})
