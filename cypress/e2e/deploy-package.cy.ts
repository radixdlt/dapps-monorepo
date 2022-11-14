describe('Deploy package', () => {
  it('should load deploy package page', () => {
    cy.visit('/deploy-package', { failOnStatusCode: true })
    cy.get('input[name="fileupload"]').should('exist')
  })

  it('should give error on invalid type', () => {
    cy.visit('/deploy-package', { failOnStatusCode: true })
    const upload = cy.get('input[name="fileupload"]')
    upload.selectFile('cypress/fixtures/transaction.json')
    cy.contains('File is of invalid type')
  })

  it('should give error on invalid type and not go to next if two files are uploaded one having invalid type', () => {
    cy.visit('/deploy-package', { failOnStatusCode: true })
    const upload = cy.get('input[name="fileupload"]')
    upload.selectFile('cypress/fixtures/hello.abi')
    upload.selectFile('cypress/fixtures/transaction.json')
    cy.contains('File is of invalid type')
  })

  it('should be able to remove the invalid file and re-add it. this must invoke same invalid type error', () => {
    cy.visit('/deploy-package', { failOnStatusCode: true })
    const upload = cy.get('input[name="fileupload"]')
    upload.selectFile('cypress/fixtures/hello.abi')
    upload.selectFile('cypress/fixtures/transaction.json')
    cy.wait(500)
    cy.contains('Remove').click()
    upload.selectFile('cypress/fixtures/transaction.json')
    cy.contains('File is of invalid type')
  })

  it('should add invalid type twice and show error', () => {
    cy.visit('/deploy-package', { failOnStatusCode: true })
    const upload = cy.get('input[name="fileupload"]')
    upload.selectFile('cypress/fixtures/transaction.json')
    upload.selectFile('cypress/fixtures/transaction.json')
    const uploadEntries = cy.get('.filepond--file')
    uploadEntries.should('have.length', 2)
    uploadEntries.each((el) => {
      cy.wrap(el).contains('File is of invalid type')
    })
  })

  it('should not go to next step if two abi files uploaded', () => {
    cy.visit('/deploy-package', { failOnStatusCode: true })
    const upload = cy.get('input[name="fileupload"]')
    upload.selectFile('cypress/fixtures/hello.abi')
    upload.selectFile('cypress/fixtures/hello.abi')
    cy.contains('File is of invalid type')
  })

  it('error should persist on removing double abi and then readd it again', () => {
    cy.visit('/deploy-package', { failOnStatusCode: true })
    const upload = cy.get('input[name="fileupload"]')
    upload.selectFile('cypress/fixtures/hello.abi')
    upload.selectFile('cypress/fixtures/hello.abi')
    cy.contains('File is of invalid type')
    cy.contains('Remove').click()
    upload.selectFile('cypress/fixtures/hello.abi')
    cy.contains('File is of invalid type')
  })

  it('should go to next step if both wasm and abi are uploaded', () => {
    cy.visit('/deploy-package', { failOnStatusCode: true })
    const upload = cy.get('input[name="fileupload"]')
    upload.selectFile('cypress/fixtures/hello.abi')
    upload.selectFile('cypress/fixtures/hello.wasm')
    cy.contains('Publish').should('exist')
  })
})
