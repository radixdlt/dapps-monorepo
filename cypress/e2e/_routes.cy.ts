// NOTE: we are deliberately running this test first - otherwise other tests fail.

describe('load all routes', () => {
  it('should load root page', () => {
    cy.visit('/', { failOnStatusCode: true })
  })

  it('should load staking page', () => {
    cy.visit('/staking', { failOnStatusCode: true })
  })

  it('should load deploy package page', () => {
    cy.visit('/deploy-package', { failOnStatusCode: true })
  })

  it('should load transaction page', () => {
    cy.visit(
      '/transaction/ef71a9d6c63444fce6abd2df8fab2755cfb51f6794e578f60d99337193811842',
      { failOnStatusCode: true }
    )
  })
})

