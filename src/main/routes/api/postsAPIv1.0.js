const {ObjectId} = require("mongodb");
module.exports = function (app, postsRepository, usersRepository) {

    app.get("/api/v1.0/posts", function (req, res) {
        try {
            let email = res.user.email;
            let filter = {author: email};
            let options = {};
            postsRepository.getPosts(filter, options).then(posts => {
                if (posts === null) {
                    res.status(404);
                    res.json({error: "Email inválido o no existe"})
                } else {
                    res.status(200);
                    res.json({posts: posts})
                }
            }).catch(error => {
                res.status(500);
                res.json({error: "Se ha producido un error al recuperar el post."})
            });
        } catch (e) {
            res.status(500);
            res.json({error: "Se ha producido un error :" + e})
        }
    });

    app.get("/api/v1.0/posts/:id", function (req, res) {
        try {
            let postId = ObjectId(req.params.id)
            let filter = {_id: postId};
            let options = {};
            postsRepository.findPost(filter, options).then(post => {
                if (post === null) {
                    res.status(404);
                    res.json({error: "ID inválido o no existe"})
                } else {
                    res.status(200);
                    res.json({post: post})
                }
            }).catch(error => {
                res.status(500);
                res.json({error: "Se ha producido un error a recuperar el post."})
            });
        } catch (e) {
            res.status(500);
            res.json({error: "Se ha producido un error :" + e})
        }
    });

    app.delete('/api/v1.0/posts/:id', function (req, res) {
        try {
            let postId = ObjectId(req.params.id)
            let filter = {_id: postId}
            postsRepository.deletePost(filter, {}).then(result => {
                if (result === null || result.deletedCount === 0) {
                    res.status(404);
                    res.json({error: "ID inválido o no existe, no se ha borrado el registro."});
                } else {
                    res.status(200);
                    res.send(JSON.stringify(result));
                }
            }).catch(error => {
                res.status(500);
                res.json({error: "Se ha producido un error al eliminar el post."})
            });
        } catch (e) {
            res.status(500);
            res.json({error: "Se ha producido un error, revise que el ID sea válido."})
        }
    });

    app.post('/api/v1.0/posts', function (req, res) {
        try {
            let post = {
                title: req.body.title,
                kind: req.body.kind,
                price: req.body.price,
                author: res.user.email
            }
            // Validar aquí: título, género, precio y autor.
            postsRepository.insertPost(post, function (postId) {
                if (postId === null) {
                    res.status(409);
                    res.json({error: "No se ha podido crear la canción. El recurso ya existe."});
                } else {
                    res.status(201);
                    res.json({
                        message: "Canción añadida correctamente.",
                        _id: postId
                    })
                }
            });
        } catch (e) {
            res.status(500);
            res.json({error: "Se ha producido un error al intentar crear la canción: " + e})
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

    app.put('/api/v1.0/posts/:id', function (req, res) {
        try {
            let postId = ObjectId(req.params.id);
            let filter = {_id: postId, author: res.user.email};
            //Si la _id NO no existe, no crea un nuevo documento.
            const options = {upsert: false};
            if (typeof req.body.title != "undefined" && req.body.title != null)
                post.title = req.body.title;
            if (typeof req.body.kind != "undefined" && req.body.kind != null)
                post.kind = req.body.kind;
            if (typeof req.body.price != "undefined" && req.body.price != null)
                post.price = req.body.price;
            postsRepository.updatePost(post, filter, options).then(result => {
                if (result === null) {
                    res.status(404);
                    res.json({error: "ID inválido o no existe, no se ha actualizado el post."});
                }
                //La _id No existe o los datos enviados no difieren de los ya almacenados.
                else if (result.modifiedCount == 0) {
                    res.status(409);
                    res.json({error: "No se ha modificado ningún post."});
                } else {
                    res.status(200);
                    res.json({
                        message: "Post modificado correctamente.",
                        result: result
                    })
                }
            }).catch(error => {
                res.status(500);
                res.json({error: "Se ha producido un error al modificar el post."})
            });
        } catch (e) {
            res.status(500);
            res.json({error: "Se ha producido un error al intentar modificar el post: " + e})
        }
    });

}
