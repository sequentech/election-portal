# Integración de votaciones con Agora Voting y Podemos

## Introducción

En este documento se va a exponer la forma de integrar la nueva versión de
Agora Voting con los subsistemas de Podemos.

## Botón para votar

La principal y más importante forma de integración es la inclusión, dentro de
la aplicación móvil de Podemos, de un botón que al pincharlo abra en un
navegador web la cabina de votación para votar.

Entendemos que Podemos se encargará de activar y desactivar la aparición del
botón de votar en su aplicación según si hay alguna votación activa o no, y
además también se encargará de generar un enlace específico para la votación en
curso, de la forma que se detalla en este documento.

El enlace que se genera servirá para autenticar al votante, y es una forma
segura de comunicación entre Podemos y Agora Voting de la validez de su
identidad con respecto a ese proceso de votación concreto.

## Procedimiento

El procedimiento para votar consta de los siguientes pasos:

### 1. El usuario está autenticado en la aplicación movil de Podemos

Se asume en este paso que el usuario tiene instalado en su móvil la "aplicación
movil de Podemos" (en adelante, "la aplicación"), que dicha aplicación se
está ejecutando, y que además el usuario está autenticado en la aplicación de
alguna manera.

### 2. El usuario pincha en un botón para votar dentro de la aplicación

El botón para votar sólo aparecerá (o sólo estará activo) en el caso de que haya
una votación en curso. Este es relevante de cara a la integración, debido a que
desde Agora Voting  estamos asumiendo que dicho botón no será activado una vez
terminada la  votación, y por tanto la cabina de votación sólo entrará en
detalles de  comprobar si se está en periodo de votación en el último paso,
cuando se envía  el voto al servidor.

Proponemos que en el botón se haga referencia a Agora Voting, por ejemplo
"Vota con Agora Voting" o "Vota" y el logo de Agora Voting dentro del botón (os
lo pasaremos si usáis ese método).  Más allá de eso, es también recomendable
dar información al usuario sobre la votación. Por ejemplo, puede aparecer
una línea antes del botón de votar que diga algo similar a "Hay una votación en
curso ¡participa!" y luego se muestre una lista con cada votación, con el
título de la votación y el botón de votar. Eso permitirá que en el caso de que
dos votaciones en algún momento se solapen en tiempos, la aplicación esté ya
diseñada para soportarlo.

Hemos de aclarar que cuando hablamos de que dos votaciones se solapen, no nos
referimos a diferentes preguntas. Nos referimos a procesos de votación
diferentes, con periodo de inicio y fin de votación distintos, se solapen en
tiempos.

Otra cuestión importante es que en el sistema de votación que provee Agora
Voting cada votante puede votar múltiples veces. No obstante, sólo se conserva
el último voto emitido por cada votante. Esto por tanto no es un fallo de
seguridad, sino por el contrario una medida de seguridad típica en sistemas
de voto electrónico seguro para reducir la coacción, y lo comentamos porque
implica que el botón para votar en una votación que aparecerá en la aplicación
no debe desaparecer cuando el votante haya votado.

De acuerdo a lo anterior, tampoco es estrictamente necesario que la aplicación
haga ningún seguimiento de si el votante ya ha pinchado en el botón de votar,
o de si ha pinchado en el botón de votar pero no ha terminado de votar, o de si
ha pinchado el botón de votar y efectivamente emitió correctamente su voto: se
puede sencillamente mostrar el botón de votar siempre que la votación esté en
curso.

### 3. La solicita a los servidores de Podemos unos credenciales para votar

Al clicar el botón de votar en la aplicación, debe haber una comunicación desde
esta aplicación (que se ejecuta en el móvil del usuario, el "cliente") con el
lado del servidor de la aplicación (el "servidor").

Esta comunicación es necesaria debido a que ha de generarse en ese instante un
credencial de autenticación que se incluirá en la url que en el paso
siguiente (paso 6), y dicho credencial:
1. será una cadena que incluye la fecha actual.
2. será "firmado" por el servidor de la aplicación para que Agora Voting pueda verificar que es válido de forma segura.

La fecha se incluye para que el credencial tenga una fecha de caducidad, por
razones de seguridad. De esa forma, el enlace que se abre en el paso 5 no
será valido pasado cierto periodo de tiempo, y será necesario generar desde
la aplicación un nuevo enlace para poder entrar de nuevo en la cabina de
votación.

Además, el credencial es "firmado" mediante un proceso llamado "HMAC" que se
detalla más adelante, que involucra una clave que sólo conoce el servidor de
Podemos (y de Agora Voting).

Debido a lo anterior, es claro que el botón no puede implementarse como un
simple enlace, sino que debe lanzar un procedimiento que solicite el credencial
a los servidores de Podemos, y cuando lo obtenga lance un navegador web.

