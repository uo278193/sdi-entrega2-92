const {ObjectId} = require("mongodb");

module.exports = function (app, postsRepository) {

    app.get('/posts/add', function (req, res) {
        res.render("posts/add.twig");
    });

    app.get('/posts/myPosts', function (req, res) {
        let filter = {user: req.session.user};
        let  options =  {};
        if (req.query.search != null && typeof (req.query.search) != "undefined" && req.query.search != "") {
            filter = {"title": {$regex: ".*" + req.query.search + ".*"}};
        }

        let page = parseInt(req.query.page); // Es String !!!
        if (typeof req.query.page === "undefined" || req.query.page === null || req.query.page === "0") {
            page = 1;
        }
        postsRepository.getPostsPg(filter,options,page).then( result => {
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
                posts: result.posts,
                pages: pages,
                currentPage: page
            }
            res.render("posts/list.twig", response);
        }).catch(error => {
            res.send("Se ha producido un error al listar los post de la aplicacion." + error);
        })
    });


    app.post('/posts/add', function (req,res){

        let post = {
            title: req.body.title,
            texto: req.body.texto,
            date: new Date().toDateString(),
            user: req.session.user
        }

        postsRepository.insertPost(post,function (postId){
           if(postId == null){
               res.send("Error en la creación del post");
           } else{
               res.send("Agregado el post ID: " + postId)
               //posteriormente tendremos que hacer que nos redirija a los post del usuario
           }
        });
    });
};