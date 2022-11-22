const getUploadElement = () => cy.get('input[name="fileupload"]')

describe('Deploy package', () => {
  it('should load deploy package page', () => {
    cy.visit('/deploy-package', { failOnStatusCode: true })
    getUploadElement().should('exist')
  })

  it('should give error on invalid type', () => {
    cy.visit('/deploy-package', { failOnStatusCode: true })
    const upload = getUploadElement()
    upload.selectFile('cypress/fixtures/transaction.json', { force: true })
    cy.contains('File is of invalid type')
  })

  it('should give error on invalid type and not go to next if two files are uploaded one having invalid type', () => {
    cy.visit('/deploy-package', { failOnStatusCode: true })
    const upload = getUploadElement()
    upload.selectFile('cypress/fixtures/hello.abi', { force: true })
    upload.selectFile('cypress/fixtures/transaction.json', { force: true })
    cy.contains('File is of invalid type')
  })

  it('should be able to remove the invalid file and re-add it. this must invoke same invalid type error', () => {
    cy.visit('/deploy-package', { failOnStatusCode: true })
    const upload = getUploadElement()
    upload.selectFile('cypress/fixtures/hello.abi', { force: true })
    upload.selectFile('cypress/fixtures/transaction.json', { force: true })
    cy.wait(500)
    cy.contains('Remove').click()
    upload.selectFile('cypress/fixtures/transaction.json', { force: true })
    cy.contains('File is of invalid type')
  })

  it('should add invalid type twice and show error', () => {
    cy.visit('/deploy-package', { failOnStatusCode: true })
    const upload = getUploadElement()
    upload.selectFile('cypress/fixtures/transaction.json', { force: true })
    upload.selectFile('cypress/fixtures/transaction.json', { force: true })
    const uploadEntries = cy.get('.filepond--file')
    uploadEntries.should('have.length', 2)
    uploadEntries.each((el) => {
      cy.wrap(el).contains('File is of invalid type')
    })
  })

  it('should not go to next step if two abi files uploaded', () => {
    cy.visit('/deploy-package', { failOnStatusCode: true })
    const upload = getUploadElement()
    upload.selectFile('cypress/fixtures/hello.abi', { force: true })
    cy.wait(200)
    upload.selectFile('cypress/fixtures/hello.abi', { force: true })
    cy.contains('File is of invalid type')
  })

  it('error should persist on removing double abi and then read it again', () => {
    cy.visit('/deploy-package', { failOnStatusCode: true })
    const upload = getUploadElement()
    upload.selectFile('cypress/fixtures/hello.abi', { force: true })
    cy.wait(200)
    upload.selectFile('cypress/fixtures/hello.abi', { force: true })
    cy.contains('File is of invalid type')
    cy.contains('Remove').click()
    upload.selectFile('cypress/fixtures/hello.abi', { force: true })
    cy.contains('File is of invalid type')
  })

  it('should go to next step if both wasm and abi are uploaded', () => {
    cy.visit('/deploy-package', { failOnStatusCode: true })
    const upload = getUploadElement()
    upload.selectFile('cypress/fixtures/hello.abi', { force: true })
    upload.selectFile('cypress/fixtures/hello.wasm', { force: true })
    cy.contains('Publish').should('exist')
  })
})
