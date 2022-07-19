/// <reference types="cypress" />

describe('Testes autentication', () => {
   it.skip('autentication-testes', () => {
      cy.request({
         method: 'POST',
         url: 'https://api.integracommerce.com.br/api/Category/',
         headers: {
            Authorization: `Basic YXBpLnZpcGNvbW1lcmNlOkc3JCVDUDlec0VOV14mMVIqcHJn`,
         },
         //  {Username: 'api.vipcommerce', Password: 'G7$%CP9^sENW^&1R*prg'},
         body: [{
            "id": "933",
            "name": "category_test",
            "parentId": ""
         }],
      }).then((response) => {
         expect(response.status).have.property('token', '')
      });

   })

   // const faker = require('faker')
   // const DATA = {
   //    email: faker.internet.email(),
   //    senha: faker.internet.password()
   // }
   const DATA = require('../fixtures/teste')



   DATA.forEach((item, index) => {
   it.only(`${index + 1}, testes forEach`, () => {

      cy.visit('https://bugbank.netlify.app/')

      cy.contains('h1', 'O banco com bugs e falhas do seu jeito');

      cy.log('Testando 5 vezes inserção de login e senha e tentando acessar com dados aleatórios')

     const text = Cypress._.repeat('1234567890', 10)
     const reviewTextLimmit = text.substring(0, 100)

     cy.log(`Qntd carácteres: ${text}`)
     cy.log(`qntd carácteres inseridos de fato: ${reviewTextLimmit}`)

     cy.get('input[type="email"]').eq(0).clear().type(text, {delay: 0})
     .should('have.value', reviewTextLimmit)
        

         cy.get('input[type="email"]').eq(0).clear().type(item.email)
         cy.get('input[type="password"]').eq(0).clear().type(item.senha)

         cy.get('button').contains('Acessar').click()

         cy.get('#modalText').and('contain', 'Usuário ou senha inválido.', { timeout: 2000 })

         cy.get('.fQkeSa>a').click()




      // Cypress._.times(5, () => {
      //    cy.get('input[type="email"]').eq(0).clear().type(DATA.email)
      //    cy.get('input[type="password"]').eq(0).clear().type(DATA.senha)

      //    cy.get('button').contains('Acessar').click()

      //    cy.get('#modalText').and('contain', 'Usuário ou senha inválido.', {timeout:2000})

      //    cy.get('.fQkeSa>a').click()
      // })

   })
})
})