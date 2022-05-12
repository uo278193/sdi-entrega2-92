const {ObjectId} = require("mongodb");
module.exports = function (app, usersRepository) {

    app.get('/user/friends', async function (req, res) {
        let filter1 = {email : req.session.user};
        usersRepository.findUser(filter1, {}).then(activeUser => {
            if (activeUser == null) {
                res.redirect("/users/login" +
                    "?message=no se ha iniciado sesión" +
                    "&messageType=alert-danger ");
            } else {
                let filter = {"email": req.session.user};
                let options = {};

                let page = parseInt(req.query.page); // Es String !!!
                if (typeof req.query.page === "undefined" || req.query.page === null || req.query.page === "0") {
                    //Puede no venir el param
                    page = 1;
                }
                let friends = [];
                usersRepository.findUser(filter, options).then(async user => {
                    let friendsIds = user.friends;
                    for (const friendId of friendsIds) {
                        let filterFriend = {"_id": friendId};
                        await usersRepository.findUser(filterFriend, options).then(friendUser => {
                            friends.push(friendUser);

                        })
                    }
                    let lastPage = friends.length / 5;
                    if (friends.length % 5 > 0) { // Sobran decimales
                        lastPage = lastPage + 1;
                    }
                    let pages = []; // paginas mostrar
                    for (let i = page - 2; i <= page + 2; i++) {
                        if (i > 0 && i <= lastPage) {
                            pages.push(i);
                        }
                    }
                    let response = {
                        friends: friends,
                        pages: pages,
                        currentPage: page
                    }
                    res.render("friends/list.twig", response);
                }).catch(error => {
                    res.send("Se ha producido un error al listar los usuarios " + error)
                });
            }
        });
    });
    app.get('/user/friendRequests', async function (req, res) {
        let filter1 = {email : req.session.user};
        usersRepository.findUser(filter1, {}).then(activeUser => {
            if (activeUser == null) {
                res.redirect("/users/login" +
                    "?message=no se ha iniciado sesión" +
                    "&messageType=alert-danger ");
            } else {
                let filter = {"email": req.session.user};
                let options = {};

                let page = parseInt(req.query.page); // Es String !!!
                if (typeof req.query.page === "undefined" || req.query.page === null || req.query.page === "0") {
                    //Puede no venir el param
                    page = 1;
                }
                let friendRequests = [];
                usersRepository.findUser(filter, options).then(async user => {
                    let friendsRequestsIds = user.friendRequests;
                    for (const friendRequestId of friendsRequestsIds) {
                        let filterFriend = {"_id": friendRequestId};
                        await usersRepository.findUser(filterFriend, options).then(friendRequestUser => {
                            friendRequests.push(friendRequestUser);

                        })
                    }
                    let lastPage = friendRequests.length / 5;
                    if (friendRequests.length % 5 > 0) { // Sobran decimales
                        lastPage = lastPage + 1;
                    }
                    let pages = []; // paginas mostrar
                    for (let i = page - 2; i <= page + 2; i++) {
                        if (i > 0 && i <= lastPage) {
                            pages.push(i);
                        }
                    }
                    let response = {
                        friendRequests: friendRequests,
                        pages: pages,
                        currentPage: page
                    }
                    res.render("friends/friendRequestList.twig", response);
                }).catch(error => {
                    res.send("Se ha producido un error al listar los usuarios " + error)
                });
            }
        });
    });

    app.post('/user/acceptFriendRequest/:id', function (req, res) {
        //TODO
        //Comprobar que la id no sea la del user
        //Comprobar que exista la friendRequest
        //comprobar que no sea amigo
        let filter1 = {email : req.session.user};
        usersRepository.findUser(filter1, {}).then(activeUser => {
            if (activeUser == null) {
                res.redirect("/users/login" +
                    "?message=no se ha iniciado sesión" +
                    "&messageType=alert-danger ");
            } else {
                let filter = {"email": req.session.user}
                let options = {};
                usersRepository.findUser(filter, options).then(userInSession => {
                    //Comprobar que la id no sea la del user
                    if (req.params.id == userInSession._id.toString()) {
                        res.redirect("/users/list" +
                            "?message=No puedes aceptar una petición de amistad a ti mismo" +
                            "&messageType=alert-danger");
                    } else {
                        let filter2 = {_id: ObjectId(req.params.id)}
                        usersRepository.findUser(filter2, options).then(user2 => {
                                //Comprobar que exista la friendRequest
                                let existeFriendRequest = false
                                for (var i = 0; i < userInSession.friendRequests.length; i++) {
                                    if (userInSession.friendRequests[i].toString() == user2._id.toString()) {
                                        existeFriendRequest = true;
                                    }
                                }
                                let existeAmistad = false
                                for (var i = 0; i < userInSession.friends.length; i++) {
                                    if (userInSession.friends[i].toString() == user2._id.toString()) {
                                        existeAmistad = true;
                                    }
                                }
                                for (var i = 0; i < user2.friends.length; i++) {
                                    if (user2.friends[i].toString() == userInSession._id.toString()) {
                                        existeAmistad = true;
                                    }
                                }
                                if (existeFriendRequest == false) {
                                    res.redirect("/users/list" +
                                        "?message=No puedes aceptar una petición de amistad que no existe" +
                                        "&messageType=alert-danger");
                                } else if (existeAmistad == true) {
                                    res.redirect("/users/list" +
                                        "?message=No puedes aceptar una petición de amistad cuando ya eres amigo de esa persona" +
                                        "&messageType=alert-danger");
                                } else {
                                    //tratar userInSession
                                    userInSession.friends.push(user2._id);
                                    for (var i = 0; i < userInSession.friendRequests.length; i++) {
                                        if (userInSession.friendRequests[i].toString() == user2._id.toString()) {
                                            userInSession.friendRequests.splice(i, 1);
                                            break;
                                        }
                                    }
                                    usersRepository.updateUser(userInSession, filter, options)
                                    //tratar user2
                                    user2.friends.push(userInSession._id);
                                    for (var i = 0; i < user2.friendRequests.length; i++) {
                                        if (user2.friendRequests[i].toString() == userInSession._id.toString()) {
                                            user2.friendRequests.splice(i, 1);
                                            break;
                                        }
                                    }
                                    usersRepository.updateUser(user2, filter2, options)
                                }
                            }
                        )
                    }
                }).catch(error => {
                    res.send("Se ha producido un error al aceptar la petición de amistad " + error)
                });
            }

        let filter = {"email": req.session.user}
        let options = {};
        usersRepository.findUser(filter, options).then(userInSession => {
            //Comprobar que la id no sea la del user
            if (req.params.id == userInSession._id.toString()) {
                res.redirect("/users/list" +
                    "?message=No puedes aceptar una petición de amistad a ti mismo" +
                    "&messageType=alert-danger");
            } else {
                let filter2 = {_id: ObjectId(req.params.id)}
                usersRepository.findUser(filter2, options).then(user2 => {
                        //Comprobar que exista la friendRequest
                        let existeFriendRequest = false
                        for (var i = 0; i < userInSession.friendRequests.length; i++) {
                            if (userInSession.friendRequests[i].toString() == user2._id.toString()) {
                                existeFriendRequest = true;
                            }
                        }
                        let existeAmistad = false
                        for (var i = 0; i < userInSession.friends.length; i++) {
                            if (userInSession.friends[i].toString() == user2._id.toString()) {
                                existeAmistad = true;
                            }
                        }
                        for (var i = 0; i < user2.friends.length; i++) {
                            if (user2.friends[i].toString() == userInSession._id.toString()) {
                                existeAmistad = true;
                            }
                        }
                        if (existeFriendRequest == false) {
                            res.redirect("/users/list" +
                                "?message=No puedes aceptar una petición de amistad que no existe" +
                                "&messageType=alert-danger");
                        } else if (existeAmistad == true) {
                            res.redirect("/users/list" +
                                "?message=No puedes aceptar una petición de amistad cuando ya eres amigo de esa persona" +
                                "&messageType=alert-danger");
                        } else {
                            //tratar userInSession
                            userInSession.friends.push(user2._id);
                            for (var i = 0; i < userInSession.friendRequests.length; i++) {
                                if (userInSession.friendRequests[i].toString() == user2._id.toString()) {
                                    userInSession.friendRequests.splice(i, 1);
                                    break;
                                }
                            }
                            usersRepository.updateUser(userInSession, filter, options)
                            //tratar user2
                            user2.friends.push(userInSession._id);
                            for (var i = 0; i < user2.friendRequests.length; i++) {
                                if (user2.friendRequests[i].toString() == userInSession._id.toString()) {
                                    user2.friendRequests.splice(i, 1);
                                    break;
                                }
                            }
                            usersRepository.updateUser(user2, filter2, options)
                            res.redirect('/user/friendRequests')
                        }
                    }
                )
            }
        }).catch(error => {
            res.send("Se ha producido un error al aceptar la petición de amistad " + error)
        });
    });

    });
    app.post('/user/sendFriendRequest/:id', function (req, res) {
            let filter1 = {email: req.session.user};
            usersRepository.findUser(filter1, {}).then(activeUser => {
                if (activeUser == null) {
                    res.redirect("/users/login" +
                        "?message=no se ha iniciado sesión" +
                        "&messageType=alert-danger ");
                } else {
                    let filter = {
                        "_id": ObjectId(req.params.id)
                    };
                    let options = {}
                    usersRepository.findUser(filter, options).then(user => {
                        let filter2 = {
                            "email": req.session.user
                        }
                        let duplicado = false;
                        let esUsuario = false;
                        usersRepository.findUser(filter2, options).then(userInSession => {
                                user.friendRequests.push(userInSession._id);
                                usersRepository.updateUser(user, filter, options);
                        })
                    }).catch(error => {
                        res.send("Se ha producido un error al enviar la petición de amistad " + error)
                    });
                }

            let filter = {
                "_id": ObjectId(req.params.id)
            };
            let options = {}
            usersRepository.findUser(filter, options).then(user => {
                let filter2 = {
                    "email": req.session.user
                }
                let duplicado = false;
                let esUsuario = false;
                usersRepository.findUser(filter2, options).then(userInSession => {
                        user.friendRequests.push(userInSession._id);
                        usersRepository.updateUser(user, filter, options);
                        res.redirect("/users/list");
                })
            }).catch(error => {
                res.send("Se ha producido un error al enviar la petición de amistad " + error)
            });
        });
    });
}