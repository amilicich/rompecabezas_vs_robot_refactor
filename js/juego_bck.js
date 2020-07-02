var resolviendo = 0;
var resolucion = [];
var grilla = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

var contador1 = 0;
var contador2 = 0;
var movimientosEjecutados = [];
var posicionVacia = {
  fila: 2,
  columna: 2
};

function chequearSiGano(){
  var grillaEnUnaSoloArray = [];
  for (var i = 0; i < grilla.length; i++) {
    for (var x = 0; x < grilla[i].length; x++) {
      grillaEnUnaSoloArray.push(grilla[i][x])
    }
  }

  for (var i=0; i < 9; i++) {
    if (i + 1 !== grillaEnUnaSoloArray[i]) {
      return false;
    }
  }
  return true;
}

function mostrarCartelGanador(){
  if (contador1 == contador2) {
    var clon1 = document.getElementById('resultado').cloneNode(true);
    document.getElementById('ganaste').insertBefore(clon1, document.getElementById('ganaste').firstChild);
    $.fancybox.open({
      src  : '#ganaste',
      type : 'inline',
      afterClose : function( instance, current ) {
        location.reload();
      }
    });
  } else {
    var clon1 = document.getElementById('resultado').cloneNode(true);
    document.getElementById('perdiste').insertBefore(clon1, document.getElementById('perdiste').firstChild);
    $.fancybox.open({
      src  : '#perdiste',
      type : 'inline',
      afterClose : function( instance, current ) {
        location.reload();
      }
    });
  }
}

function intercambiarPosiciones(fila1, columna1, fila2, columna2){
  var tablero = document.getElementById('juego');
  var fichaVaciaVieja = grilla[fila1][columna1];
  var fichaVaciaNueva = grilla[fila2][columna2];

  grilla[fila1][columna1] = fichaVaciaNueva;
  grilla[fila2][columna2] = fichaVaciaVieja;

  var ficha1 = document.getElementById('pieza' + fichaVaciaNueva);
  var ficha2 = document.getElementById('pieza' + fichaVaciaVieja);
  var clonFicha1 = ficha1.cloneNode();
  var clonFicha2 = ficha2.cloneNode();

  tablero.replaceChild(clonFicha1,ficha2);
  tablero.replaceChild(clonFicha2,ficha1);
}

function actualizarPosicionVacia(nuevaFila,nuevaColumna){
  posicionVacia.fila = nuevaFila;
  posicionVacia.columna = nuevaColumna;
}

function posicionValida(fila, columna){
  if ((fila >= 0 && fila < 3) && (columna >= 0 && columna < 3)) {
    return true;
  }
}

function moverEnDireccion(direccion, resolver){
  var nuevaFilaPiezaVacia;
  var nuevaColumnaPiezaVacia;

  if(direccion == 40){
    nuevaFilaPiezaVacia = posicionVacia.fila+1;
    nuevaColumnaPiezaVacia = posicionVacia.columna;
  }
  else if (direccion == 38) {
    nuevaFilaPiezaVacia = posicionVacia.fila-1;
    nuevaColumnaPiezaVacia = posicionVacia.columna;
  }
  else if (direccion == 39) {
    nuevaFilaPiezaVacia = posicionVacia.fila;
    nuevaColumnaPiezaVacia = posicionVacia.columna+1;
  }
  else if (direccion == 37) {
    nuevaFilaPiezaVacia = posicionVacia.fila;
    nuevaColumnaPiezaVacia = posicionVacia.columna-1;
  } 

  if (posicionValida(nuevaFilaPiezaVacia, nuevaColumnaPiezaVacia)) {
    intercambiarPosiciones(posicionVacia.fila, posicionVacia.columna,
    nuevaFilaPiezaVacia, nuevaColumnaPiezaVacia);
    actualizarPosicionVacia(nuevaFilaPiezaVacia, nuevaColumnaPiezaVacia);
    if (resolver == false) {
      if (direccion == 40) {
        movimientosEjecutados.push(38);
      } else if (direccion == 38) {
        movimientosEjecutados.push(40);
      } else if (direccion == 39) {
        movimientosEjecutados.push(37);
      } else if (direccion == 37) {
        movimientosEjecutados.push(39);
      }
    }   
  }
}

