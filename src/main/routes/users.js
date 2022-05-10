module.exports = function (app, usersRepository) {
    app.get('/users/home', function (req, res) {
        let response = {
            user: req.session.user
        }
        res.render('users/home.twig', response);
    });
    app.get('/users/list', function (req, res) {
        let filter = {"email": req.session.user};
        let options = {};
        usersRepository.findUser(filter, options).then(userInSession => {
            filter = {"admin": false, "email": {$ne: req.session.user}};
            if (req.query.search != null && (req.query.search) !== "undefined" && req.query.search !== "") {
                filter = {
                    "admin": false,
                    "email": {$ne: req.session.user},
                    $or: [
                        {"email": {$regex: ".*" + req.query.search + ".*"}},
                        {"nombre": {$regex: ".*" + req.query.search + ".*"}},
                        {"apellidos": {$regex: ".*" + req.query.search + ".*"}}
                    ]
                };
            }
            let page = parseInt(req.query.page); // Es String !!!
            if (typeof req.query.page === "undefined" || req.query.page === null || req.query.page === "0") {

                page = 1;
            }
            usersRepository.getUsers(filter, options, page).then(result => {
                let lastPage = result.total / 4;
                if (result.total % 4 > 0) { // Sobran decimales
                    lastPage = lastPage + 1;
                }
                let pages = []; // paginas mostrar
                for (let i = page - 2; i <= page + 2; i++) {
                    if (i > 0 && i <= lastPage) {
                        pages.push(i);
                    }
                }
                let response = {
                    users: result.users,
                    pages: pages,
                    currentPage: page,
                    userInSessionId:userInSession._id.toString()
                }
                res.render("users/list.twig", response);
            })
        }).catch(error => {
            res.send("Se ha producido un error al listar los usuarios " + error)
        });
    });

    app.get('/users/signup', function (req, res) {
        res.render("signup.twig");
    });

    app.post('/users/signup', function (req, res) {
        let passwd = req.body.password;
        let passwd2 = req.body.password2;
        if (passwd !== passwd2) {
            res.redirect("/users/signup" +
                "?message=Las constraseñas no coinciden" +
                "&messageType=alert-danger");
        }
        let securePassword = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        let user = {
            email: req.body.email,
            nombre: req.body.nombre,
            apellidos: req.body.apellidos,
            admin: false,
            password: securePassword,
            friends: [],
            friendRequests: []
        }
        usersRepository.insertUser(user).then(userId => {
            res.redirect("/users/login" +
                "?message=Nuevo usuario registrado." +
                "&messageType=alert-info");
        }).catch(error => {
            res.redirect("/users/signup" +
                "?message=Se ha producido un error al registrar el usuario" +
                "&messageType=alert-danger");
        });
    });

    app.get('/users/login', function (req, res) {
        res.render("login.twig");
    });

    app.post('/users/login', function (req, res) {
        let securePassword = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        let filter = {
            email: req.body.email,
            password: securePassword
        }
        let options = {};
        usersRepository.findUser(filter, options).then(user => {
            if (user == null) {
                req.session.user = null;
                //res.send("Usuario no identificado");
                res.redirect("/users/login" +
                    "?message=Email o password incorrecto" +
                    "&messageType=alert-danger ");
            } else {
                req.session.user = user.email;
                if (user.admin) {
                    res.redirect("/users/all");
                } else {
                    res.redirect("/users/home");
                }
            }
        }).catch(error => {
            req.session.user = null;
            res.redirect("/users/login" +
                "?message=Se ha producido un error al encontrar el usuario" +
                "&messageType=alert-danger ");
        });
    });

    app.get('/users/logout', function (req, res) {
        req.session.user = null;
        res.send("El usuario se ha desconectado correctamente");
    });
}