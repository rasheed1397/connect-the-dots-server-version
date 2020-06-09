'use strict';

const node = document.getElementById('app');

// Update the second argument to `Elm.Main.embed` with your selected API.
// See `doc/intro.md` for more information.
const app = Elm.Main.embed(node, {
    api: 'Http',
    hostname: 'http://localhost:8080',
});

app.ports.startTimer.subscribe((int) => {
    setTimeout(() => {
        app.ports.timeout.send(int);
    }, 10000);
});