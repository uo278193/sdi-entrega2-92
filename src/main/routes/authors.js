module.exports = function (app) {
    app.get("/authors", function (req, res) {
        let authors = [{
            "name": "John Lenon",
            "group": "The Beatles",
            "rol": "cantante"
        }, {
            "name": "George Harrison",
            "group": "The Beatles",
            "rol": "guitarrista"
        }, {
            "name": "Pete Best",
            "group": "The Beatles",
            "rol": "batería"
        }];
        let response = {
            seller: 'Tienda de canciones',
            authors: authors
        };
        res.render("authors/authors.twig", response);
    });

    app.get('/authors/add', function (req, res) {
        let roles = [{
            "name": "Cantante"
        }, {
            "name": "Batería",
        }, {
            "name": "Guitarrista",
        }, {
            "name": "Bajista",
        }, {
            "name": "Teclista"
        }];

        let response = {
            roles: roles
        };

        res.render("authors/add.twig", response);
    });

    app.post('/authors/add', function (req, res) {
        let response = "Autor agregado: " + req.body.name + "<br>"
            + "grupo: " + req.body.group + "<br>"
            + "rol: " + req.body.rol;

        if(req.body.name === "undefined")
            response += "Nombre no enviado en la petición.";
        if(req.body.group === "undefined")
            response += "Grupo no enviado en la petición.";
        if(req.body.rol === "undefined")
            response += "Rol no enviado en la petición.";

        res.send(response);
    });

    // controlar, mediante comodines, las rutas que
    // incluyan parámetros a authors
    app.get('/authors/*', function (req, res) {
        res.redirect("/authors");
    });
};