{% extends '../layouts/main.swig' %}

{% block scripts %}
    <script type="application/javascript" src="/js/profile.js"></script>
{% endblock %}

{% block content %}
    <button id="grab-all">
        Download full collection
    </button>
    {% for audio in data %}
        <p>
            <a href="{{audio.url}}" download="{{audio.artist}} - {{audio.title}}">
                <b>{{audio.artist}}</b> - {{audio.title}}
            </a>
        </p>
    {% endfor %}
{% endblock %}