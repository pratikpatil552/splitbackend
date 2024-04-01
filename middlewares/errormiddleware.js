const errorMiddleware = (err,req,res,next) =>{
    const status = err.status || 500;
    const message = err.message || "BACKEND ERROR";
    const extraD = err.extraD || "error from backend";

    return res.status(status).json({message,extraD});
}

module.exports = errorMiddleware;