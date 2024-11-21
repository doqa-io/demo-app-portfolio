describe('Live Site Tests', () => {
    it('Should load the homepage without errors', () => {
      cy.visit('/');
      cy.contains('Learn React'); 
    });
  
    it('Should load the API page without errors', () => {
      cy.request('/api').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.contain('Welcome to the doqa.io backend!');
      });
    });
  });
  