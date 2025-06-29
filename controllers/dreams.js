const Dream = require("../models/Dream")
const openai = require("../utils/openaiClient");
const generateDreamPrompt = require("../utils/generateDreamPrompt");

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

// interpretDream
exports.interpretDream = async (req, res) => {
    try {
        const dream = req.dream;

        if (dream.user.toString() !== req.userId) {
            return res.status(403).json({ error: "Not authorized" });
        }

        // Skip if already interpreted
        if (dream.interpretation) {
            return res.json({ interpretation: dream.interpretation });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are an expert dream interpreter." },
                { role: "user", content: `Interpret this dream:\n\n${dream.content}` }
            ]
        });

        const interpretation = completion.choices[0].message.content;
        dream.interpretation = interpretation;
        await dream.save();

        res.json({ interpretation });
    } catch (e) {
        console.error("OpenAI error:", e);
        res.status(500).json({ error: "Failed to interpret dream" });
    }
}

exports.generateDreamImage = async (req, res) => {
    try {
        const dream = req.dream;

        if (dream.user.toString() !== req.userId) {
            return res.status(403).json({ error: "Not authorized" });
        }

        // Optional: skip if image already exists
        if (dream.imageUrl) {
            return res.json({ imageUrl: dream.imageUrl });
        }

        // Generate an image prompt based on the dream content
        const prompt = generateDreamPrompt(dream.content);

        // Call OpenAI DALL·E
        const response = await openai.images.generate({
            model: "dall-e-3", // or "dall-e-2" if you're on a cheaper plan
            prompt: prompt,
            n: 1,
            size: "1024x1024"
        });

        const imageUrl = response.data[0].url;

        // Save it to the dream
        dream.imageUrl = imageUrl;
        await dream.save();

        res.json({ imageUrl });

    } catch (err) {
        console.error("Image generation error:", err);
        res.status(500).json({ error: "Failed to generate dream image" });
    }
};