/**
 * @abstract
 * Generic GameState
*/

class GameState {
    constructor(gameOrchestrator) {
        this.gameOrchestrator = gameOrchestrator;
    }

    /**
     * @abstract
    */
    pickTile(tile) {
        throw new Error("Abstract GameState method pickTile()");
    }

    /**
     * @abstract
    */
    animationEnd() {
        throw new Error("Abstract GameState method animationEnd()");
    }

    /**
     * @abstract
    */
    receivedReply(message) {
        throw new Error("Abstract GameState method receivedReply()");
    }
}