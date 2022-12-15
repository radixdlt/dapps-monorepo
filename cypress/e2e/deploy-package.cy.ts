const getUploadElement = () => cy.get('input[name="fileupload"]')

describe('Deploy package', () => {
  it('should load deploy package page', () => {
    cy.visit('/deploy-package', { failOnStatusCode: true })
  })
})
