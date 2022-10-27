/// <reference types="cypress"/>

describe('Hacker Stories', () => {
  beforeEach(() => {
    
    const termo = 'React';

    cy.visit('/')

    cy.intercept(
      'GET',
      `**/search?query=${termo}&page=0`
    )
  })

  it('mostra o rodapé', () => {
    cy.get('footer')
      .should('be.visible')
      .and('contain', 'Icons made by Freepik from www.flaticon.com')
  });

  context('Lista de histórias', () => {
    // Since the API is external,
    // I can't control what it will provide to the frontend,
    // and so, how can I assert on the data?
    // This is why this test is being skipped.
    // TODO: Find a way to test it out.
    it.skip('mostra os dados corretos para todas as histórias renderizadas', () => {})

    it('mostra 20 histórias, depois as próximas 20 depois de clicar em "Mais"', () => {
      cy.get('.item').should('have.length', 20)

      cy.contains('More').click()

      cy.assertLoadingIsShownAndHidden()

      cy.get('.item').should('have.length', 40)
    })

    it('mostra apenas dezenove histórias depois de descartar a primeira história', () => {
      cy.get('.button-small')
        .first()
        .click()

      cy.get('.item').should('have.length', 19)
    })

    // Since the API is external,
    // I can't control what it will provide to the frontend,
    // and so, how can I test ordering?
    // This is why these tests are being skipped.
    // TODO: Find a way to test them out.
    context.skip('Ordenar por', () => {
      it('orders by title', () => {})

      it('orders by author', () => {})

      it('orders by comments', () => {})

      it('orders by points', () => {})
    })

    // Hrm, how would I simulate such errors?
    // Since I still don't know, the tests are being skipped.
    // TODO: Find a way to test them out.
    context.skip('Errors', () => {
      it('mostra "Algo deu errado ..." em caso de erro do servidor', () => {})

      it('mostra "Algo deu errado ..." em caso de erro de rede', () => {})
    })
  })

  context('Search', () => {
    const initialTerm = 'React'
    const newTerm = 'Cypress'

    beforeEach(() => {
      cy.get('#search')
        .clear()
    })

    it('digita e aperta ENTER', () => {
      cy.get('#search')
        .type(`${newTerm}{enter}`)

      cy.assertLoadingIsShownAndHidden()

      cy.get('.item').should('have.length', 20)
      cy.get('.item')
        .first()
        .should('contain', newTerm)
      cy.get(`button:contains(${initialTerm})`)
        .should('be.visible')
    })

    it('digita e clica no botão enviar', () => {
      cy.get('#search')
        .type(newTerm)
      cy.contains('Submit')
        .click()

      cy.assertLoadingIsShownAndHidden()

      cy.get('.item').should('have.length', 20)
      cy.get('.item')
        .first()
        .should('contain', newTerm)
      cy.get(`button:contains(${initialTerm})`)
        .should('be.visible')
    })

    context('Últimas pesquisas', () => {
      it('searches via the last searched term', () => {
        cy.get('#search')
          .type(`${newTerm}{enter}`)

        cy.assertLoadingIsShownAndHidden()

        cy.get(`button:contains(${initialTerm})`)
          .should('be.visible')
          .click()

        cy.assertLoadingIsShownAndHidden()

        cy.get('.item').should('have.length', 20)
        cy.get('.item')
          .first()
          .should('contain', initialTerm)
        cy.get(`button:contains(${newTerm})`)
          .should('be.visible')
      })

      it('mostra um máximo de 5 botões para os últimos termos pesquisados', () => {
        const faker = require('faker')

        Cypress._.times(6, () => {
          cy.get('#search')
            .clear()
            .type(`${faker.random.word()}{enter}`)
        })

        cy.assertLoadingIsShownAndHidden()

        cy.get('.last-searches button')
          .should('have.length', 5)
      })
    })
  })
})