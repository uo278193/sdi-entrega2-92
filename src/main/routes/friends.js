const {ObjectId} = require("mongodb");
module.exports = function (app,usersRepository) {


    app.get('/user/friends', function (req, res) {
        let filter = {"email": req.session.user};
        let options = {};

        let page = parseInt(req.query.page); // Es String !!!
        if (typeof req.query.page === "undefined" || req.query.page === null || req.query.page === "0") {
            //Puede no venir el param
            page = 1;
        }
        usersRepository.findUser(filter, options).then(user => {

            let friends = [];
            let friendsIds = user.friends;
            friendsIds.forEach(friendId => {
                let filterFriend = {"_id": friendId};
                usersRepository.findUser(filterFriend,options).then(friend=>{
                    friends.push(friend);
                })
                }
            );
            let lastPage = friends.length() / 4;
            if (friends.length() % 4 > 0) { // Sobran decimales
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
    app.get('/user/friendRequests', function (req, res) {

        let filter = {"email": req.session.user};
        let options = {};

        let page = parseInt(req.query.page); // Es String !!!
        if (typeof req.query.page === "undefined" || req.query.page === null || req.query.page === "0") {
            //Puede no venir el param
            page = 1;
        }
        usersRepository.findUser(filter, options).then(user => {

            let friendRequests = [];
            let friendsRequestsIds = user.friendRequests;
            friendRequestsIds.forEach(friendRequestsId => {
                    let filterFriend = {"_id": friendRequestsId};
                    usersRepository.findUser(filterFriend,options).then(friendRequestUser=>{
                        friendRequests.push(friendRequestUser);
                    })
                }
            );
            let lastPage = friendRequests.length() / 4;
            if (friendRequests.length() % 4 > 0) { // Sobran decimales
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
            res.render("friends/friendRequestsList.twig", response);
        }).catch(error => {
            res.send("Se ha producido un error al listar los usuarios " + error)
        });

    });

    app.post('/user/acceptFriendRequest/:id', function (req, res) {
        let filter = {_id: ObjectId(req.params.id)}
        let options = {};
        //TODO
        //pillar la friend request de la id
        friendRequestRepository.findFriendRequest(filter,options).then(friendRequest => {

            //borras la friend request de emisor
            filter={idEmisor:ObjectId(friendRequest.idEmisor), idReceptor:ObjectId(friendRequest.idReceptor)}
            friendsRepository.deleteFriendRequest(filter).catch(error => {
                    res.send("Se ha producido un error al aceptar la petición de amistad " + error)
                })

            //borras friend request de receptor
            filter={idReceptor:ObjectId(friendRequest.idEmisor),idEmisor:ObjectId(friendRequest.idReceptor)}
            friendsRepository.deleteFriendRequest(filter).catch(error => {
                    res.send("Se ha producido un error al aceptar la petición de amistad " + error)
                });

            //añades friend1 a friend2 como amigo
            let friendship = {
                idAmigo1: friendRequest.idEmisor,
                idAmigo2: friendRequest.idReceptor
            }

            friendsRepository.addFriend(friendship).catch(error => {
                    res.send("Se ha producido un error al aceptar la petición de amistad " + error)
                });

            //añades friend2 a friend1 como amigo
            friendship = {
                idAmigo1: friendRequest.idReceptor,
                idAmigo2: friendRequest.idEmisor
            }
            friendsRepository.addFriend(friendship).catch(error => {
                    res.send("Se ha producido un error al aceptar la petición de amistad " + error)
                });

            res.redirect("/user/friends");
        }).catch(error => {
            res.redirect("/users/signup" +
                "?message=Se ha producido un error al registrar el usuario"+
                "&messageType=alert-danger");
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
            usersRepository.findUser(filter2,options).then(userInSession=>{
                console.log(userInSession);
                if(Array.from(user.friendRequests).includes(userInSession._id)){
                    res.redirect("/users/list" +
                        "?message=Una petición de amistad ya había sido enviada"+
                        "&messageType=alert-danger");
                }
                user.friendRequests.push(userInSession._id);
                usersRepository.updateUser(user,filter,options)
                    .catch("Se ha producido un error al enviar la petición de amistad " + error);
                res.redirect("/user/list");
            })
        }).catch(error => {
            res.send("Se ha producido un error al enviar la petición de amistad " + error)
        });
    });

}
