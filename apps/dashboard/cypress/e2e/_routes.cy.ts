// NOTE: we are deliberately running this test first - otherwise other tests fail.

describe('load all routes', () => {
  it('should load root page', () => {
    cy.visit('/', { failOnStatusCode: true })
  })

  it('should load deploy package page', () => {
    cy.visit('/deploy-package', { failOnStatusCode: true })
  })
})
