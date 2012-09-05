define(function(require, exports, module) {
    var Backbone = require('backbone');

    var UserModel = Backbone.Model.extend({
        defaults: {
            names: []
        }
    });

    var UserView = Backbone.View.extend({
        initialize: function() {
            var self = this;

            this.model = new UserModel();

            this.model.on('changed:names', function() {
                console.log('got here');
                self.update();
            });

            this.template = _.template($('#user_view_template').html());
            this.listItemTemplate = _.template($('#user_list_item_template').html());
        },

        setParent: function(parent) {
            this.parent = parent;
            var element = $('div.userlist', this.parent.parent.el);
            this.setElement(element);
        },

        left: function(nickname) {
            var names = this.model.get('names');

            console.log('left');

            if (names.indexOf(nickname) > -1) {
                names.splice(names.indexOf(nickname), 1);
                names.sort();

                this.model.set('names', names);
                this.model.trigger('changed:names');
            }
        },

        joined: function(nickname) {
            var names = this.model.get('names');

            console.log('joined');

            console.log(names, nickname);

            if (names.indexOf(nickname) === -1) {
                names.push(nickname);
                names.sort();

                this.model.set('names', names);
                this.model.trigger('changed:names');
            }
        },

        names: function(names) {
            console.log('names');
            this.model.set('names', names);
            this.model.trigger('changed:names');
        },

        render: function() {
            var self = this;
            var names = this.model.get('names');
            var renderedNames = this.renderNames(names);

            this.$el.html(this.template({names: renderedNames.join('')}));
        },

        renderNames: function(names) {
            var self = this;
            var nameViews = [];

            names.forEach(function(name) {
                nameViews.push(self.listItemTemplate({name: name}));
            });

            return nameViews;
        },

        update: function() {
            // TODO: Update dom rather than re-rendering
            this.render();
        }
    });

    return UserView;
});