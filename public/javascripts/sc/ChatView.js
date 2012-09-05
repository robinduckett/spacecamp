define(function(require, exports, module) {
    var Backbone = require('backbone'),
        io  = require('socket.io'),
        logger = require('logger');

    var RoomView = require('sc/RoomView');

    var ChatModel = Backbone.Model.extend({
    });

    var ChatView = Backbone.View.extend({
        events: {
            'keydown .privmsg_send': 'sendMessage'
        },

        initialize: function() {
            this.setupModel();

            this.roomView = new RoomView();
            this.template = _.template($('#chat_view_template').html())

            var self = this;

            window.onunload = function() {
                self.unloadSpacecamp();
            };
        },

        unloadSpacecamp: function() {
            if (this.socket) {
                this.socket.emit('leave', this.model.toJSON());
            }
        },

        sendMessage: function(event) {
            if (this.socket && event.keyCode === 13) {
                var details = this.model.toJSON();
                details.message = $(event.target).val();
                this.socket.emit('privmsg', details);
                
                $(event.target).val('');

                return false;
            }
        },

        connect: function() {
            if (this.model.get('nickname')) {
                var self = this;

                this.socket = io.connect('http://localhost:3000');
                this.render();
                this.roomView.model.set('room', this.model.get('room'));

                this.socket.on('connect', function() {
                    self.roomView.log('Connected');
                    self.socket.emit('join', self.model.toJSON());
                });

                this.socket.on('disconnect', function() {
                    self.roomView.log('Disconnected');
                });

                this.socket.on('join', function(data) {
                    self.roomView.joined(data);
                });

                this.socket.on('leave', function(data) {
                    self.roomView.left(data);
                });

                this.socket.on('privmsg', function(data) {
                    if (data.room === self.model.get('room')) {
                        self.roomView.message(data);
                    }
                });

                this.socket.on('names', function(data) {
                    if (data.room === self.model.get('room')) {
                        self.roomView.names(data);
                    }
                });
            } else {
                this.setupModel();
                this.connect();
            }
        },

        render: function() {
            this.setElement($('#chatcontainer')[0]);
            this.$el.html(this.template(this.model.toJSON()));

            this.roomView.setParent(this);

            return;
        },

        setupModel: function() {
            this.model = new ChatModel();

            var chat_model = localStorage.getItem('chat_model');
            if (chat_model !== null)  {
                this.model.set(JSON.parse(chat_model));
            } else {
                var name = prompt('Please enter your name (this will only be asked for once)');

                if (name !== false) {
                    this.model.set({
                        'nickname': name
                      , 'room': 'general'
                    });

                    localStorage.setItem('chat_model', JSON.stringify(this.model.toJSON()));
                }
            }

            return;
        }
    });

    return ChatView;
});