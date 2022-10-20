describe('load all routes', () => {
    it('should load root page', () => {
        cy.visit('/', { failOnStatusCode: true })
    })

    it('should load explorer page', () => {
        cy.visit('/explorer', { failOnStatusCode: true })
    })

    it('should load staking page', () => {
        cy.visit('/staking', { failOnStatusCode: true })
    })

    it('should load deploy package page', () => {
        cy.visit('/deploy-package', { failOnStatusCode: true })
    })
})