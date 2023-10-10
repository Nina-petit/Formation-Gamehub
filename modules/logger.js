module.exports = function (req, res, next) {
    req.on('end', () => {
         const dateIso = new Date().toISOString();
         const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.ip;
         const path = req.path;
         console.log(`[${dateIso} ${ip}] ${res.statusCode} ${path}`);
    });
 next();
}