const Dream = require("../models/Dream")

// getAll
exports.getAll = async (req, res) => {
    try {
        const dreams = await Dream.find({});

        if (!dreams) return res.status(401).json({ error: "There are no dreams to be displayed" });

        res.status(200).json({ dreams });

    } catch (e) {
        console.error("Error getting dreams: ", e)
        res.status(500).json({ error: "There was an error fetching dreams" })
    }
}

// getById
exports.getById = async (req, res) => {
    const dream = req.dream;

    if (dream.user.toString() !== req.userId) {
        return res.status(403).json({ error: "Access denied" })
    }

    res.json(dream);
}

// create
exports.create = async (req, res) => {
    try {
        const userId = req.userId;
        const { title, content } = req.body;

        const dream = new Dream({ user: userId, title, content });

        await dream.save();

        res.status(200).json({ dream })

    } catch (e) {
        console.error("Error creating dream: ", e);
        res.status(500).json({ error: "Error creating dream" })
    }
}

// update
exports.update = async (req, res) => {
    return;
}

// remove
exports.remove = async (req, res) => {
    return;
}
