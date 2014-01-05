<html>
    <head>
        <title>
            {%  block title %}
                Audio player
            {% endblock %}
        </title>
        <script src="/vendors/bower_components/jquery/jquery.min.js"></script>
        <link rel="stylesheet" href="/vendors/bower_components/bootstrap/dist/css/bootstrap.css"/>
        <script src="/vendors/bower_components/bootstrap/dist/js/bootstrap.js"></script>

        <script src="/socket.io/socket.io.js"></script>
        <script src="/js/main.js"></script>
    </head>
    <body>

    {% include "../blocks/navigation.swig" %}
    <div class="container">
        <p>
            {% block content%}{% endblock %}
        </p>
    </div><!-- /.container -->

    </body>
</html>