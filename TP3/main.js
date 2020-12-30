//From https://github.com/EvanHahn/ScriptInclude
include=function(){function f(){var a=this.readyState;(!a||/ded|te/.test(a))&&(c--,!c&&e&&d())}var a=arguments,b=document,c=a.length,d=a[c-1],e=d.call;e&&c--;for(var g,h=0;c>h;h++)g=b.createElement("script"),g.src=arguments[h],g.async=!0,g.onload=g.onerror=g.onreadystatechange=f,(b.head||b.getElementsByTagName("head")[0]).appendChild(g)};
serialInclude=function(a){var b=console,c=serialInclude.l;if(a.length>0)c.splice(0,0,a);else b.log("Done!");if(c.length>0){if(c[0].length>1){var d=c[0].splice(0,1);b.log("Loading "+d+"...");include(d,function(){serialInclude([]);});}else{var e=c[0][0];c.splice(0,1);e.call();};}else b.log("Finished.");};serialInclude.l=new Array();

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
    function(m,key,value) {
      vars[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return vars;
}	 
//Include additional files here
serialInclude(['../lib/CGF.js', 'XMLscene.js', 'MySceneGraph.js', 'MyInterface.js', 'MySceneGraphNode.js', 'MyAnimatedCamera.js', 'EasingFunctions.js',  
                './primitives/MyRectangle.js', './primitives/MyTriangle.js', './primitives/MySphere.js', './primitives/MyCylinder.js', './primitives/MyTorus.js', './primitives/MyCircle.js', './primitives/MyCylinderSide.js', './primitives/MyPlane.js', './primitives/MyPatch.js', './primitives/MyDefbarrel.js', './primitives/MyCube.js', './primitives/MyTrapeze.js', './primitives/MyPyramid.js', './primitives/MyCone.js',
                './keyframes/MyAnimation.js', './keyframes/MyKeyframeAnimation.js', 
                './spritesheets/MySpritesheet.js', './spritesheets/MySpriteText.js', './spritesheets/MySpriteAnimation.js', 
                './game/MyPiece.js', './game/MyTile.js', './game/MyGameBoard.js', './game/MyAuxiliarBoard.js', './game/MyGameOrchestrator.js', './game/MyGameSequence.js', './game/MyAnimator.js', './game/MyGameMove.js', './game/MyMenu.js', './game/MyButton.js',
                './game/GameStates/GameState.js', './game/GameStates/CheckMovesState.js', './game/GameStates/SelectState.js', './game/GameStates/MoveState.js', './game/GameStates/RemoveState.js', './game/GameStates/CheckGameOverState.js', './game/GameStates/ChangePlayerState.js', './game/GameStates/GameOverState.js', './game/GameStates/BotState.js',
                './connection_prolog/MyPrologInterface.js',

main=function()
{   

    timeSelected = document.getElementById("myRange").value;
  
  
    const size = document.querySelector('#board-size');
    size.addEventListener('click', () => {
      selected = size.querySelector('input[value="6"]').checked ? "6" 
      : size.querySelector('input[value="8"]').checked ? "8" 
      : null
    });

    document.querySelectorAll('article').forEach((player) => addDropdown(player));
    document.querySelector('div > input').addEventListener('click', () => {
        let error = false;
        const values = ['player-1', 'player-2'].map((player) => {
          const playerArticle = document.querySelector(`#${player}`);
          let playerType = playerArticle.querySelector('input[value="human"]').checked ? "Player" 
          : playerArticle.querySelector('input[value="robot"]').checked ? playerArticle.querySelector('select').value
          : null;
          if(!playerType){
            error = true;
            return null;
          }
          return {
            type: playerType
          }
        });

        if(!error && selected){
          document.querySelector('.wrapper').style.display = "none";
          document.querySelector('#panel').style.display = "block";
            // Standard application, scene and interface setup
            var app = new CGFapplication(document.body);
            var myInterface = new MyInterface();
            var myScene = new XMLscene(myInterface, values[0].type, values[1].type, parseInt(selected), parseInt(timeSelected));

            app.init();

            app.setScene(myScene);
            app.setInterface(myInterface);

            myInterface.setActiveCamera(myScene.camera);

            // start
            app.run();        
          }
      });
}

]);

function addDropdown(player){
  
    player.querySelector('input[value="robot"]').addEventListener('change', () => {
      player.querySelector('select').style.display="block";
    });
  
    player.querySelector('input[value="human"]').addEventListener('change', () => {
      player.querySelector('select').style.display="none";
    });
  }