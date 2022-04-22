var http = require('http');

http.createServer(
    function onRequest(request, response){
        console.log('Requested!');
        response.writeHead(200, {'Content-Type': 'text/json'});

        var exampleArray = ["item", "item2"];
        var exampleObject = {
            item: "Bread",
            item2: "Butter"
        }
        var json = JSON.stringify({
            object: exampleObject,
            array: exampleArray,
            tekst: "JSON!! JSON!!"
        });
        response.end(json);
    }
).listen(3000);

console.log('De server luistert op port 3000');

// base file