Además dichos credenciales deben solicitarse a los servidores de Podemos (y no
por ejemplo a Agora Voting) porque es contra estos servidores que está el
usuario autenticado.

La comunicación en este paso con los servidores de Podemos debe realizarse de
"forma segura y autenticada". Aquí, cuando decimos "de forma segura" nos
referimos a que entendemos que la comunicación se hará por ejemplo a través de
un canal seguro, como puede ser una petición HTTPS. Y cuando decimos "de forma
autenticada", entendemos que dicha petición al servidor se podrá sólo hacer de
forma exitosa desde la aplicación cuando el usuario esté autenticado, y por
tanto dicha petición incluirá algún tipo de mecanismo de autenticación entre
cliente y servidor de la aplicación.

Lo explicado en el anterior párrafo es un detalle de implementación, y
simplemente lo comentamos como recomendación de seguridad sobre cómo proceder;
es responsabilidad de Podemos asegurarse de que los mecanismos implementados en
su aplicación sean seguros.

### 4. Los servidores de Podemos recibe la petición y devuelve los credenciales solicitados

En el paso anterior, el cliente pide al servidor los credenciales que
autenticarán al votante y que son pasados, como se explica en los pasos
subsiguientes, a Agora Voting mediante un enlace. El servidor debe recibir dicha
petición, procesarla, comprobar que la petición está debidamente autenticada, y
generar dichos credenciales.

