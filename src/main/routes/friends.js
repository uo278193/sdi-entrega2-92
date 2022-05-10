const {ObjectId} = require("mongodb");
module.exports = function (app,usersRepository) {

    app.get('/user/friends', async function (req, res) {

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
            let lastPage = friends.length / 4;
            if (friends.length % 4 > 0) { // Sobran decimales
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

    });
    app.get('/user/friendRequests', async function (req, res) {

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
            let lastPage = friendRequests.length / 4;
            if (friendRequests.length % 4 > 0) { // Sobran decimales
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

    });

    app.post('/user/acceptFriendRequest/:id', function (req, res) {
        let filter = {"email":req.session.user}
        let options = {};
        usersRepository.findUser(filter,options).then(userInSession=>{
            let filter2 = {_id: ObjectId(req.params.id)}
            usersRepository.findUser(filter2,options).then(user2 =>{
                    //tratar userInSession
                    userInSession.friends.push(user2._id);
                    for(var i=0; i<userInSession.friendRequests.length; i++) {
                        if (userInSession.friendRequests[i].toString() == user2._id.toString()) {
                            userInSession.friendRequests.splice(i, 1);
                            break;
                        }
                    }
                    usersRepository.updateUser(userInSession,filter,options)
                    //tratar user2
                    user2.friends.push(userInSession._id);
                    for(var i=0; i<user2.friendRequests.length; i++) {
                        if (user2.friendRequests[i].toString() == userInSession._id.toString()) {
                            user2.friendRequests.splice(i, 1);
                            break;
                        }
                    }
                    usersRepository.updateUser(user2,filter2,options)
                    res.redirect('/users/list')
                }
            )
        }).catch(error => {
            res.send("Se ha producido un error al aceptar la petición de amistad " + error)
        });
    });
    app.post('/user/sendFriendRequest/:id', function (req, res) {
        let filter={
            "_id":ObjectId(req.params.id)
        };
        let options={}
        usersRepository.findUser(filter,options).then(user => {
            let filter2={
                "email":req.session.user
            }
            let duplicado = false;
            let esUsuario= false;
            usersRepository.findUser(filter2,options).then(userInSession=>{
                user.friendRequests.forEach(friendRequest=>{
                    if(friendRequest.toString() === userInSession._id.toString()){
                        duplicado = true;
                    }
                    if(friendRequest.toString()===req.params.id){
                        esUsuario = true;
                    }
                })
                if(duplicado){
                    res.redirect("/users/list" +
                        "?message=Una petición de amistad ya había sido enviada"+
                        "&messageType=alert-danger");
                } else {
                    if (esUsuario){
                        res.redirect("/users/list" +
                            "?message=No puedes enviarte una petición de amistad a ti mismo"+
                            "&messageType=alert-danger");
                    }else{
                        user.friendRequests.push(userInSession._id);
                        console.log(user);
                        usersRepository.updateUser(user,filter,options);
                        res.redirect("/users/list");
                    }
                }
            })
        }).catch(error => {
            res.send("Se ha producido un error al enviar la petición de amistad " + error)
        });
    });
}