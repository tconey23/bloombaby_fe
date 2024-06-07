describe('bloom baby', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('finds the canvas on the page', () => {
    cy.get('canvas')
      .should('exist')
      .and((canvas) => {
        expect(canvas[0].width).to.be.greaterThan(0);
        expect(canvas[0].height).to.be.greaterThan(0);
      });
  });

  it('checks if the canvas is visible on the page', () => {
    cy.get('canvas').should('be.visible');
  });
  
})

