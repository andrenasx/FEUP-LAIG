/**
 * @abstract
 * Generic GameState
*/

class GameState {
    constructor(gameOrchestrator) {
        this.gameOrchestrator = gameOrchestrator;
    }

    pickTile(tile) {}

    pickObj(id) {}

    animationEnd() {}

    cameraEnd(){}

    receivedReply(message) {}
}