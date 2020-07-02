function Dibujante() {
  this.canvas = document.createElement('canvas'),
  this.anchoCanvas= 600,
  this.altoCanvas= 600,
  this.pathImagen = "images/objetivo1.jpg";

}

Dibujante.prototype.inicializarCanvas = function (anchoCanvas, altoCanvas) {
  this.canvas.width = anchoCanvas;
  this.canvas.height = altoCanvas;
  this.canvas.id = "canvasPrin";
  var elemLeft = this.canvas.offsetLeft;
  var elemTop = this.canvas.offsetTop;
  document.getElementById('backjuego').appendChild(this.canvas);
}

Dibujante.prototype.cargarImagen = function(callback) {
  this.imagen = new Image();
  var self = this;
  this.imagen.addEventListener('load', function () {callback()}, false);
  this.imagen.src = self.pathImagen;
}

Dibujante.prototype.dibujarImagen = function (cortox, cortoy, x, y, ancho, alto) {
  this.canvas.getContext('2d').drawImage(this.imagen, cortox, cortoy, ancho, alto, x, y, ancho, alto);    
}

Dibujante.prototype.dibujarVacia = function (cortox, cortoy, x, y, ancho, alto) {
  this.canvas.getContext('2d').drawImage('', cortox, cortoy, ancho, alto, x, y, ancho, alto);    
}

Dibujante.prototype.limpiarCanvas = function () {
  this.canvas.getContext('2d').clearRect(0, 0, this.canvas.width, this.canvas.height);   
}

function Robot(juego) {
  this.resolviendo = false,
  this.juego = juego,
  this.resolucion = []
}

Robot.prototype.resolver = function () {
  var movimientosReversos = juego.jugador.movimientosEjecutados.reverse();
  this.resolverLogica(movimientosReversos);
}

Robot.prototype.resolverLogica = function(arrayDeMovimientos) {
  if (arrayDeMovimientos.length == 1) {  
    this.resolucion.push(arrayDeMovimientos[0]); 
    juego.resolverMoviendo(this.resolucion);
  } else {
    var movActual = arrayDeMovimientos[0];
    var movSiguiente = arrayDeMovimientos[1];

    if (this.siguienteInverso(movActual,movSiguiente)) {
      arrayDeMovimientos.splice(0,2);
    } else {
      this.resolucion.push(movActual); 
      arrayDeMovimientos.splice(0,1);
    }
    this.resolverLogica(arrayDeMovimientos); 
  }

  if(!arrayDeMovimientos) {
    return;
  }
}

