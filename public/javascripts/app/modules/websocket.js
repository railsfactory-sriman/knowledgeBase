var ShapadoSocket = {
  initialize: function() {
    WEB_SOCKET_SWF_LOCATION = "/javascripts/web-socket-js/WebSocketMain.swf";

    var config = $("#websocket");
    this.error_count = 0;
    this.ws = new WebSocket("ws://"+config.attr("data-host")+":34567/");
    this.socket_key = null;


    this.ws.onmessage = function(evt) {
      ShapadoSocket.parse(evt.data);
    };

    window.webSocketError = function(message) {
      console.error(decodeURIComponent(message));
      ShapadoSocket.error_count += 1;
    }

    this.ws.onclose = function() {
      if(ShapadoSocket.error_count < 3)
        setTimeout(ShapadoSocket.initialize, 5000)
    };

    this.ws.onopen = function() {
      ShapadoSocket.send({id: 'start', key: config.attr("data-key"), channel_id: config.attr("data-group")});
    };
  },
  add_chat_message: function(from, message) {
    $("#chat_div").chatbox("option", "boxManager").addMsg(from, message);
  },
  parse: function(data) {
    var data = JSON.parse(data);

    window.console && console.log("received: ");
    window.console && console.log(data);

    switch(data.id) {
      case 'chatmessage': {
        ShapadoSocket.add_chat_message(data.from, data.message);
      }
      break;
      case 'newquestion': {
        ShapadoUI.new_question(data);
      }
      break;
      case 'updatequestion': {
        ShapadoUI.update_question(data);
      }
      break;
      case 'destroyquestion': {
        ShapadoUI.delete_question(data);
      }
      break;
      case 'newanswer': {
        ShapadoUI.new_answer(data);
      }
      break;
      case 'updateanswer': {
        ShapadoUI.update_answer(data);
      }
      break;
      case 'vote': {
        ShapadoUI.vote(data);
      }
      break;
      case 'newcomment': {
        ShapadoUI.new_comment(data);
      }
      break;
      case 'updatedcomment': {
        ShapadoUI.update_comment(data);
      }
      break;
      case 'newactivity': {
        ShapadoUI.new_activity(data);
      }
      break;
    }
  },
  send: function(data) {
    this.ws.send(JSON.stringify(data))
  }
};
