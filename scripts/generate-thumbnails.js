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

    let generated = 0;
    let skipped = 0;

    for (const file of files) {

        if (!file.toLowerCase().endsWith(".avif")) continue;

        const input = path.join(sourceDir, file);
        const output = path.join(outputDir, file);

        // Skip if thumbnail is newer than original
        if (fs.existsSync(output)) {

            const sourceTime = fs.statSync(input).mtimeMs;
            const thumbTime = fs.statSync(output).mtimeMs;

            if (thumbTime >= sourceTime) {
                console.log(`✓ Skipped ${file}`);
                skipped++;
                continue;
            }
        }

        console.log(`Generating ${file}`);

        await sharp(input)
            .resize(480, 320, {
                fit: "cover",
                position: "centre"
            })
            .avif({
                quality: 85,
                effort: 4
            })
            .toFile(output);

        generated++;
    }

    console.log("");
    console.log("===========================");
    console.log(`Generated : ${generated}`);
    console.log(`Skipped   : ${skipped}`);
    console.log("===========================");

})();
