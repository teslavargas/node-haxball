function init(headless, roomCallback){
  const API = abcHaxballAPI(window,{
    noVariableValueChangeEvent: true
    /*
    proxy: {
      WebSocketChangeOriginAllowed: false,
      WebSocketUrl: "wss://surf-emerald-armadillo.glitch.me/",
      HttpUrl: "https://surf-emerald-armadillo.glitch.me/rs/"
    }
    */
  }); // if you use our haxballOriginModifier extension, you don't need a proxy server. (But you still have to serve the files, you cannot open the html directly.)

  const { OperationType, VariableType, ConnectionState, AllowFlags, Direction, CollisionFlags, CameraFollow, BackgroundType, GamePlayState, BanEntryType, Callback, Utils, Room, Replay, Query, Library, RoomConfig, Plugin, Renderer, Errors, Language, EventFactory, Impl } = API;

  if (!headless){
    Callback.add("KeyDown"); // this defines room._onKeyDown(). We will use this callback when keyDown event happens. It will trigger all roomConfig, plugin and renderer callbacks.
    Callback.add("KeyUp"); // this defines room._onKeyUp(). We will use this callback when keyUp event happens. It will trigger all roomConfig, plugin and renderer callbacks.
    Callback.add("MouseDown"); // this defines room._onMouseDown(). We will use this callback when mouseDown event happens. It will trigger all roomConfig, plugin and renderer callbacks.
    Callback.add("MouseUp"); // this defines room._onMouseUp(). We will use this callback when mouseUp event happens. It will trigger all roomConfig, plugin and renderer callbacks.
  }

  function doAction(params){
    var pluginsArray = [], librariesArray = [];
    if (params.autoPlay) // if we want autoPlay plugin
      pluginsArray.push(new plugins.autoPlay_defensive(API));
    if (params.aimbot) // if we want aimbot library
      librariesArray.push(new libraries.aimbot(API));
    switch (params.action){
      case "create":{
        Room.create({
          name: decodeURIComponent(params.r_name), 
          password: decodeURIComponent(params.r_pass), 
          maxPlayerCount: params.r_mpc,
          showInRoomList: params.r_sirl, 
          noPlayer: false,
          //playerCount: 25,
          //unlimitedPlayerCount: true,
          //fakePassword: false,
          geo: { lat: params.r_lat, lon: params.r_lon, flag: params.r_flag },
          token: params.token, 
        }, {
          storage: {
            crappy_router: false,
            player_name: params.p_name,
            avatar: params.p_avatar,
            geo: {
              lat: params.p_lat,
              lon: params.p_lon,
              flag: params.p_flag
            }
          }, 
          libraries: librariesArray,
          renderer: null,
          plugins: pluginsArray,
          onOpen: (room)=>{ 
            console.log("onOpen");
            roomCallback(room, params); 
          },
          onClose: ()=>{
            alert("The room has been closed.");
            window.close();
          }
        });
        break;
      }
      case "join":{
        params.p_pass = decodeURIComponent(params.p_pass);
        params.p_ak = decodeURIComponent(params.p_ak);
        params.p_name = decodeURIComponent(params.p_name);
        params.p_avatar = decodeURIComponent(params.p_avatar);
        var authPromise;
        if (params.p_ak=="")
          authPromise = Utils.generateAuth();
        else
          authPromise = Utils.authFromKey(params.p_ak);
        authPromise.then((x)=>{
          var authObj;
          if (params.p_ak=="")
            [params.p_ak, authObj] = x;
          else
            authObj = x;
          Room.join({
            id: params.r_id,
            password: params.r_pass,
            token: params.token,
            authObj: authObj
          }, {
            storage: {
              crappy_router: false,
              player_name: params.p_name,
              player_auth_key: params.p_ak,
              avatar: params.p_avatar,
              geo: {
                lat: params.p_lat,
                lon: params.p_lon,
                flag: params.p_flag
              }
            }, 
            libraries: librariesArray,
            renderer: null,
            plugins: pluginsArray,
            onOpen: (room)=>{ roomCallback(room, params); },
            onClose: (x)=>{
              x && alert(x.toString());
              window.close();
            }
          });
        }).catch((ex)=>{
          console.log(ex);
          alert("Auth key error.");
          window.close();
        });
        break;
      }
      case "watch":{
        roomCallback();
        break;
      }
    }
  }

  var params;
  try{
    var q = getQueriesAsJSON();
    switch (q["action"]){
      case "create":{
        params = readCreateRoomParameters(q);
        break;
      }
      case "join":{
        params = readJoinRoomParameters(q);
        break;
      }
      case "watch":{
        params = readWatchStreamParameters(q);
        break;
      }
      default:{
        console.log("Started with unrecognized parameters.");
        window.API = API;
        return;
      }
    }
  }catch(ex){
    alert(ex);
    window.close();
    return;
  }
  importLanguages(["englishLanguage"], ()=>{
    Language.current = new languages.englishLanguage(API);
    if (params.autoPlay)
      importPlugins(["autoPlay_defensive"], ()=>{
        if (headless)
          doAction(params);
        else
          importLibraries(["aimbot"], ()=>{
            importRenderers(["defaultRenderer"], ()=>{
              doAction(params);
            });
          });
      });
    else if (headless)
      doAction(params);
    else
      importLibraries(["aimbot"], ()=>{
        importRenderers(["defaultRenderer"], ()=>{
          doAction(params);
        });
      });
  });
  return API;
}