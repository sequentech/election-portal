# Widgets

## Introduction

Agora Voting intends to be as flexible as possible without compromising
security. This document explains how a set of web widgets work. These widgets
can be embedded in a third party web application, providing a powerful way to
integrate with Agora Voting.

### Voting booth

To embed the voting booth widget, you need to add something like:

    <a class="agoravoting-voting-booth" href="https://<AGORAFQDN>/#/election/<ELECTION-ID>" data-authorization-funcname="getHMAC" data-seed-funcname="getSeed">Votar con Agora Voting</a>
    <script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="https://<AGORAFQDN>/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","agoravoting-widgets-js");</script>

You need to provide a function name using the data-authorization-funcname. Using the Web Messaging API, this function will be called when the cast ballot widget needs authorization to send the ballot. The function will receive as an argument the callback function to be called once the authorization is available, to make the call asynchronous.

The data-seed-funcname is optional, follows exactly the same signature and inner working as data-authorization-funcname, and uses de authenticated voterid as a seed for randomizing sorting options.

### Verify ballot

To embed the cast ballot widget, you need to add something like:

    <a class="agoravoting-verify-ballot" href="https://<AGORAFQDN>/#/election/<ELECTION-ID>">Verificar mi voto con Agora Voting</a>
    <script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="https://<AGORAFQDN>/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","agoravoting-widgets-js");</script>

### Election small

To embed the election small widget, you need to add something like:

    <a class="agoravoting-election-small" href="https://<AGORAFQDN>/#/election/<ELECTION-ID>">Votación con Agora Voting</a>
    <script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="https://<AGORAFQDN>/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","agoravoting-widgets-js");</script>

### Election details

To embed the election details widget, you need to add something like:

    <a class="agoravoting-election-details" href="https://<AGORAFQDN>/#/election/<ELECTION-ID>">Votación con Agora Voting</a>
    <script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="https://<AGORAFQDN>/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","agoravoting-widgets-js");</script>
