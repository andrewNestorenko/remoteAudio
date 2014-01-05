<!DOCTYPE html>
<html>
    <head>
        <title>
            {%  block title %}
                Audio player
            {% endblock %}
        </title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <link rel="stylesheet" href="/vendors/bower_components/bootstrap/dist/css/bootstrap.css"/>
        <link rel="stylesheet" href="/css/main.css"/>

        <script src="/socket.io/socket.io.js"></script>
        <script src="/js/main.js"></script>
    </head>
    <body>
    {% include "../blocks/navigation.swig" %}
    <div class="container">
        <p>
            {% block content%}{% endblock %}
        </p>
    </div>

    <script src="/vendors/bower_components/jquery/jquery.min.js"></script>
    <script src="/vendors/bower_components/bootstrap/dist/js/bootstrap.js"></script>
    {% block scripts %}{% endblock %}
    </body>
</html>