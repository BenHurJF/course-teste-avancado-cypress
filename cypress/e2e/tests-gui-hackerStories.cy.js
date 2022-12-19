/// <reference types="cypress"/>

describe('Hacker Stories', () => {
  const initialTerm = 'React';
  const newTerm = 'Cypress';

  context('Batendo na API Real', () => {

    beforeEach(() => {
      cy.intercept({
        method: 'GET',
        pathname: `**/search`,
        query: {
          query: initialTerm,
          page: '0'
        }
      }
      ).as('buscaInitialTerm')

      cy.visit('/')
    });

    it('Mostra 20 histórias, depois as próximas 20 depois de clicar em "Mais"', () => {
      cy.intercept({
        method: 'GET',
        pathname: `**/*search`,
        query: {
          query: initialTerm,
          page: '1'
        }
      }
      ).as('proximasStories')

      cy.get('.item').should('have.length', 20)
        .and('not.have.length.above', 20)

      cy.contains('More').click()

      cy.wait('@proximasStories').then(({ response }) => {
        expect(response.body.hits).to.have.length(20)
      })

      cy.get('.item').should('have.lengthOf.above', 35)
      cy.get('.item').should('have.length', 40)
    })

    it('pesquisas através do último termo pesquisado', () => {
      cy.intercept({
        method: 'GET',
        pathname: `**/*search`,
        query: {
          query: newTerm,
          page: '0'
        }
      }
      ).as('buscaNewTerm')

      cy.get('#search').clear()
        .type(`${newTerm}{enter}`)

      cy.wait('@buscaNewTerm')

      cy.get(`button:contains(${initialTerm})`)
        .should('be.visible')
        .click({ force: true })

      cy.wait('@buscaInitialTerm')

      cy.get('.item').should('have.length', 20)

      cy.get('.item').eq(1)
        .contains(initialTerm)

      cy.get(`button:contains(${newTerm})`)
        .should('be.visible')

      // cy.window().its('localStorage').then((sessao) => {
      //   console.log(sessao)
    });
  })

  context('Mockando a API', () => {
    context('Rodapé e Lista de histórias', () => {
      beforeEach(() => {
        cy.intercept(
          'GET',
          `**/search?query=${initialTerm}&page=0`,
          { fixture: 'stories' }
          ).as('buscaInitialTerm')
    
        cy.visit('/')
        cy.wait('@buscaInitialTerm')
      });

    it('Mostrar o rodapé', () => {
      cy.get('footer')
        .should('be.visible')
        .and('contain', 'Icons made by Freepik from www.flaticon.com')
    });
  
    context('Lista de histórias', () => {
      it.skip('mostra os dados corretos para todas as histórias renderizadas', () => { })
  
      it('Descartar 1 história e exibir histórias com 1 a menos', () => {
        cy.get('.item')
          .children('span')
          .children('button').first()
          .click()
  
        cy.get('.item').should('have.length', 1)
      })
      context.skip('Ordenar por', () => {
        it('Ordenar por titulo', () => { })
  
        it('Ordenar por autor', () => { })
  
        it('Ordenar por comentarios', () => { })
  
        it('Ordenar por pontos', () => { })
      })
  
    })
  })
  
    // Contexto de its de Busca
    context('Search', () => {
      beforeEach(() => {
        cy.intercept(
          'GET',
          `**/*search?query=${initialTerm}&page=0`,
          { fixture: 'empty' }
        ).as('getEmptyStories')

        cy.intercept(
          'GET',
          `**/*search?query=${newTerm}&page=0`,
          { fixture: 'stories' }
        ).as('getStories')

        cy.visit('/')
        cy.wait('@getEmptyStories')
  
        cy.get('#search')
          .clear()
      })
  
      it('Digita e aperta ENTER', () => {
        cy.get('#search')
          .type(`${newTerm}{enter}`)
  
        cy.wait('@getStories')
  
        cy.get('.item').should('have.length', 2)
        cy.get(`button:contains(${initialTerm})`)
          .should('be.visible')
      })
  
      it('Digita e clica no botão enviar', () => {
        cy.get('#search')
          .type(newTerm)
        cy.contains('Submit')
          .click()
  
        cy.wait('@getStories')
  
        cy.get('.item').should('have.length', 2)
        cy.get(`button:contains(${initialTerm})`)
          .should('be.visible')
      })
  
  
      // Apenas demonstrativo, o usuário REAL não teria possibilidade de buscar o termo dando submite no FORM!
      it('Digita e envia o formulário diretamente (Apenas Demonstração)', () => {
        cy.get('#search')
          .type(newTerm)
        cy.get('form').submit()
  
        cy.get('@getStories')
  
        cy.get(`button:contains(${initialTerm})`)
          .should('be.visible');
      });
  
  
      // Contexto de its de Ultimas Pesquisas
      context('Últimas pesquisas', () => {
  
        it('Mostra um máximo de 5 botões para os últimos termos pesquisados', () => {
          cy.intercept(
            'GET',
            '**/search**',
            { fixture: 'empty' }
          ).as('buscarProximosTermosAleatorias')
  
          const faker = require('faker')
  
          Cypress._.times(6, () => {
            cy.get('#search')
              .clear()
              .type(`${faker.random.word()}{enter}`)
            cy.wait('@buscarProximosTermosAleatorias')
          });
  
          cy.get('.last-searches button')
            .should('have.length', 5)
        });
      });

  })
});

  context('Simulando Erros de Servidor e Rede', () => {
    const serverError = 'Something went wrong ..';
    const networkError = 'Something went wrong ...';

    it('Mostra "Algo deu errado ..." em caso de erro do servidor', () => {
      cy.intercept(
        'GET',
        '**/search**',
        { statusCode: 500 },
      ).as('serverFailure');

      cy.visit('/')

      cy.get('#search').clear({ force: true })
        .type('JMeter')
      cy.get('button:contains(Submit)').click()

      cy.wait('@serverFailure')

      cy.contains(serverError)
        .should('be.visible');
    })

    it('Mostra "Algo deu errado ..." em caso de erro de rede', () => {
      cy.intercept(
        'GET',
        '**/search**',
        { forceNetworkError: true },
      ).as('networkFailure');

      cy.visit('/')

      cy.get('#search').clear({ force: true })
        .type('COBOL')
      cy.get('button:contains(Submit)').click()

      cy.wait('@networkFailure')

      cy.contains(networkError)
        .should('be.visible');
    })
  })

});