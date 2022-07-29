import { MAINNET_URL } from '../../src/constants'

describe('empty spec', () => {
  it('passes', () => {
    cy.intercept(
      {
        method: 'GET',
        url: `**/transaction/*/__data.json`,
      },
      {
        fixture: `transaction.json`
      }
    ).as('transactionStatus') // and assign an alias

    cy.visit('/explorer')
    cy.get('input').type('ef71a9d6c63444fce6abd2df8fab2755cfb51f6794e578f60d99337193811842')
    cy.contains('Search').click()
    cy.get('div').should('contain', 'CONFIRMED')
  })
})