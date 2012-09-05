define(function(require, exports, module) {
    var Backbone = require('backbone'),
        io  = require('socket.io'),
        logger = require('logger');

    var MessageView = require('sc/MessageView'),
        UserView = require('sc/UserView');

    var RoomModel = Backbone.Model.extend({
        defaults: {
            room: 'general'
        }
    });

    var RoomView = Backbone.View.extend({
        initialize: function() {
            this.model = new RoomModel();
            this.userView = new UserView();
        },

        setParent: function(parent) {
            this.parent = parent;
            var element = $('div.log', this.parent.el);
            this.userView.setParent(this);
            this.setElement(element);
        },

        log: function(message) {
            var msg = new MessageView('Server', message);
            this.append(msg);
        },

        joined: function(data) {
            this.log(data.nickname + ' has joined the room');
            this.userView.joined(data.nickname);
        },

        left: function(data) {
            this.log(data.nickname + ' has left the room');
            this.userView.left(data.nickname);
        },

        names: function(data) {
            this.userView.model.set('names', data.names);
            this.userView.update();
        },

        message: function(data) {
            var msg = new MessageView(data.nickname, data.message);
            this.append(msg);
        },

        append: function(messageView) {
            var latest = this.$el.append(messageView.render());

            this.$el.stop(false, false).animate({
                scrollTop: this.el.scrollHeight
            }, 1000);
        }
    });

    return RoomView;
});