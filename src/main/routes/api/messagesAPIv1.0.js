const {ObjectId} = require("mongodb");
module.exports = function (app, usersRepository, messagesRepository) {

    app.get("/api/v1.0/sdigram", function (req, res) {
        try {
            let email = res.user.email;
            let filter = {email: email};
            let options = {};
            usersRepository.getUsers(filter, options).then(sdigram => {
                if (sdigram == null) {
                    res.status(404);
                    res.json({error: "Email inválido o no existe"})
                } else {
                    res.status(200);
                    res.json({sdigram: sdigram})
                }
            }).catch(error => {
                res.status(500);
                res.json({error: "Se ha producido un error al listar los usuarios"})
            });
        } catch (e) {
            res.status(500);
            res.json({error: "Se ha producido un error :" + e})
        }
    });

    app.get("/api/v1.0/user/friends",async function (req, res) {

        let filter = {email: req.session.user};
        let options = {};
        usersRepository.findUser(filter, options).then(user => {

            if (user == null) {
                res.status(404);
                res.json({error: "ID inválido o no existe"})
            } else {
                let friends = [];
                usersRepository.findUser(filter, options).then(async user => {
                    let friendsIds = user.friends;
                    for (var i = 0; i < friendsIds.length; i++) {
                        let filterFriend = {"_id": friendsIds[i]};
                        await usersRepository.findUser(filterFriend, options).then(friendUser => {
                            friends.push(friendUser);
                        })
                    }
                    res.status(200);
                    res.json({friends: friends});
                });
            }
        }).catch(error => {
            res.status(500);
            res.json({error: "Se ha producido un error al listar los amigos"})
        });
    });

    app.get("/api/v1.0/messages", function (req, res) {
        try {
            let email = res.user.email;
            let filter = {email: email};
            let options = {};
            usersRepository.getMessages(filter, options).then(friend => {
                if (friend === null) {
                    res.status(404);
                    res.json({error: "ID inválido o no existe"})
                } else {
                    res.status(200);
                    res.json({friend: friend})
                }
            }).catch(error => {
                res.status(500);
                res.json({error: "Se ha producido un error al listar los amigos"})
            });
        } catch (e) {
            res.status(500);
            res.json({error: "Se ha producido un error :" + e})
        }
    });

    app.post('/api/v1.0/messages/add/:id', function (req, res) {
        try {
            let emisor = res.user.email;
            let recEmail = (usersRepository.findUser(filter={_id: ObjectId(req.params.id)}, options = {})).email;
            let message = {
                emisor: emisor,
                receptor: recEmail,
                texto: req.body.texto,
                leido: false,
                fecha: Date.now() / 1000 // se manda en segundos
            }
            // Validar aquí: título, género, precio y autor.
            messagesRepository.insertMessage(message, function (messageId) {
                if (messageId === null) {
                    res.status(409);
                    res.json({error: "No se ha podido crear el mensaje. El recurso ya existe."});
                } else {
                    res.status(201);
                    res.json({
                        message: "Mensaje añadida correctamente.",
                        _id: messageId
                    })
                }
            });
        } catch (e) {
            res.status(500);
            res.json({error: "Se ha producido un error al intentar crear el mensaje: " + e})
        }
    });

    app.get("/api/v1.0/user/messages/:id", function (req, res) {
        try {
            let userEmail = req.session.user;
            let options = {};
            usersRepository.findUser({_id: ObjectId(req.params.id)}, options).then(user2=>{
                friendEmail=user2.email
                usersRepository.findUser({"email": userEmail}, options).then(user1=> {
                    let filter = {receptor: userEmail, emisor: friendEmail};
                    messagesRepository.getMessages(filter, options).then(messages => {
                        if (messages == null) {
                            res.status(404);
                            res.json({error: "ID inválido o no existe"})
                        } else {
                            res.status(200);
                            let filter = {emisor: userEmail, receptor: friendEmail};
                            messagesRepository.getMessages(filter, options).then(messages2 => {
                                if (messages2 == null) {
                                    res.status(404);
                                    res.json({error: "ID inválido o no existe"})
                                } else {

                                    res.status(200);
                                    mensajesTotal=[]
                                    messages.forEach(mensajes1=>{
                                        mensajesTotal.push(mensajes1)
                                    })
                                    messages2.forEach(mensajes2=>{
                                        mensajesTotal.push(mensajes2)
                                    })
                                    console.log(mensajesTotal)
                                    res.json({messages: mensajesTotal})
                                }
                            })
                        }
                    }).catch(error => {
                        console.log("llega2")
                        res.status(500);
                        res.json({error: "Se ha producido un error al recuperar el mensaje."})
                    });
                }).catch (error => {
                    console.log("llega1")
                    res.status(500);
                    res.json({error: "Se ha producido un error buscando al usuario :" + e})
                })
            }).catch (error => {
                console.log("llega3")
                res.status(500);
                res.json({error: "Se ha producido un error buscando al amigo :" + e})
            })
        }catch(e) {
            console.log("llega4")
            res.status(500);
            res.json({error: "Se ha producido un error recuperando los mensajes" + e})
        };
    });

    app.put('/api/v1.0/messages/:id', function (req, res) {
        try {
            let messageId = ObjectId(req.params.id);
            let filter = {_id: messageId, receptor: res.user.email};
            //Si la _id NO no existe, no crea un nuevo documento.
            const options = {upsert: false};
            message.leído = true;
            messagesRepository.updateMessage(message, filter, options).then(result => {
                if (result === null) {
                    res.status(404);
                    res.json({error: "ID inválido o no existe, no se ha actualizado el mensaje."});
                } else {
                    res.status(200);
                    res.json({
                        message: "Mensaje modificada correctamente.",
                        result: result
                    })
                }
            }).catch(error => {
                res.status(500);
                res.json({error: "Se ha producido un error al modificar el mensaje."})
            });
        } catch (e) {
            res.status(500);
            res.json({error: "Se ha producido un error al intentar modificar el mensaje: " + e})
        }
    });

    app.post('/api/v1.0/users/login', function (req, res) {
        try {
            let securePassword = app.get("crypto").createHmac('sha256', app.get('clave'))
                .update(req.body.password).digest("hex");
            let filter = {
                email: req.body.email,
                password: securePassword
            }
            let options = {};
            usersRepository.findUser(filter, options).then(user => {
                if (user === null) {
                    res.status(401); //Unauthorized
                    res.json({
                        message: "Usuario no autorizado",
                        authenticated: false
                    })
                } else {
                    req.session.user = user.email;
                    let token = app.get("jwt").sign(
                        {user: user.email, time: Date.now() / 1000}, "secreto"
                    );
                    res.status(200);
                    res.json({
                        message: "Usuario autorizado",
                        authenticated: true,
                        token: token
                    })
                }
            }).catch(error => {
                res.status(401);
                res.json({
                    error: "Se ha producido un error al verificar credenciales",
                    authenticated: false
                })
            })
        } catch (e) {
            res.status(500);
            res.json({
                error: "Se ha producido un error al verificar credenciales",
                authenticated: false
            })
        }
    });

}
