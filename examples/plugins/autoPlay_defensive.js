module.exports = function(API){
  const { OperationType, VariableType, ConnectionState, AllowFlags, Direction, CollisionFlags, CameraFollow, BackgroundType, GamePlayState, Callback, Utils, Room, Replay, Query, RoomConfig, Plugin, Renderer, Errors, Language, Impl } = API;

  Object.setPrototypeOf(this, Plugin.prototype);
  Plugin.call(this, "autoPlay_defensive", true, { // "autoPlay_defensive" is plugin's name, "true" means "activated just after initialization". Every plugin should have a unique name.
    version: "0.2",
    author: "abc",
    description: `This is an auto-playing bot that follows the ball if it is near enough, otherwise goes back and tries to be just in the midpoint of ball and his team's goal line; and kicks the ball whenever it is nearby without any direction checking. This bot uses real events and controls real players.`,
    allowFlags: AllowFlags.CreateRoom | AllowFlags.JoinRoom // We allow this plugin to be activated on both CreateRoom and JoinRoom.
  });

  // parameters are exported so that they can be edited outside this class.
  this.minCoordAlignDelta = this.defineVariable({
    name: "minCoordAlignDelta",
    description: "Minimum delta value for coordinate alignment", 
    type: VariableType.Number,
    value: 0.5, 
    range: {
      min: 0,
      max: 10,
      step: 0.5
    }
  });

  this.minKickDistance = this.defineVariable({
    name: "minKickDistance",
    description: "Minimum distance between ball and bot player for the bot player to start kicking the ball", 
    type: VariableType.Number,
    value: 8, 
    range: {
      min: 0,
      max: 15,
      step: 0.5
    }
  });

  this.maxDistanceToFollowBallCoeff = this.defineVariable({
    name: "maxDistanceToFollowBallCoeff",
    description: "Coefficient of max distance between ball and player for the bot to follow ball; otherwise it goes back to defense.", 
    type: VariableType.Number,
    value: 0.2, 
    range: {
      min: 0,
      max: 1,
      step: 0.01
    }
  });

  var room = null, that = this;

  // is needed for ball follow logic to pause.
  // notice that this is being updated not only onPositionsReset
  var lastPositionsReset = 0;

  // move bot in random Y direction
  // to prevent stucking on hitting a ball on a same spot in a same manner.
  // it also fixes a bug when the bot doesn't move after positions resets
  // BUT instead, it creates a new bug... This is not the solution... Must change...
  var moveInRandomY = function(){
    room && room.setKeyState(
      Utils.keyState(0, [1, -1][Math.floor(Math.random() * 2)], false)
    );
  };

  this.initialize = function(_room){
    room = _room;
  };

  this.finalize = function(){
    room = null;
  };

  this.onGameStart = function(){
    lastPositionsReset = Date.now();
    moveInRandomY();
  };

  this.onGameTick = function(customData){
    // do not apply ball follow logic for maybe 150ms.
    // is needed for moveInRandomY() to work
    if (Date.now() - lastPositionsReset < 150) return;

    var { state, gameState, gameStateExt } = room;
    gameState = gameStateExt || gameState;

    var cp = state.players.filter((x)=>(x.id==room.currentPlayerId))[0];
    var playerDisc = cp.disc;
    if (!playerDisc)
      return;
    var teamId = cp.team.id, opponentTeamId = 3 - teamId;
    var goals = state.stadium.goals, ball = gameState.physicsState.discs[0];
    /*
    var minDistSqr = Infinity, minDistOpponent;
    state.players.forEach((x)=>{
      if (x.team.id == opponentTeamId){
        var distSqr = (playerDisc.pos.x-x.pos.x)*(playerDisc.pos.x-x.pos.x)+(playerDisc.pos.y-x.pos.y)*(playerDisc.pos.y-x.pos.y);
        if (distSqr < minDistSqr){
          minDistSqr = distSqr;
          minDistOpponent = x;
        }
      }
    });
    */
    var targetX, targetY, sqrDistBetweenBallAndPlayer = (ball.pos.x-playerDisc.pos.x) * (ball.pos.x-playerDisc.pos.x) + (ball.pos.y-playerDisc.pos.y) * (ball.pos.y-playerDisc.pos.y);
    var maxDistanceToFollowBall = that.maxDistanceToFollowBallCoeff * state.stadium.width;
    var b = false;

    if (sqrDistBetweenBallAndPlayer > ((playerDisc.radius + ball.radius + maxDistanceToFollowBall) * (playerDisc.radius + ball.radius + maxDistanceToFollowBall))){
      var myGoal = goals.filter((g)=>(g.team.id==teamId))[0]; //, opponentGoal = goals[oppositeTeamId - 1];
      if (!myGoal)
        return;
      var MPofMyGoalX = (myGoal.p0.x + myGoal.p1.x) / 2, MPofMyGoalY = (myGoal.p0.y + myGoal.p1.y) / 2;
      targetX = (ball.pos.x + MPofMyGoalX) / 2;
      targetY = (ball.pos.y + MPofMyGoalY) / 2;
    }
    else{
      targetX = ball.pos.x;
      targetY = ball.pos.y;
      b = true;
    }

    var deltaX = targetX - playerDisc.pos.x, deltaY = targetY - playerDisc.pos.y, dirX, dirY, kick;
    if (Math.abs(deltaX) < that.minCoordAlignDelta)
      dirX = 0;
    else 
      dirX = Math.sign(deltaX);
    if (Math.abs(deltaY) < that.minCoordAlignDelta)
      dirY = 0;
    else
      dirY = Math.sign(deltaY);

    //f(ball.pos.x, ball.pos.y, playerDisc.pos.x, playerDisc.pos.y, myGoal.p0.x, myGoal.p0.y, myGoal.p1.x, myGoal.p1.y)

    //var angle_PlayerToBall = Math.atan2(ball.pos.y-playerDisc.pos.y, ball.pos.x-playerDisc.pos.x);
    //var angle_BallToGoalDisc1 = Math.atan2(myGoal.p0.y-ball.pos.y, myGoal.p0.x-ball.pos.x);
    //var angle_BallToGoalDisc2 = Math.atan2(myGoal.p1.y-ball.pos.y, myGoal.p1.x-ball.pos.x);

    kick = (sqrDistBetweenBallAndPlayer < (playerDisc.radius + ball.radius + that.minKickDistance) * (playerDisc.radius + ball.radius + that.minKickDistance));

    /*
    if (b && kick){  // for dribball maps, reverse the moving direction while kicking the ball
      dirX=-dirX;
      dirY=-dirY;
    }
    */
    
    // apply current keys
    room.setKeyState(Utils.keyState(dirX, dirY, kick));
  };

  this.onPlayerTeamChange = function(id){
    if (id === room.currentPlayerId) {
      lastPositionsReset = Date.now();
      moveInRandomY();
    }
  };

  this.onPositionsReset = function(){
    lastPositionsReset = Date.now();
    moveInRandomY();
  };
};
