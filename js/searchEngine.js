/* ==========================================================
   Pokkhi Search Engine
   Version : 1.0

   Features
   --------
   ✓ Query normalization
   ✓ Tokenization
   ✓ Search indexing
   ✓ English search
   ✓ Assamese search

   Future
   ------
   □ Roman Assamese
   □ Assamese phonetics
   □ Search ranking
   □ Scientific names
   □ Typo tolerance
========================================================== */


/* ===========================
   Normalize query
=========================== */

function normalizeQuery(text) {

    return (text || "")
        .toLowerCase()
        .trim();

}


/* ===========================
   Split into searchable words
=========================== */

function tokenize(text) {

    return normalizeQuery(text)

        .replace(/[\/,()]/g, " ")

        .replace(/-/g, " ")

        .replace(/\s+/g, " ")

        .split(" ")

        .filter(Boolean);

}


/* ===========================
   Build Search Index
=========================== */

function buildSearchIndex(bird) {

    const tokens = new Set();

    /* ---------- English ---------- */

    const english =
        normalizeQuery(
            bird.name || ""
        );

    if (english) {

        tokens.add(english);

        const words =
            tokenize(english);

        words.forEach(word =>
            tokens.add(word)
        );

        for (
            let i = 0;
            i < words.length - 1;
            i++
        ) {

            tokens.add(
                words[i] +
                " " +
                words[i + 1]
            );

        }

        tokens.add(
            english.replace(/-/g, "")
        );

    }

    /* ---------- Assamese ---------- */

    const assamese =
        normalizeQuery(
            bird.assameseName || ""
        );

    if (assamese) {

        tokens.add(assamese);

        tokenize(assamese)
            .forEach(word =>
                tokens.add(word)
            );

    }

    return [...tokens].join(" ");

}


/* ===========================
   Search
=========================== */

function findMatchingBirds(
    birds,
    query
) {

    query =
        normalizeQuery(query);

    if (!query)
        return birds;

    return birds.filter(
        bird =>
            bird.searchIndex.includes(
                query
            )
    );

}
