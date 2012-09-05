define(function(require, exports, module) {
    var Backbone = require('backbone');
    var moment = require('moment');

    var MessageModel = Backbone.Model.extend({
    });

    var MessageView = Backbone.View.extend({
        initialize: function(username, message) {
            this.model = new MessageModel();

            this.model.set({
                time: new Date(),
                nickname: username,
                message: message
            });

            this.template = _.template($('#message_view_template').html())
        },
        render: function() {
            var time  = this.model.get('time');
            this.model.set('displayTime', moment(time).format('HH:mm:ss'));
            return this.template(this.model.toJSON());
        },
    });

    return MessageView;
});