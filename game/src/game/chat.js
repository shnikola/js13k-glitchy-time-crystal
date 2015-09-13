function Chat() {
  this.messages = [];
  this.chatting = false;
  this.input = document.getElementById('chaty');
  var self = this;

  this.input.onfocus = function() {
    self.clearInput();
    self.chatting = true;
  };

  this.input.onkeyup = function(e) {
    if (e.keyCode == 13 || e.keyCode == 27) {
      if (e.keyCode == 13 && self.input.value) { SOCKET.emit('chatMsg', self.input.value); } // On Enter
      self.chatting = false;
      self.clearInput();
      self.input.blur();
    }
  };

  this.input.onfocusout = function() {
    self.clearInput();
  };
}

Chat.prototype.toggle = function(bool) {
  this.input.style.display = bool ? 'block' : 'none';
};

Chat.prototype.pushMessage = function(m) {
  m.ttl = 300;
  this.messages.unshift(m);
};

Chat.prototype.clearInput = function() {
  this.input.value = '';
};

Chat.prototype.draw = function(c) {
  c.fillStyle = 'white';
  for (var i = this.messages.length - 1; i >= 0; i--) {
    if (this.messages[i].ttl <= 0){
      this.messages.splice(i, 1);
    } else {
      if (this.messages[i].ttl < 100){
        c.fillStyle = "rgba(255, 255, 255," + this.messages[i].ttl/100 + ")";
      }
      c.fillText("Player " + this.messages[i].id + ": " + this.messages[i].text, 10, 470 - i*15);
      c.fillStyle = "rgba(255, 255, 255, 1.0)";
      this.messages[i].ttl--;
    }
  }
};

Chat.prototype.keyup = function(e) {
  if (e.keyCode == 84 && document.activeElement != this.input) {
    this.input.focus();
  }
};
