const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const token = req.header('Authorization')

    if(!token) {
        return res.status(401).json({error: 'Token invalido!'})
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET)

        req.user = verified
        
        next()
    } catch (error) {
        res.status(401).json({ error: error || "Não foi possivel verificar o token" })
    }
}