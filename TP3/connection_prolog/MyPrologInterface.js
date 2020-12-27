class MyPrologInterface {
    constructor(orchestrator) {
        this.orchestrator = orchestrator;
    }

    gameOver() {
        this.getRequest(`game_over(${this.orchestrator.gameboard.toString()},${this.orchestrator.gameboard.size},${this.orchestrator.currentPlayer})`);
    }

    getPossibleMoves(tile) {
        this.getRequest(`checkMove(${this.orchestrator.gameboard.toString()},${this.orchestrator.gameboard.size},${tile.row},${tile.column},${this.orchestrator.currentPlayer})`);
    }

    canChooseTile(tile) {
        this.getRequest(`validateContent(${this.orchestrator.gameboard.toString()},${this.orchestrator.gameboard.size},${tile.row}-${tile.column},${this.orchestrator.currentPlayer})`);
    }

    canMoveToTile(tile) {
        this.getRequest(`verifyOrtMove(${this.orchestrator.gameboard.toString()},${this.orchestrator.currentPlayer},${this.orchestrator.selectedTile.row}-${this.orchestrator.selectedTile.column},${tile.row}-${tile.column})`);
    }

    canRemovePiece(tile) {
        this.getRequest(`verifyPlayer(${this.orchestrator.gameboard.toString()},${tile.row}-${tile.column},${this.orchestrator.currentPlayer})`);
    }

    hasAnyPossibleMoves() {
        this.getRequest(`valid_moves(${this.orchestrator.gameboard.toString()},${this.orchestrator.gameboard.size},${this.orchestrator.currentPlayer})`);
    }

    botPlay(difficulty) {
        this.getRequest(`choose_move(${this.orchestrator.gameboard.toString()},${this.orchestrator.gameboard.size},${this.orchestrator.currentPlayer},'${difficulty}')`);
    }

    getRequest(command) {
        getPrologRequest(command, this.orchestrator.receivedReply, this.orchestrator);
    }

    handshake() {
        const port = 8081;
        const request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:' + port + '/handshake', false);

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset-UTF-8');
        request.send();
        if (JSON.parse(request.responseText) === 'handshake')
            console.log('Handshake successfully');
        else
            console.log('Handshake failed')
    }

    quit() {
        const request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:8081/quit', false);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset-UTF-8');
        request.send();
        if(JSON.parse(request.responseText) === "goodbye")
            console.log("Quit successfully");
        else
            console.log('Quit failed');
    }
}

function success(data) {
    this.callback.apply(data.target.orchestrator, [JSON.parse(data.target.response)]);
}

function error() {
    console.log("ERROR on the request");
}

function getPrologRequest(stringRequest, callback, orchestrator) {
    const port = 8081;
    const request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:' + port + '/' + stringRequest, true);
    request.callback = callback;
    request.arguments = Array.prototype.slice.call(arguments, 2);
    request.orchestrator = orchestrator;
    request.onload = success;
    request.onerror = error;

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset-UTF-8');
    request.timeout=5000;
    request.send();
}