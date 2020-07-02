var expect = chai.expect;
var juego;

describe('Creación', function() {
    'use strict';

  describe('Juego', function() {
    it('El Objeto Juego está definido', function(done) {
      if (!window.Juego){
        done(err);
      }
      else{
        done();
      }
    });
  });
  // Usar before each para instancear el Juego


  beforeEach(function() {
    juego = new Juego();
  });

  describe('Tamaño de la grilla', function() {
    it('Se quiere de 5 lados, y crea con 5 lados.', function() {

      juego.cantidadDePiezasPorLado = 5;
      juego.crearGrilla();

      expect(juego.grilla.length).to.equal(juego.cantidadDePiezasPorLado * juego.cantidadDePiezasPorLado);
    });

    it('Se quiere de 0 lados, se crea el array grilla con length = 0', function () {
      juego.cantidadDePiezasPorLado = 0;
      juego.crearGrilla();
      expect(juego.grilla.length).to.equal(juego.cantidadDePiezasPorLado);
    });

    it('Se quiere -5, se crea el array grilla con length = 0.', function () {
      juego.cantidadDePiezasPorLado = -5;
      juego.crearGrilla();
      expect(juego.grilla.length).to.equal(0);
    });  
  });

  describe('Posicion valida', function () {
    
  });
});
