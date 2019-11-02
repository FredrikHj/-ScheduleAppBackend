This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

En schemaApp där designen är enkel likt den excelfilen jag fick!

Appen kan ses på:
https://fredrikhj.github.io/workshoppschedulePulished/


Funktionen är uppbyggt kring en tabell vars data kommer från en extern databas & innehåller följande områden:
* Information till användarna - Vänster top.
* Till höger top finns knappar för att filtrera på respektive colum --> Månad och Berörda(= antalet berörda parter).
* Tabellen med data underst.

Funktioner:
* Filtrera enligt colummerna ovan och fungerar genom olika sql förfrågningar för varje filltertryck.
* Antalet knappa/filter bestämms av den inkommande datan.
* En knapp för att återställa alla filter.
* Kommande:
    * Möjlighet till inlogg.
    * Vid inlogg finns möjlighet för både att lägga till och ta bort i DB.