Los credenciales tienen dos componentes, un mensaje y un hash, y se generan
mediante un procedimiento llamado "HMAC". El funcionamiento y propiedades de
seguridad de los [sistemas de autenticación de tipo HMAC están explicados más
detalladamente en la wikipedia](http://en.wikipedia.org/wiki/Hash-based_message_authentication_code) 
y escapan del ámbito de este documento.

Aquí nos basta con decir HMAC es un procedimiento estándar criptográfico, que
en nuestro caso lo utilizamos para transmitir de forma segura y autenticada un
mensaje que contiene cierta información que se pasa a Agora Voting, y que la
seguridad proviene en parte de una clave secreta que conocen únicamente los
servidores de Agora Voting y de Podemos. Con dicha clave y el mensaje, y
mediante el procedimiento de HMAC mediante hashes SHA-256, se genera un hash que
autentica la validez del mensaje ante Agora Voting.

#### 4.1 El mensaje

El mensaje por tanto es generado por el servidor de la aplicación y tiene
el siguiente formato: "```voter-<election-id>-<voter-id>:<timestamp>```". Por ejemplo,
un mensaje válido podría ser:

    voter-1-8dee0c135afeae29e208550e7258dab7b64fb008bc606fc326d41946ab8e773f:1411130040

Como puede verse hay tres datos dentro del mensaje:

**voter-id**
Es una cadena de texto que sirve a Agora Voting como identificador del votante.
Hay varias consideraciones importantes en el voter-id:
* El voter-id debe ser siempre el mismo para cada votante en cada votación. Es decir, que si un votante vota dos veces en una misma votación, el voter-id será el mismo. Esto es muy importante, porque el voter-id es la forma en que Agora Voting buscará si el votante votó anteriormente, y de esa manera Agora Voting decide si debe guardar el voto como un nuevo voto o sobreescribir el voto anterior del votante.
* Por seguridad, para evitar transmitir ninguna información adicional acerca del votante más allá de un identificador único, el voter id debe ser un hash de un identificador interno único del votante, conocido sólo por Podemos y que no tiene porqué transcender fuera de Podemos. Por ejemplo, puede usarse el número de afiliado o el id de usuario.
* Recomendamos especialmente que el identificador interno no sea el número de DNI, porque hay números de DNIs duplicados y por tanto no cumple con el requisito de ser único.
* Sugerimos usar SHA-256 como función de hash, y evitar SHA-1 o MD5 por motivos de seguridad.
* Además recomendamos que no se haga directamente el hash del id, sino que se haga el hash del id más un salt. El salt debe ser otra clave secreta, que sólo sepa Podemos, y así se protege ante ataques que desvelen el id utilizado.
* También es recomendable que el salt varíe para cada votación, de esa manera en cada votación el voter-id para un mismo votante será diferente, disminuyendo así al mínimo necesario la información desvelada mediante el voter-id.
* Si el voter-id se implementa como un hash con las anteriores consideraciones de seguridad, permite a Podemos tener la confianza de que Agora Voting no puede añadir votos porque Agora Voting no sabe cómo generar voter-ids válidos. Esto es por tanto una interesante medida de seguridad que aparece gracias a la separación e independencia entre la organización que gestiona el censo (Podemos) y la que registra los votos (Agora voting).

**election-id**
Es el identificador de la votación. Es necesario incluirlo para que el mensaje,
que está autenticado, asocie el voter-id a una votación específica, y así no
pueda usarse el mismo mensaje para diferentes votaciones, en el caso de que se
diera el caso de que haya dos o más procesos electorales simultáneos.

El id de la votación lo proveerá Agora Voting para cada votación, y será un
número entero.

**timestamp**
Es la fecha en la que se ha generado el mensaje, en formato de "UNIX
timestamp", esto es, un entero con el número de segundos desde el 1 de enero de
1970 ([más información](http://en.wikipedia.org/wiki/Unix_time)).

El mensaje incluye el timestamp como forma de poder calcular una fecha de
caducidad de dicho mensaje autenticado, como hemos explicado anteriormente. Por
tanto, tendremos que hacer pruebas para comprobar que los relojes de ambos
servidores (el de Agora Voting y el de Podemos) están sincronizados, con el fin
de que el cálculo de expiración de los mensajes sea posible.

#### 4.2 El hash

El hash (igual que el mensaje) se genera en el servidor mediante el
procedimiento HMAC con SHA256, definido más detalladamente en el
[U.S. Federal Information Processing Standards Publication 198](http://csrc.nist.gov/publications/fips/fips198-1/FIPS-198-1_final.pdf). 
[Aquí se encuentra un ejemplo](http://play.golang.org/p/maZxXZFON-) de cómo
generar un código HMAC en el lenguaje Go, y en otros lenguajes de programación
es posible generar códigos HMAC de forma similar.

#### 4.3 Consideraciones adicionales

El resultado más importante de este paso 4 es que el servidor devuelva los
credenciales que el cliente de la aplicación necesita para poder enviar al
usuario a la cabina de votación con el enlace correcto. Por ello, bastaría con
que el servidor devolviese el mensaje y el hash al cliente.

No obstante, recomendamos que directamente el servidor forje y devuelva el
enlace a la cabina de votación, de manera que el cliente se puede limitar a
solicitar dicho enlace. Eso tiene la ventaja de que si el enlace cambia, no hay
que modificar el cliente, y además en todo caso el cliente no debe preocuparse
sobre la complejidad asociada a la generación de dicho enlace.

Es por ello que explicamos en este paso cómo se generará dicho enlace. El enlace
será una URL que aun no funciona porque la cabina aun no está terminada ni
desplegada en los servidores definitivos, pero que ya podemos decir que
probablemente tendrá el formato siguiente:

    https://vota.podemos.info/#/election/:id/vote/:hash/:message

En dicho enlace, :id es el id de la votación, :message el mensaje de
autenticación, y :hash el código HMAC de autenticación, explicados
anteriormente.

Sin embargo, como hemos dicho, en el momento de escribir este documento aun no
está terminada la cabina de votación y no se pueden hacer pruebas en ese
enlace. Por ello, para poder trabajar en paralelo ambas partes, hemos generado
una URL donde podéis hacer pruebas y ver si estáis generando bien los enlaces.
Esta url tiene el siguiente formato (haced clic para probar):

  [http://agoravoting.org/agora-core-view/dist#/test_hmac/:key/:hash/:message](http://agoravoting.org/agora-core-view/dist#/test_hmac/:key/:hash/:message)

Donde :key es la clave secreta (la que sería compartida de forma secreta entre
Agora Voting y Podemos, que aquí es pública y parte de la URL porque es sólo
para pruebas), :hash es el código HMAC y :message el mensaje.

Lo bueno de esta página de pruebas es que no sólo verifica que se está generando
bien el hash en base a una clave y un mensaje dados, sino que además analiza el
formato del mensaje para comprobar también si su estructura es correcta. El
siguiente es un ejemplo de una url generada correctamente (haced clic para
probar):

  [https://vota.podemos.info/#/test_hmac/vor1HieM/704501b0c3ea5e2be36153a7bfa00a9eb6a51d9cef08804808abf2a57e5dc879/voter-1306-8dee0c135afeae29e208550e7258dab7b64fb008bc606fc326d41946ab8e773f:1412937266](https://vota.podemos.info/#/test_hmac/vor1HieM/704501b0c3ea5e2be36153a7bfa00a9eb6a51d9cef08804808abf2a57e5dc879/voter-1306-8dee0c135afeae29e208550e7258dab7b64fb008bc606fc326d41946ab8e773f:1412937266)

### 5. La aplicación abre en un navegador el enlace autenticado a la cabina de votación

El usuario ha pinchando en el botón de la aplicación para votar en una votación
y la aplicación ha conseguido un enlace para votar gracias a una comunicación
con el servidor.

En este último paso, la aplicación ya sólo tiene que abrir dicho enlace en un
navegador, que aparezca en primer plano, y a partir de ahí termina la labor de
integración que detalla esta lista de pasos.
