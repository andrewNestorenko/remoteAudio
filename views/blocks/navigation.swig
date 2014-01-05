<div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#">Remote audio player</a>
        </div>
        <div class="collapse navbar-collapse">
            <ul class="nav navbar-nav">
                <li {% if uri == '/' %} class="active" {% endif %}>
                    <a href="/">Home</a>
                </li>
                <li {% if uri == '/player' %} class="active" {% endif %}>
                    <a href="/player">Player</a>
                </li>
                <li {% if uri == '/contacts' %} class="active" {% endif %}>
                    <a href="/contacts">Contact</a>
                </li>
                <li>
                    <a href="#">
                        <i class="icon-large icon-play icon-white"></i>
                        Play
                    </a>
                </li>
                <li>
                    <a href="#">
                        <i class="icon-large icon-play icon-white"></i>
                        Pause
                    </a>
                </li>

                {% if user %}
                    <li>
                        <a href="/profile">
                            <i class="icon-large icon-play icon-white"></i>
                            Profile
                        </a>
                    </li>
                <li>
                    <a href="/logout">
                        <i class="icon-large icon-play icon-white"></i>
                        Logout
                    </a>
                </li>
                {% else %}
                    <li>
                        <a href="/auth/vkontakte">
                            <i class="icon-large icon-play icon-white"></i>
                            Login
                        </a>
                    </li>
                {% endif %}

            </ul>
        </div><!--/.nav-collapse -->
    </div>
</div>