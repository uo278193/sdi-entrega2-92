module.exports = function (app, commentsRepository) {

    app.post('/comments/:song_id', function (req, res) {
        let comment = {
            author:  req.session.user,
            text: req.body.text,
            song_id: req.params.song_id
        }

        if(req.session.user == null){
            res.send("No puedes comentar sin iniciar sesión");
            return;
        }

        if(comment.text === "" || comment.text == null){
            res.send("El comentario está vacío");
            return;
        }

        commentsRepository.insertComment(comment, function (commentId) {
            if (commentId == null) {
                res.send("Error al insertar comentario");
            } else {
                res.redirect("/songs/" + comment.song_id);
            }
        });
    });

};