module.exports = function (app, usersRepository) {

    app.get('/admin/users', function (req, res) {
        let filter = {email : req.session.user};
        usersRepository.findUser(filter, {}).then(activeUser => {
            usersRepository.findUsers({}, {}).then(users => {
                let usersList = [];
                for (let i = 0; i < users.length; i++){
                    if(users[i].email != activeUser.email)
                        usersList.push(users[i])
                }
                res.render("admin/list.twig", {activeUser : activeUser, usersList : usersList});
            }).catch(error => {
                res.send(error)
            });
        }).catch(error => {
            res.send("Se ha producido un error al listar los usuarios. " + error)
        });
    });

    app.get('/admin/users/delete', function (req, res) {
        let users = req.body.chkUser;
        users.forEach(user => usersRepository.deleteUser(user));
        let activeUser = req.session.user;
        let usersList = usersRepository.findNoActiveUsers(activeUser);
        res.render("admin/list.twig", {activeUser : activeUser, usersList : usersList});
    });

}