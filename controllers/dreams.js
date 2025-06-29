const Dream = require("../models/Dream")

// getAll
exports.getAll = async (req, res) => {
    try {
        const dreams = await Dream.find({ user: req.userId });

        if (!dreams) return res.status(401).json({ error: "There are no dreams to be displayed" });

        res.status(200).json({ dreams });

    } catch (e) {
        console.error("Get All Error: ", e)
        res.status(500).json({ error: "There was an error fetching dreams" })
    }
}

// getById
exports.getById = async (req, res) => {
    const dream = req.dream;

    if (!dream) {
        return res.status(400).json({ error: "Dream does not exist" })
    }

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
    try {
        const dream = req.dream;

        // Check if logged in user is trying to update
        if (dream.user.toString() !== req.userId) {
            return res.status(403).json({ error: "You are not authorized to update this dream" });
        }

        // Copy the incoming req body into the current dream
        Object.assign(dream, req.body);

        const updatedDream = await dream.save();

        res.json({ updatedDream })
    } catch (e) {
        console.error("Update error: ", e);
        res.status(500).json({ error: "Failed to update dream" })
    }
}

// remove
exports.remove = async (req, res) => {
    try {
        const dream = req.dream;

        await dream.deleteOne();

        res.json({ message: "Dream deleted successfully" })
    } catch (e) {
        console.error("Deletion Error: ", e);
        res.status(500).json({ error: "Dream could not be deleted" })

    }
}
