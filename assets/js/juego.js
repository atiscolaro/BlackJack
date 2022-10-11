// 2C = Two of Clubs
// 2D = Two of Diamonds
// 2H = Two of Hearts
// 2S = Two of Spades


const miModulo = (() => {                    //Protege mi codigo
    'use strict';
    
    //---------------------------------------------------------------------------

    //Arrays
    let deck = [];
    const tipos = ['C','D','H','S'],
          especiales = ['A','J','Q','K'];

    // Variables
    let puntosJugadores = [];

    //---------------------------------------------------------------------------

    // Referencias del HTML -- DOM  --
    const btnPedir = document.querySelector('#btnPedir'),   // Boton pedir Carta
          btnDetener = document.querySelector('#btnDetener'),
          btnNuevoJuego = document.querySelector('#btnNuevo');

    const divCartasJugadores = document.querySelectorAll('.divCartas'),
          puntosHTML = document.querySelectorAll('small');  // Puntos al lado del nombre

    //---------------------------------------------------------------------------

    // funcion Inicializar el juego
    const inicializarJuego = ( numJugadores = 2 ) => {
        deck = crearDeck();  

        puntosJugadores = [];
        for (let i = 0; i < numJugadores; i++) {
            puntosJugadores.push(0);
        }

        puntosHTML.forEach(elem => elem.innerText = 0);
        divCartasJugadores.forEach(elem => elem.innerHTML = '');

        btnPedir.disabled = false;
        btnDetener.disabled = false;

    }

    //---------------------------------------------------------------------------
    // funcion NUEVO DECK
    const crearDeck = () => {

        deck = [];
        for (let i = 2; i <= 10; i++){   // Agrego las cartas del 2 al 10
            for (let tipo of tipos){     // Agrego el tipo de carta Clubs, Diamonds, Hearts, Spades
                deck.push( i + tipo);
            }
        }

        for (let tipo of tipos){            // Agrego cartas especiales J Q K A
            for (let esp of especiales){    // Agrego el tipo de carta Clubs, Diamonds, Hearts, Spades
                deck.push (esp + tipo);
            }
        }
        return _.shuffle(deck);
    }

    //---------------------------------------------------------------------------

    // funcion PEDIR CARTA
    const pedirCarta = () => {

        if (deck.length === 0){
            throw 'No hay mas cartas en el deck';
        }
        return deck.pop();
    }
    //---------------------------------------------------------------------------

    // funcion VALOR CARTA
    const valorCarta = (carta) => {
        const valor = carta.substring(0, carta.length - 1);   //METODO SUBSTRING para obtener solo los indices con valor y no con el tipo de la carta
        return ( isNaN( valor ) ) ? 
                (valor === 'A') ? 11 : 10
                : valor * 1;
    }

    //---------------------------------------------------------------------------

    // Turno: 0 primero jugador y el ultimo sera la computadora
    const acumularPuntos = (carta, turno) => {
        puntosJugadores[turno] += valorCarta(carta);
        puntosHTML[turno].innerText = puntosJugadores[turno]; // Acumula los puntos al lado del nombre del Jugador -- en el small del html
        return puntosJugadores[turno];
    }

    //---------------------------------------------------------------------------

    const crearCarta = (carta, turno)  => {

        const imgCarta = document.createElement('img'); // Creacion de la img
        imgCarta.src = `assets/cartas/${carta}.png`;  // Controlo que carta va a aparecer en la img
        imgCarta.classList.add('carta'); // Asigno su clase que la da el formato ya establecido en styles
        divCartasJugadores[turno].append(imgCarta);  // Agrego la img al contenedor
    }

    const determinarGanador = () => {

        const [puntosMinimos, puntosComputadora] = puntosJugadores;

        setTimeout(() => {   // Mejorar el rendimiento de JS

            if ( puntosComputadora === puntosMinimos){
                alert('Empate :( ');
            } else if (puntosMinimos > 21){
                alert('Computadora gana');
            } else if (puntosComputadora > 21){
                alert('Jugador gana');
            } else {
                alert('Computadora gana');
            }
                }, 100);  // 100 milisegundos
    }


    // Turno computadora
    const turnoComputadora = (puntosMinimos) => {
        let puntosComputadora = 0;

        do {
        const carta = pedirCarta();
        puntosComputadora =acumularPuntos (carta, puntosJugadores.length - 1);
        crearCarta(carta, puntosJugadores.length - 1);
        
        } while ((puntosComputadora < puntosMinimos) && (puntosMinimos <= 21)) ;

        determinarGanador();
    }

    //---------------------------------------------------------------------------

    //Eventos!

    //-----PEDIR CARTA--
    btnPedir.addEventListener('click', () => {   //Callback -- pasar por parametro una funcion anterior
        
        const carta = pedirCarta(),
              puntosJugador = acumularPuntos(carta, 0);
        
        crearCarta(carta, 0);

        if ( puntosJugador > 21 ){
            console.warn('Lo siento, perdiste');  // warn a diferencia de log se ve en amarillo en consola
            btnPedir.disabled = true;  // Deshabilito el boton de pedir carta una vez superado 21
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);
            
        }else if ( puntosJugador === 21 ){
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            console.warn('21, genial!');
            turnoComputadora(puntosJugador);
        }
    });

    //-----DETENER--
    btnDetener.addEventListener('click', () => {
        btnPedir.disabled = true;
        btnDetener.disabled = true;

        turnoComputadora(puntosJugadores[0]);
    });

    //-----NUEVO JUEGO--

    return {   
        nuevoJuego: inicializarJuego
    };
})();




