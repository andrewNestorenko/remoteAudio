document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#save').addEventListener('click', save);
});
function save() {
    var saved = document.querySelector('[name="enabled"]').value;
    localStorage['enabled'] = !!saved;
}