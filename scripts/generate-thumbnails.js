const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "images", "birds");
const outputDir = path.join(sourceDir, "cards");

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(sourceDir);

(async () => {

    for (const file of files) {

        if (!file.toLowerCase().endsWith(".avif")) continue;

        const input = path.join(sourceDir, file);
        const output = path.join(outputDir, file);

        console.log(`Creating thumbnail: ${file}`);

        await sharp(input)

            // Resize to card size
            .resize(480, 320, {
                fit: "cover",
                position: "centre"
            })

            // Save as AVIF
            .avif({
                quality: 85,
                effort: 4
            })

            .toFile(output);
    }

    console.log("Finished generating thumbnails.");

})();
