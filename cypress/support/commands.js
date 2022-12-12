import 'cypress-localstorage-commands'

Cypress.Commands.add('assertLoadingIsShownAndHidden', () => {
  cy.contains('Loading ...').should('be.visible')
  cy.contains('Loading ...').should('not.exist')
})

Cypress.Commands.add('ignorarExcecoesPage', () => {
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });
})
