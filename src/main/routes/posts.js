const {ObjectId} = require("mongodb");

module.exports = function (app, postsRepository) {

    app.get('/posts/add', function (req, res) {
        res.render("posts/add.twig");
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
           }
        });
    });
};