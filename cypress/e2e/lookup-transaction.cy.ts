describe('searching for transaction', () => {
    it('shows the transaction', () => {
      cy.intercept(
        {
          method: 'GET',
          url: `**/transaction/*/__data.json`,
        },
        {
          fixture: `transaction.json`
        }
      )
  
      cy.visit('/explorer')
      cy.get('input').type('ef71a9d6c63444fce6abd2df8fab2755cfb51f6794e578f60d99337193811842')
      cy.get('form').submit()
      cy.get('div').should('contain', 'CONFIRMED')
    })
  })