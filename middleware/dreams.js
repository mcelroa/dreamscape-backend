const Dream = require("../models/Dream");

exports.dreamById = (req, res, next, id) => {
    Dream.findById(id)
        .then((dream) => {
            if (!dream) return res.status(400).json({ error: "Dream not found" })

            req.dream = dream;
            next();
        })
        .catch((e) => {
            console.error("Error getting dream: ", e)
            return res.status(400).json({
                err: 'Error getting dream'
            })
        })
};