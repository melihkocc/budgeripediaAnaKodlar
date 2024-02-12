exports.error_404 = (req,res,next) => {
    res.status(404);
    res.render("error/404")
}