# Pràctica Individual 1: Joc de Memòria (Memory)
## i. Introducció
Aquesta pràctica és el treball individual de l'assignatura Disseny i Desenvolupament de Jocs Web (DDJW). L'objectiu principal ha estat establir les bases d'un projecte utilitzant un flux de treball utilitzant Git i GitHub. 
El projecte consisteix en la creació d'un joc de memòria (Memory) funcional que s'executa mitjançant un Canvas d'HTML5, integrant lògica i diversos modes de joc on podem guardar i carregar partides i gestionar un rànquing.

## ii. Descripció del disseny del joc
Pantalles:** S'ha personalitzat completament l'estil visual mitjançant CSS, modificant el fons, la tipografia i l'aparença dels botons. A la pantalla dinici encapcelada pel títol de menú, tenim els botons de jugar opcions
puntuacions, partides i sortir. Jugar ens porta al mode de joc segons l'haguem configurat en el mode de opcions (si juguem al mode 1 podem modificar els paràmetres de nombre de cartes, mida dels grups, i la dificultat) 
(si juguem al mode 2 (seleccionable al l'opcio de mode de joc) i el nivell inicial). Puntuacions guarda el registre de millors resultats de partides jugades al mode 2. En qualsevol moment podem guadar una partida, i podem 
carregar-la des de partides identificades per l'àlies i el nivell en el que es trobava. Per últim sortir fa un alert de que ja hem acabat i podem sortir de la finestra.
Gestió d'Usuaris:** Al prémer el botó "Jugar", el sistema utilitza un `prompt` per demanar l'àlies al jugador, el qual es guarda en la `sessionStorage` per personalitzar l'experiència i el rànquing.
Interfície de Joc:** La partida es visualitza en un Canvas on les cartes es distribueixen dinàmicament.
Estètica de les Cartes: Les cartes tenen un revers de l'exercici individual que es va fer el més passat.

## iii. Descripció de les parts més rellevants de la implementació
El joc esta dividit en diferents parts molt diferenciades:
Separació de Lògica i Representació: S'ha utilitzat `memory.js` que gestiona la puntuació, nivells i agrupament de les cartes i un fitxer `main.js` i `canvasgame.js` encarregat exclusivament de l'apartat gràfic.
Persistència de Dades: S'utilitza `localStorage` per guardar el rànquing de puntuacions i `sessionStorage` per mantenir l'estat de la sessió actual i el nivell.

## iv. Conclusions i problemes trobats
Aquesta pràctica ha servit per consolidar l'ús de Git en entorns reals.
- Hi ha hagut dificultats a l'hora de guardar la partida.
- Interpretar el enunciat
- Establir el ranquing amb sentit, i fent que fossin els nivells i no els punts el que fos rellevant perque al fallar set resten punts i no tenia sentit evaluar els punts perque totes les partides acabaven al tenir 0 punts.
- Que les partides guardades en el mode 2 carreguessin el seguent nivell.
- Implementació dels paths i el que la part del davant en svg es mostrés en comptes dels .png (NO RESOLT)