function siguienteInverso(movimientoActual, movimientoSiguiente) {
  switch(movimientoActual) {
    case 40:
      if (movimientoSiguiente == 38) {
        return true;
      }
      break;
    case 38:
      if (movimientoSiguiente == 40) {
        return true;
      }
      break;
    case 39:
      if (movimientoSiguiente == 37) {
        return true;
      }
      break;
    case 37:
      if (movimientoSiguiente == 39) {
        return true;
      }
      break;
  }
  return false;
}

function resolverLogica(arrayDeMovimientos) {

  // arrayDeMovimientos ya viene .reverse()
  if (arrayDeMovimientos.length == 1) {  
    resolucion.push(arrayDeMovimientos[0]); 
    resolverMoviendo(resolucion);
  } else {
    var movActual = arrayDeMovimientos[0];
    var movSiguiente = arrayDeMovimientos[1];

    if (siguienteInverso(movActual,movSiguiente)) {
      arrayDeMovimientos.splice(0,2);
    } else {
      resolucion.push(movActual); 
      arrayDeMovimientos.splice(0,1);
    }
    resolverLogica(arrayDeMovimientos); 
  }
}

function resolverMoviendo (arrayDeMovimientos) {
  contador2++;
  setTimeout(function () {
    if (arrayDeMovimientos.length == 1) {
      moverEnDireccion(arrayDeMovimientos[0],true); 
      actualizarContador();
    } else {
      var movActual = arrayDeMovimientos[0];
      moverEnDireccion(movActual,true);
      arrayDeMovimientos.splice(0,1);
    }
    actualizarContador();
    var gano = chequearSiGano();
    if(gano){
      mostrarCartelGanador();
    } else {
      resolverMoviendo(arrayDeMovimientos);
    }
  }
  , 250)
}

function mezclarPiezas(veces){
  if (contador1 >= 25) {
    if (resolviendo == 0) {
      resolviendo = 1;
      resolver();
    }
    return {}; 
  }
  if(veces<=0){return;}
  var direcciones = [40, 38, 39, 37];
  var direccion = direcciones[Math.floor(Math.random()*direcciones.length)];
  contador1++;
  actualizarContador();
  moverEnDireccion(direccion,false);
  if (contador1 >= 25) {
    if (resolviendo == 0) {
      resolviendo = 1;
      resolver();
    }
  }
  setTimeout(function(){
    mezclarPiezas(veces-1);
  },100);
}

function capturarTeclas(){
  document.body.onkeydown = (function(evento) {
    if (contador1 >= 25) {
      if (resolviendo == 0) {
        resolviendo = 1;
        resolver();
      }
      return {}; 
    }
    if(evento.which == 40 || evento.which == 38 || evento.which == 39 || evento.which == 37){
      contador1++;
      actualizarContador();
      moverEnDireccion(evento.which,false);
      if (contador1 >= 25) {
        if (resolviendo == 0) {
          resolviendo = 1;
          resolver();
        }
      }
      evento.preventDefault();
    }
  })
}

function actualizarContador() {
  document.getElementById('resultado').innerHTML = '<span id="hombre">👨</span> ' + contador1 + ' / <strong>' + contador2 + '</strong> 🤖';
}

function resolver() {
  resolverLogica(movimientosEjecutados.reverse());
}

function iniciar(){
  contador1 = 0;
  contador2 = 0;
  actualizarContador();
  capturarTeclas();
}

$( document ).ready(function() {
  $.fancybox.open({
    src  : '#aportesOculto',
    type : 'inline',
    afterClose : function( instance, current ) {
			iniciar();
		}
  });
});

$('#mezclarBoton').click(function() {
  var cuantoMezclo = $('#cantPiezasMezclar').val();
  mezclarPiezas(cuantoMezclo);
});