// Test: visit doqa.io and doqa.io/api
describe('visit doqa.io', () => {
  it('passes', () => {
    cy.visit('https://doqa.io')
  })
})

describe('visit doqa.io/api', () => {
  it('passes', () => {
    cy.visit('https://doqa.io/api')
  })
})