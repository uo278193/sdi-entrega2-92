module.exports = function (app, usersRepository) {

    app.get('/admin/users', function (req, res) {
        let filter = {email : req.session.user};
        usersRepository.findUser(filter, {}).then(activeUser => {
            if(activeUser == null){
                res.redirect("/users/login" +
                    "?message=no se ha iniciado sesión"  +
                    "&messageType=alert-danger ");
            } else if(!activeUser.admin){
                res.redirect("/users/login" +
                    "?message=El usuario no tiene permisos de administrador" +
                    "&messageType=alert-danger ");
            } else {
                usersRepository.findUsers({}, {}).then(users => {
                    let usersList = [];
                    for (let i = 0; i < users.length; i++) {
                        if (users[i].email != activeUser.email)
                            usersList.push(users[i])
                    }
                    res.render("admin/list.twig", {activeUser: activeUser, usersList: usersList});
                }).catch(error => {
                    res.send(error)
                });
            }
        }).catch(error => {
            res.send("Se ha producido un error al listar los usuarios. " + error)
        });

    });

    app.get('/admin/users/delete', function (req, res) {
        let filter = {email : req.session.user};
        usersRepository.findUser(filter, {}).then(activeUser => {
            if(activeUser == null){
                res.redirect("/users/login" +
                    "?message=no se ha iniciado sesión"  +
                    "&messageType=alert-danger ");
            } else if(!activeUser.admin){
                res.redirect("/users/login" +
                    "?message=El usuario no tiene permisos de administrador" +
                    "&messageType=alert-danger ");
            } else {
                usersRepository.findUsers({}, {}).then(users => {
                    let usersToDelete = req.query.user;
                    if(typeof(usersToDelete) != "undefined"){
                        if (typeof(usersToDelete) === "string"){
                            // Solo se ha seleccionado un usuario para el borrado
                            let filter = {email: usersToDelete};
                            usersRepository.deleteUser(filter, {}).then(result => {
                                if (result == null || result.deletedCount == 0) {
                                    res.send("No se ha podido eliminar el usuario");
                                }
                            }).catch(error => {
                                res.send("Se ha producido un error al intentar eliminar los usuarios " + error)
                            });
                        }
                        else {
                            for (let i = 0; i < users.length; i++) {
                                for (let j = 0; j < usersToDelete.length; j++) {
                                    if (usersToDelete[j] === users[i].email) {
                                        let filter = {email: usersToDelete[j]};
                                        usersRepository.deleteUser(filter, {}).then(result => {
                                            if (result == null || result.deletedCount == 0) {
                                                res.send("No se ha podido eliminar el usuario");
                                            }
                                        }).catch(error => {
                                            res.send("Se ha producido un error al intentar eliminar los usuarios " + error)
                                        });
                                    }
                                }
                            }
                        }
                    }
                    /**
                    else{
                        res.redirect("/admin/users"+
                            "?message=No se han seleccionado usuarios para el borrado" +
                            "&messageType=alert-info ");
                    }
                     **/
                    res.redirect("/admin/users"+
                        "?message=Usuarios borrados correctamente" +
                        "&messageType=alert-info ");
                });
            }
        });
        });

    }