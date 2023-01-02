module.exports = function({ OperationType, VariableType, ConnectionState, Utils, Plugin, Replay, Room }){

  Object.setPrototypeOf(this, Plugin.prototype);
  Plugin.call(this, "controlOtherPlayers", true, { // "controlOtherPlayers" is plugin's name, "true" means "activated just after initialization". Every plugin should have a unique name. Every plugin should have a unique name.
    version: "0.1",
    author: "abc",
    description: `This plugin lets you take control of every player in the room. This should be improved with a permission mechanism.
    Available commands: 
    - !control [id]: Take control of the player whose playerId=[id].
    - !blockControl [id] [value={0, 1}]: Block/unblock taking control of the player whose playerId=[id].`,
    allowFlags: Plugin.AllowFlags.CreateRoom // We allow this plugin to be activated on CreateRoom only.
  });

  var room, controlSwitch = {}, controlSwitchBlocked = {};

  this.initialize = function(_room){
    room = _room;
  };

  this.finalize = function(){
    room = null;
    controlSwitch = null;
    controlSwitchBlocked = null;
  };

  var setControlledPlayer = function(byPlayerId, playerIdToBeControlled){
    if (isNaN(byPlayerId) || isNaN(playerIdToBeControlled) || controlSwitchBlocked[playerIdToBeControlled])
      return;
    /*
    if (!controlPermitted[byPlayerId]) // example for custom permission logic
      return;
    */
    if (!room.getPlayerOriginal(playerIdToBeControlled))
      playerIdToBeControlled = byPlayerId;
    controlSwitch[byPlayerId] = playerIdToBeControlled;
  };

  var blockControlPlayer = function(byPlayerId, playerId, value){
    if (isNaN(playerId))
      return;
    /*
    if (!blockControlPermitted[byPlayerId]) // example for custom permission logic
      return;
    */
    if (!room.getPlayerOriginal(playerId))
      return;
    controlSwitchBlocked[playerId] = (value == 1);
  };

  this.onOperationReceived = function(operation, msg, customData){
    var playerId = operation.getValue(msg, "byPlayerId");
    var cs = controlSwitch[playerId];
    if (cs != null && !controlSwitchBlocked[playerId]) // if the player is marked to be controlled by someone else, and the player has not protected himself being controlled,
      operation.setValue(msg, "byPlayerId", cs); // this is where the magic happens: modify event's player id so that it will look like it has come from someone else.
    switch (operation.type){
      case OperationType.SendChat:{
        /*
        var m = operation.getValue(msg, "text");
        if (m.startsWith("!")){  // custom chat logic for extra commands
        */
        if (customData.isCommand){ // same as above 2 lines.
          var arr = customData.data; // same as var arr = m.trimEnd().split(" ");
          switch (arr[0]){
            case "!control":
              setControlledPlayer(playerId, parseInt(arr[1])); // must use original playerId to be able to take back control of your own player
              break;
            case "!blockControl":
              blockControlPlayer(playerId, parseInt(arr[1]), parseInt(arr[2])); // must use original playerId to be able to take back control of your own player
              break;
          }
          //return false; // do not block this event from being processed. it is done automatically in onAfterOperationReceived. 
        }
        break;
      }
    }
    return true;
  };

  this.onPlayerLeave = function(playerObj, reason, isBanned, byId, customData){
    // get player's id
    var id = playerObj.V;

    // free extra memory allocated
    delete controlSwitch[id];
    delete controlSwitchBlocked[id];
  };
};
