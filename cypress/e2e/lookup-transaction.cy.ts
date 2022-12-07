describe('searching for transaction', () => {
  it('shows the transaction', () => {
    cy.intercept(
      {
        method: 'POST',
        url: `**/transaction/status`
      },
      {
        fixture: `transaction.json`
      }
    )

    cy.visit('/')
    cy.get('input').type(
      '0617e513d01c2676dd23382e7dfa595bc3963591a05de4b0c049e18402aaccee'
    )
    cy.get('form').submit()
    cy.get('div').should('contain', 'succeeded')
  })
})

