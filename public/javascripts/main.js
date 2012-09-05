requirejs.config({
    shim: {
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'bootstrap': {
            deps: ['jquery']
        },
        '../socket.io/socket.io': {
            deps: ['jquery'],
            exports: 'io'
        }
    },

    map: {
        '*': {
            'socket.io': '../socket.io/socket.io'
        }
    }
});

function loadTemplates(templates) {
    var head = $('head');
    
    _.each(templates, function(template, key) {
        var scriptTemplate = $('<script type="text/template" id="' + key + '_template"></script>');
        scriptTemplate.html(template);

        head.append(scriptTemplate);
    });
}

require([
    'jquery',
    'text!templates/chat_view.ejs', 
    'text!templates/message_view.ejs', 
    'text!templates/user_list_item.ejs', 
    'text!templates/user_view.ejs',
    'sc/ChatView'
], function($, ChatViewTemplate, MessageViewTemplate, UserListItemTemplate, UserViewTemplate, ChatView) {
    loadTemplates({
        chat_view: ChatViewTemplate,
        message_view: MessageViewTemplate,
        user_list_item: UserListItemTemplate,
        user_view: UserViewTemplate
    });

    var chatView = new ChatView();
    chatView.connect();
});