function generateDreamPrompt(dreamContent) {
    return `
        Create a surreal, high-detail illustration based on the following dream:

        "${dreamContent}"

        Your image should reflect the emotions and themes present in the dream, using visual metaphors and a dreamlike atmosphere.

        Focus on:
        - Abstract and symbolic elements
        - Ethereal lighting
        - A cinematic, painterly quality

        Output style: digital painting, fantasy concept art, soft color palette, Studio Ghibli meets Salvador Dalí.
        `
        .trim();
}

module.exports = generateDreamPrompt;
