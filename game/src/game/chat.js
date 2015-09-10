function Chat() {
  var messages = [],
      chatting = false,
      input = document.getElementById('chaty'),
      api = {
        pushMessage: function(m) {
          m.ttl = 300;
          messages.unshift(m);
        },
        chatting: function() {
          return chatting;
        },
        clearInput: function() {
          input.value = '';
        },
        draw: function(c) {
          c.fillStyle = 'white';
          c.fillText("CHATy: press 't' to START yap yap, 'enter' to submit, 'esc' to QUIT yer yappin", 10, 30);

          // draw and decay chat messages
          for (var i = messages.length - 1; i >= 0; i--) {
            if (messages[i].ttl <= 0){
              messages.splice(i, 1);
            }
            else {
              if (messages[i].ttl < 100){
                c.fillStyle = "rgba(255, 255, 255," + messages[i].ttl/100 + ")";
              }
              c.fillText("Player " + messages[i].id + ": " + messages[i].text, 10, 470 - i*15);
              c.fillStyle = "rgba(255, 255, 255, 1.0)";
              messages[i].ttl--;
            }
          }
        },
        keyup: function(e) {
          if (e.keyCode == 84 && document.activeElement != input) {
            input.focus();
            chatting = true;
          }
        }
      };

      input.onkeyup = function(e) {
        if (e.keyCode == 13 || e.keyCode == 27) {
          if (e.keyCode == 13 && input.value) { SOCKET.emit('chat_msg', input.value); } // On Enter
          chatting = false;
          api.clearInput();
          input.blur();
        }
      };

      input.onfocusout = api.clearInput;
      input.onfocus = function() {
        chatting = true;
      };

  return api;
}
