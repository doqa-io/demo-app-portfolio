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

describe('visit doqa.io/resources', () => {
  it('passes', () => {
    cy.visit('https://doqa.io/resources')
  })
})

describe('visit doqa.io/docs/api', () => {
  it('passes', () => {
    cy.visit('https://doqa.io/docs/api')
  })
})
