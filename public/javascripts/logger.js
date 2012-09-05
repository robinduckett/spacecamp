define(function(require, exports, module) {
    var MessageView = require('sc/MessageView');

    return {
        log: function(message) {
            var log = $('#log');

            var msg = new MessageView('Server', message);

            log.append(msg.render());
        }
    };
});