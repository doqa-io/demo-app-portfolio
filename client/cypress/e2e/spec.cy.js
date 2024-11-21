/* eslint-disable no-undef */
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