Robot.prototype.siguienteInverso = function(movimientoActual, movimientoSiguiente) {
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


function Pieza(posicion, x, y, ancho, alto) {
  this.posicion = posicion,
  this.x = x,
  this.y = y,
  this.ancho = ancho,
  this.alto = alto,
  this.xOrig = x,
  this.yOrig = y
}

function Jugador() {
  this.movimientosEjecutados = [];
}

function Juego(dibujante) {
  this.grilla = [],
  this.posicionVacia = {
    fila: 2,
    columna: 2
  },
  this.contador1 = 0,
  this.contador2 = 0,
  this.contadorGanar = 25,
  this.contadorPiezas = 0,
  this.cantidadDePiezasPorLado = 3,
  this.dibujante = dibujante,
  this.robot = new Robot(this),
  this.jugador = new Jugador()
}

Juego.prototype.resolverMoviendo = function(arrayDeMovimientos) {
  this.contador2++;
  self = this;
  setTimeout(function () {
    
    if (arrayDeMovimientos.length == 1) {
      self.moverEnDireccion(arrayDeMovimientos[0],true); 
    } else {
      var movActual = arrayDeMovimientos[0];
      self.moverEnDireccion(movActual,true);
      arrayDeMovimientos.splice(0,1);
    }

    self.actualizarContador();

    if (self.contador2 > self.contadorGanar) {
      self.mensajeGanador();
    } else {
      var resolvioRobot = self.chequearRobotResuelto();
      if(resolvioRobot) {
        if(self.chequearRobotGano() == false) {
      self.mensajeGanador();
        } else {
          self.mensajePerdedor();
        }
      } else {
        self.resolverMoviendo(arrayDeMovimientos);
      }
    }
  }
  , 250);
}

Juego.prototype.actualizarContador = function () {
  document.getElementById('resultado').innerHTML = `<span id="hombre">👨</span>${this.contador1} / <strong> ${this.contador2}</strong> 🤖`;
}

Juego.prototype.mensajeGanador = function() {
  swal({
    title: "¡Ganaste!",
    text: `<img src="images/chuckNorrisApproved.gif" alt=""><br>
    <p>Has demostrado ser lo suficientemente inteligente para encontrar una táctica para ganar, o bien has logrado volver loco al Robot.<p></p>`,
    html: true
    },  function(){
      juego.iniciar();
  });
}

Juego.prototype.mensajePerdedor = function() {
  swal({
    title: "Perdiste!",
    text: `<img src="images/benderWalking.gif" alt=""><br>
    <p>El Robot ha ganado ya que utilizó menos movimientos para resolver el RompeCabezas</p>
    <p>No te desanimes, ¡puedes intentarlo tantas veces como quieras!</p>`,
    html: true
  },  function(){
    juego.iniciar();
  });
}

Juego.prototype.chequearRobotGano = function() {
  if (this.contador2 >= this.contador1) {
    return false;
  }
  return true;
}

Juego.prototype.chequearRobotResuelto = function(){
  var grillaEnUnaSoloArray = [];

  for (var i=0; i < this.grilla.length; i++) {
    if (i !== this.grilla[i].posicion) {
      return false;
    }
  }
  return true;
}

Juego.prototype.mezclarPiezas = function (veces) {
  var self = this;
  
  if (this.contador1 >= this.contadorGanar) {
    if (this.robot.resolviendo == false) {
      this.robot.resolviendo = true;
      this.robot.resolver();
    }
    return {}; 
  }

  if(veces<=0){return;}

  var direcciones = [40, 38, 39, 37];
  var direccion = direcciones[Math.floor(Math.random()*direcciones.length)];
  this.contador1++;
  this.actualizarContador();
  this.moverEnDireccion(direccion,false);
  if (this.contador1 >= this.contadorGanar) {
    if (this.robot.resolviendo == false) {
      this.robot.resolviendo = true;
      this.robot.resolver();
    }
  }
  setTimeout(function(){
    self.mezclarPiezas(veces-1);
  },100);
}

Juego.prototype.cambiarCantidadMovimientos = function(cantidad) {
  if(cantidad && cantidad > 0) {
    this.contadorGanar = cantidad;
  }
}

Juego.prototype.capturarTeclas = function () {
  self = this;
  document.body.onkeydown = (function(evento) {
    
    if (self.contador1 >= self.contadorGanar) {
      if (self.robot.resolviendo == false) {
        resolviendo = 1;
        self.robot.resolver(self);
      }
      return {}; 
    }

    if(evento.which == 40 || evento.which == 38 || evento.which == 39 || evento.which == 37){
      self.contador1++;
      self.actualizarContador();
      self.moverEnDireccion(evento.which,false);
      if (self.contador1 >= self.contadorGanar) {
        if (self.robot.resolviendo == false) {
          self.robot.resolviendo = true;
          self.robot.resolver(self);
        }
      }
      evento.preventDefault();
    }
  })
}

Juego.prototype.moverEnDireccion = function (direccion, resolver) {
  var nuevaFilaPiezaVacia;
  var nuevaColumnaPiezaVacia;
  if(direccion == 40){
    nuevaFilaPiezaVacia = this.posicionVacia.fila-1;
    nuevaColumnaPiezaVacia = this.posicionVacia.columna;
  }
  else if (direccion == 38) {
    nuevaFilaPiezaVacia = this.posicionVacia.fila+1;
    nuevaColumnaPiezaVacia = this.posicionVacia.columna;
  }
  else if (direccion == 39) {
    nuevaFilaPiezaVacia = this.posicionVacia.fila;
    nuevaColumnaPiezaVacia = this.posicionVacia.columna-1;
  }
  else if (direccion == 37) {
    nuevaFilaPiezaVacia = this.posicionVacia.fila;
    nuevaColumnaPiezaVacia = this.posicionVacia.columna+1;
  } 

  if (this.posicionValida(nuevaFilaPiezaVacia, nuevaColumnaPiezaVacia)) {
    this.intercambiarPosiciones(this.posicionVacia.fila, this.posicionVacia.columna,
    nuevaFilaPiezaVacia, nuevaColumnaPiezaVacia);
    if (this.robot.resolviendo == false) {
      if (direccion == 40) {
        this.jugador.movimientosEjecutados.push(38);
      } else if (direccion == 38) {
        this.jugador.movimientosEjecutados.push(40);
      } else if (direccion == 39) {
        this.jugador.movimientosEjecutados.push(37);
      } else if (direccion == 37) {
        this.jugador.movimientosEjecutados.push(39);
      }
    }   
  }
}


Juego.prototype.posicionValida = function(fila, columna) {
  if ((fila > 0 && fila <= this.cantidadDePiezasPorLado) && (columna > 0 && columna <= this.cantidadDePiezasPorLado)) {
    return true;
  }
}

Juego.prototype.piezaPorPosicion = function(posFila, posColum) {
  var posicionFicha = ((posFila - 1) * this.cantidadDePiezasPorLado + posColum) - 1;
  var piezaDevolver = this.grilla[posicionFicha];
  return piezaDevolver;
}

Juego.prototype.obtenerindicePorPieza = function(pieza) {
  var indice = 0;
  if (pieza) {
    this.grilla.forEach(function (piezaSelec, index) {
      if(pieza.posicion == piezaSelec.posicion) {
        indice = index;
      }
    });

  return indice;
  }
}

Juego.prototype.actualizarPosicionVacia = function(fila, columna) {
  this.posicionVacia.fila = fila;
  this.posicionVacia.columna = columna;

  this.dibujante.limpiarCanvas();
  this.construirPiezas();
}

Juego.prototype.intercambiarPosiciones = function(posFila, posColum, nueFila, nueColum) {
  var piezaVacia = this.piezaPorPosicion(posFila, posColum);
  var piezaNueva = this.piezaPorPosicion(nueFila, nueColum);
  var posicionY = piezaNueva.y;
  var posicionX = piezaNueva.x;

  piezaNueva.x = piezaVacia.x;
  piezaNueva.y = piezaVacia.y;
  piezaVacia.x = posicionX;
  piezaVacia.y = posicionY;


  var posicionVacia = this.obtenerindicePorPieza(piezaVacia);
  var posicionNueva = this.obtenerindicePorPieza(piezaNueva);


  this.grilla[posicionVacia] = piezaNueva;
  this.grilla[posicionNueva] = piezaVacia;

  this.actualizarPosicionVacia(nueFila, nueColum);
}

Juego.prototype.piezaPosicionVacia = function () {
  var posicionFicha = ((this.posicionVacia.fila - 1) * this.cantidadDePiezasPorLado + this.posicionVacia.columna) - 1;
  var piezaDevolver = this.grilla[posicionFicha];
  return piezaDevolver;
}

Juego.prototype.crearFilasGrilla = function(cantMiembros) {
  var grilla = [];
  var tamanioFicha = 600 / cantMiembros;
  if(cantMiembros > 0) {
    for(var i = 0; i<cantMiembros * cantMiembros; i++) {
      var alto = Math.floor(i / cantMiembros);
      var posix = i * tamanioFicha - (alto * cantMiembros * tamanioFicha);
      var nuevaPieza = new Pieza(this.contadorPiezas, posix, alto * tamanioFicha, tamanioFicha, tamanioFicha);
      grilla.push(nuevaPieza);
      this.contadorPiezas++;
    }
  }
  return grilla;
}


Juego.prototype.construirPiezas = function () {
  var self = this;

  this.grilla.forEach(function(pieza) {
    if(pieza !== self.piezaPosicionVacia()) {
      self.dibujante.dibujarImagen(pieza.xOrig, pieza.yOrig, pieza.x, pieza.y, pieza.ancho, pieza.alto);
    } 
  });
}

Juego.prototype.crearGrilla = function () {
  this.contadorPiezas = 0;
  this.grilla = this.crearFilasGrilla(this.cantidadDePiezasPorLado);
}

Juego.prototype.indiceMovValido = function (indiceMov) {
  var a = this.obtenerindicePorPieza(this.piezaPosicionVacia());
 
  if(indiceMov == a - this.cantidadDePiezasPorLado) {
    return 40;
  } else if(indiceMov == a + this.cantidadDePiezasPorLado) {
    return 38;
  } else if(indiceMov == a + 1) {
    return 37;
  } else if(indiceMov == a - 1) {
    return 39;
  }
}

Juego.prototype.iniciar = function() {
  var self = this;
  this.posicionVacia.columna = Number(this.cantidadDePiezasPorLado);
  this.posicionVacia.fila = Number(this.cantidadDePiezasPorLado);
  this.contador1 = 0;
  this.contador2 = 0;
  this.robot.resolviendo = false;
  this.actualizarContador();
  this.crearGrilla();
  this.dibujante.limpiarCanvas();

  this.dibujante.cargarImagen(function () {
    self.construirPiezas();
  });



  this.dibujante.canvas.addEventListener('click', function(event) {
    var x = event.offsetX,
        y =  event.offsetY;

    var piezaElegida;
    var indiceElegido;
  
    self.grilla.forEach(function(element, index) {
      if (y > element.y && y < element.y + element.alto 
          && x > element.x && x < element.x + element.ancho) {
          piezaElegida = element;
          indiceElegido = index;
      }
    });

    if (self.contador1 >= self.contadorGanar) {
      if (self.robot.resolviendo == false) {
        resolviendo = 1;
        self.robot.resolver(self);
      }
        return {}; 
    }

    var movimientoARealizar = self.indiceMovValido(indiceElegido)

    if(movimientoARealizar) {
      self.contador1++;
      self.actualizarContador();
      self.moverEnDireccion(movimientoARealizar,false);
      if (self.contador1 >= self.contadorGanar) {
        if (self.robot.resolviendo == false) {
          self.robot.resolviendo = true;
          self.robot.resolver(self);
        }
      }
    }
  }, false);

  $('#mezclarBoton').click(function() {
    self.mezclarPiezas(self.contadorGanar);
  });

  $('#okModiGrilla').click(function () {
    var cantVeces = $('#cantPiezas').val();
    if(cantVeces && cantVeces > 0) {
      juego.cantidadDePiezasPorLado = Number(cantVeces);
      juego.iniciar(cantVeces);
    }
  });

  $('#okModMovi').click(function () {
    var cantVeces = $('#cantMov').val();
    if(cantVeces && cantVeces > 0) {
      juego.cambiarCantidadMovimientos(Number(cantVeces));
      juego.iniciar();
    }
  });

  $('#imagenesFondo img').click(function () {
    self.dibujante.pathImagen = this.src;
    self.dibujante.cargarImagen(function () {self.construirPiezas()});
  });

  $('#seleccionNiveles li').click(function () {
    var nivel = this.textContent;
    if(nivel && nivel !== '') {
      if(nivel == "Fácil") {
        self.cantidadDePiezasPorLado = 3;
        self.contadorGanar = 25;
        self.dibujante.pathImagen = $('#imagenesFondo img')[0].src;

      } else if(nivel == "Intermedio") {
        self.cantidadDePiezasPorLado = 5;
        self.contadorGanar = 50;
        self.dibujante.pathImagen = $('#imagenesFondo img')[1].src;
  
      } else if(nivel == "Difícil") {
        self.cantidadDePiezasPorLado = 9;
        self.contadorGanar = 120;
        self.dibujante.pathImagen = $('#imagenesFondo img')[2].src;
      }
    }
    
    self.iniciar();
  });

  $('#cantPiezas').val(self.cantidadDePiezasPorLado);
  $('.cantMovi').text(self.contadorGanar);
  $('#cantMov').val(self.contadorGanar);
  this.capturarTeclas();

}


var dibujante = new Dibujante();
dibujante.inicializarCanvas(600, 600);
var juego = new Juego(dibujante);
juego.iniciar();