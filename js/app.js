let birds = [];
let filteredBirds = [];

const birdGrid = document.getElementById("birdGrid");
const searchInput = document.getElementById("searchInput");
const directorySearchInput =
    document.getElementById(
        "directorySearchInput"
    );
const statusFilter = document.getElementById("statusFilter");
const suggestionsBox = document.getElementById("suggestions");
const directorySuggestionsBox =
    document.getElementById(
        "directorySuggestions"
    );
const resetSearchBtn = document.getElementById("resetSearchBtn");

const loadMoreBtn =
    document.getElementById(
        "loadMoreBtn"
    );

let birdsPerPage = 12;

let visibleBirds = 12;

function getStatusClass(status) {

    switch (status) {

        case "LC":
            return "status-lc";

        case "NT":
            return "status-nt";

        case "VU":
            return "status-vu";

        case "EN":
            return "status-en";

        case "CR":
            return "status-cr";

        default:
            return "";
    }
}

async function loadBirds() {

    try {

        const response =
            await fetch("data/birds.json");

        if (!response.ok) {
            throw new Error(
                `Failed to load birds.json (${response.status})`
            );
        }

        birds = await response.json();

birds.sort((a, b) =>
    a.name.localeCompare(
        b.name,
        "en",
        { sensitivity: "base" }
    )
);

filteredBirds = [...birds];

updateStatistics();

if (document.getElementById("birdOfDay")) {
    renderBirdOfDay();
}

if (document.getElementById("birdGrid")) {
    renderBirds(filteredBirds);
    updateResultCount();
}

    } catch (error) {

        console.error(
            "Error loading bird data:",
            error
        );
    }
}

function updateStatistics() {

    if (
        !document.getElementById("speciesCount")
    ) {
        return;
    }

    const speciesCount =
        birds.length;

    document.getElementById(
        "speciesCount"
    ).textContent =
        speciesCount;

    const assameseCount =
    birds.filter(
        bird =>
            bird.assameseName &&
            bird.assameseName.trim() !== ""
    ).length;

document.getElementById(
    "aboutSpeciesCount"
).textContent =
    speciesCount;

document.getElementById(
    "aboutAssameseCount"
).textContent =
    assameseCount;

    const lc =
        birds.filter(
            b => b.iucnStatus === "LC"
        ).length;

    const nt =
        birds.filter(
            b => b.iucnStatus === "NT"
        ).length;

    const vu =
        birds.filter(
            b => b.iucnStatus === "VU"
        ).length;

    const en =
        birds.filter(
            b => b.iucnStatus === "EN"
        ).length;

    const cr =
        birds.filter(
            b => b.iucnStatus === "CR"
        ).length;

    document.getElementById(
        "countLC"
    ).textContent =
        `LC ${lc}`;

    document.getElementById(
        "countNT"
    ).textContent =
        `NT ${nt}`;

    document.getElementById(
        "countVU"
    ).textContent =
        `VU ${vu}`;

    document.getElementById(
        "countEN"
    ).textContent =
        `EN ${en}`;

    document.getElementById(
        "countCR"
    ).textContent =
        `CR ${cr}`;

    const total =
        lc + nt + vu + en + cr;

    if (total > 0) {

        document.getElementById(
            "barLC"
        ).style.width =
            `${(lc / total) * 100}%`;

        document.getElementById(
            "barNT"
        ).style.width =
            `${(nt / total) * 100}%`;

        document.getElementById(
            "barVU"
        ).style.width =
            `${(vu / total) * 100}%`;

        document.getElementById(
            "barEN"
        ).style.width =
            `${(en / total) * 100}%`;

        document.getElementById(
            "barCR"
        ).style.width =
            `${(cr / total) * 100}%`;
    }

    document.getElementById(
        "lastUpdated"
    ).textContent =
        "June 2025";
}

function updateResultCount() {

    const resultCount =
        document.getElementById(
            "resultCount"
        );

    if (resultCount) {

        resultCount.textContent =
            `Showing ${filteredBirds.length} birds`;
    }
}

function renderBirdOfDay() {

    const container =
        document.getElementById(
            "birdOfDay"
        );

    if (!birds.length) return;

    const today = new Date();

    const dayNumber =
        Math.floor(
            today.getTime() /
            (1000 * 60 * 60 * 12)
        );

    const bird =
        birds[
            dayNumber % birds.length
        ];

container.innerHTML = `
    <div class="bird-card featured-bird">

        <div class="featured-image-wrapper">

            <img
                src="${bird.image}"
                alt="${bird.name}"
                onerror="this.src='images/placeholder.jpg'"
            >

            <div class="featured-tag">
                Featured Today
            </div>

        </div>

        <div class="bird-info">

            <h3>${bird.name}</h3>

            <p class="assamese-name">
                ${bird.assameseName || ""}
            </p>

            <span
                class="status-badge ${getStatusClass(
                    bird.iucnStatus
                )}">
                ${bird.iucnStatus || ""}
            </span>

            <p class="featured-description">

                ${(bird.description || "")
                    .substring(0, 180)}...

            </p>

            <button class="featured-btn">
                Learn More
            </button>

        </div>

    </div>
`;

    const card =
        container.querySelector(
            ".bird-card"
        );

    if (card) {

        card.addEventListener(
            "click",
            () => openModal(bird)
        );
    }
}

function renderBirds(birdList) {

    birdGrid.innerHTML = "";
    const speciesProgress =
    document.getElementById(
        "speciesProgress"
    );

    const birdsToShow =
        birdList.slice(
            0,
            visibleBirds
        );

    birdsToShow.forEach(bird => {

        const card =
            document.createElement("div");

        card.className =
            "bird-card";

        card.innerHTML = `
            <img
                src="${bird.image}"
                alt="${bird.name}"
                onerror="this.src='images/placeholder.jpg'"
            >

            <div class="bird-info">

                <h3>${bird.name}</h3>

                <p class="assamese-name">
                    ${bird.assameseName || ""}
                </p>

                <span
                    class="status-badge ${getStatusClass(
                        bird.iucnStatus
                    )}">

                    ${bird.iucnStatus || ""}

                </span>

            </div>
        `;

        card.addEventListener(
            "click",
            () => openModal(bird)
        );

        birdGrid.appendChild(card);
    });

if (speciesProgress) {

    speciesProgress.textContent =
        `${Math.min(
            visibleBirds,
            birdList.length
        )} of ${birdList.length} species shown`;
}
    
if (
    visibleBirds >=
    birdList.length
) {

    loadMoreBtn.style.display =
        "none";
}
else {

    loadMoreBtn.style.display =
        "inline-block";

    loadMoreBtn.textContent =
        `Load More`;
}
}
function showSuggestions(searchTerm, targetBox, targetInput) {

    if (!targetBox) return;

    targetBox.innerHTML = "";

    if (searchTerm.length < 2) {

        targetBox.style.display = "none";
        return;
    }

    const matches =
        birds
            .filter(bird =>

                (bird.name || "")
                    .toLowerCase()
                    .includes(searchTerm)

                ||

                (bird.assameseName || "")
                    .toLowerCase()
                    .includes(searchTerm)
            )
            .slice(0, 5);

    if (!matches.length) {

        targetBox.style.display = "none";
        return;
    }

    matches.forEach(bird => {

        const item =
            document.createElement("div");

        item.className =
            "suggestion-item";

        item.textContent =
            bird.name;

        item.addEventListener(
            "click",
            () => {

                targetInput.value =
                    bird.name;

                targetBox.style.display =
                    "none";

                filterBirds();
            }
        );

        targetBox.appendChild(item);
    });

    targetBox.style.display =
        "block";
}

function performSearch() {

    filterBirds();

    document
        .querySelector(".directory")
        .scrollIntoView({
            behavior: "smooth"
        });

    if (resetSearchBtn) {

        resetSearchBtn.style.display =
            "inline-block";
    }

    setTimeout(() => {

    searchInput.value = "";

}, 500);
}

function filterBirds() {

    const heroSearch =
        searchInput.value
            .toLowerCase()
            .trim();

    const directorySearch =
        directorySearchInput
            ? directorySearchInput.value
                .toLowerCase()
                .trim()
            : "";

    const search =
        directorySearch ||
        heroSearch;

    const status =
        statusFilter.value;

    filteredBirds =
        birds.filter(bird => {

            const matchesSearch =

                (bird.name || "")
                    .toLowerCase()
                    .includes(search)

                ||

                (bird.assameseName || "")
                    .toLowerCase()
                    .includes(search);

            const matchesStatus =

                status === "All"

                ||

                (bird.iucnStatus || "")
                    === status;

            return (
                matchesSearch &&
                matchesStatus
            );
        });
    visibleBirds = 12;
    renderBirds(filteredBirds);

    updateResultCount();

    showSuggestions(
    heroSearch,
    suggestionsBox,
    searchInput
);

if (directorySearchInput) {

    showSuggestions(
        directorySearch,
        directorySuggestionsBox,
        directorySearchInput
    );
}
}

if (searchInput) {

    searchInput.addEventListener(
        "input",
        filterBirds
    );

    searchInput.addEventListener(
        "focus",
        () => {

            if (window.innerWidth <= 768) {

                setTimeout(() => {

                    searchInput.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                }, 300);

            }

        }
    );

}

if (directorySearchInput) {

    directorySearchInput.addEventListener(
        "input",
        filterBirds
    );

directorySearchInput.addEventListener(
    "focus",
    () => {

        if (window.innerWidth <= 768) {

            setTimeout(() => {

                directorySearchInput.scrollIntoView({

                    behavior: "smooth",

                    block: "center"

                });

            }, 500);

        }

    }
);
}

if (searchInput) {

    searchInput.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                if (suggestionsBox) {

                    suggestionsBox.style.display =
                        "none";

                }

                performSearch();
            }
        }
    );

}

if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        filterBirds
    );

}

if (resetSearchBtn) {

    resetSearchBtn.addEventListener(
        "click",
        () => {

            filteredBirds = [...birds];

            visibleBirds = 12;
            
            renderBirds(filteredBirds);

            updateResultCount();

            if (searchInput) {

    searchInput.value = "";

}

            if (directorySearchInput) {

    directorySearchInput.value = "";
}

            statusFilter.value = "All";

            suggestionsBox.style.display =
                "none";

            resetSearchBtn.style.display =
                "none";
        }
    );
}

function openModal(bird) {

    const image =
        document.getElementById(
            "modalImage"
        );

    image.src =
    bird.image;

    image.onerror = () => {

        image.src =
            "images/placeholder.jpg";
    };

    document.getElementById(
        "modalName"
    ).textContent =
        bird.name || "";

    document.getElementById(
        "modalAssamese"
    ).textContent =
        bird.assameseName || "";

    document.getElementById(
        "modalStatus"
    ).textContent =
        `IUCN Status: ${bird.iucnStatus || ""}`;

    document.getElementById(
        "modalDescription"
    ).textContent =
        bird.description || "";

    document.getElementById(
        "birdModal"
    ).style.display =
        "flex";
}

const closeModalBtn =
    document.getElementById(
        "closeModal"
    );

if (closeModalBtn) {

    closeModalBtn.addEventListener(
        "click",
        () => {

            document
                .getElementById("birdModal")
                .style.display =
                "none";
        }
    );

}

window.addEventListener(
    "click",
    event => {

        const modal =
            document.getElementById(
                "birdModal"
            );

        if (event.target === modal) {

            modal.style.display =
                "none";
        }
    }
);

document.addEventListener(
    "click",
    event => {

        if (
            !event.target.closest(
                ".search-wrapper"
            )
        ) {

            if (suggestionsBox) {

    suggestionsBox.style.display =
        "none";

}

if (directorySuggestionsBox) {

    directorySuggestionsBox.style.display =
        "none";
}
        }
    }
);

if (loadMoreBtn) {

    loadMoreBtn.addEventListener(
        "click",
        () => {

            visibleBirds += birdsPerPage;

            renderBirds(
                filteredBirds
            );
        }
    );

}
const suggestionForm =
    document.getElementById(
        "birdSuggestionForm"
    );

if (suggestionForm) {

    suggestionForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            const englishName =
                document
                    .getElementById(
                        "englishName"
                    )
                    .value
                    .trim();

            const assameseName =
                document
                    .getElementById(
                        "assameseName"
                    )
                    .value
                    .trim();

            const location =
                document
                    .getElementById(
                        "location"
                    )
                    .value
                    .trim();

            const notes =
                document
                    .getElementById(
                        "notes"
                    )
                    .value
                    .trim();

            const contributorName =
                document
                    .getElementById(
                        "contributorName"
                    )
                    .value
                    .trim();

            const formMessage =
                document
                    .getElementById(
                        "formMessage"
                    );

            if (
                !englishName &&
                !assameseName
            ) {

                formMessage.textContent =
                    "Please enter either an English or Assamese name.";

                return;
            }

            try {

                await fetch(
                    "https://script.google.com/macros/s/AKfycbzDuo46jkZjM3mIxkgx8x9QopgF1zioD3Qy2S6qyrXalWVhrZJ12mTKWh-Sv5DTD12l/exec",
                    {
                        method: "POST",

                        body: JSON.stringify({
                            englishName,
                            assameseName,
                            location,
                            notes,
                            contributorName
                        })
                    }
                );

                formMessage.textContent =
                    "Thank you for your contribution!";

                suggestionForm.reset();

            } catch(error) {

                formMessage.textContent =
                    "Submission failed. Please try again.";
            }
        }
    );
}

const anatomyInfo = {

    "Bill": {
        title: "Bill",
        description: "The bill is the hard, beak-like structure used for feeding, preening, nest building, and many other tasks. Bill shape often reflects a bird's diet and lifestyle.",
        examples: [
            "Red-billed Blue Magpie",
            "Large-billed Crow"
        ]
    },

    "Chin": {
        title: "Chin",
        description: "The chin is the small area immediately below the bill. Its colour and markings can help distinguish similar species.",
        examples: [
            "Black-chinned Yuhina",
            "Black-chinned Babbler"
        ]
    },

    "Lore": {
        title: "Lore",
        description: "The lore is the area between the eye and the base of the bill. It may be bare, feathered, or brightly coloured and is often important for identification.",
        examples: [
            "Yellow-lored Tit",
            "White-lored Warbler"
        ]
    },

    "Eye Ring": {
        title: "Eye Ring",
        description: "An eye ring is a ring of feathers or bare skin surrounding the eye. Its presence, colour, and thickness are useful identification features.",
        examples: [
            "Oriental White-eye",
            "Indian White-eye"
        ]
    },

    "Throat": {
        title: "Throat",
        description: "The throat is the feathered area below the chin and above the breast. Distinct throat patches or colours often help identify birds.",
        examples: [
            "White-throated Kingfisher",
            "White-throated Fantail"
        ]
    },

    "Breast": {
        title: "Breast",
        description: "The breast is the front part of the body below the throat. Breast colour, streaking, and patterns are commonly used in field identification.",
        examples: [
            "Chestnut-breasted Partridge",
            "Spot-breasted Scimitar Babbler"
        ]
    },

    "Belly": {
        title: "Belly",
        description: "The belly is the lower underside of a bird. Belly colour often contrasts with the breast and can be a key field mark.",
        examples: [
            "White-bellied Heron",
            "White-bellied Yuhina"
        ]
    },

    "Tarsus": {
        title: "Tarsus",
        description: "The tarsus is the lower leg segment between the toes and the feathered part of the leg. Its length and colour vary among species.",
        examples: [
            "Herons",
            "Egrets"
        ]
    },

    "Toe": {
        title: "Toe",
        description: "Birds use their toes for walking, climbing, grasping branches, and capturing prey. Toe arrangement differs among bird groups.",
        examples: [
            "Woodpeckers",
            "Kingfishers"
        ]
    },

    "Supercilium": {
        title: "Supercilium",
        description: "The supercilium is the stripe running above a bird's eye, often called the eyebrow. It is one of the most useful field marks for identifying many species.",
        examples: [
            "Yellow-browed Warbler",
            "White-browed Fantail"
        ]
    },

    "Crest": {
        title: "Crest",
        description: "A crest is a tuft or crown of feathers on the head that can be raised or lowered. It is often used for display and communication.",
        examples: [
            "Crested Serpent Eagle",
            "Greater Racket-tailed Drongo"
        ]
    },

    "Nape": {
        title: "Nape",
        description: "The nape is the back of the neck. Many species have distinctive nape colours, stripes, or patches that help with identification.",
        examples: [
            "Black-naped Monarch",
            "Rufous-naped Tit"
        ]
    },

    "Wing Bars": {
        title: "Wing Bars",
        description: "Wing bars are contrasting bands formed by the tips of wing feathers. They are among the most useful field marks for identifying small birds.",
        examples: [
            "Yellow-browed Warbler",
            "Various Flycatchers"
        ]
    },

    "Vent": {
        title: "Vent",
        description: "The vent is the area surrounding the cloaca beneath the tail. Its colour can be an important identification feature in some species.",
        examples: [
            "Yellow-vented Warbler",
            "Yellow-vented Bulbul"
        ]
    },

    "Rump": {
        title: "Rump",
        description: "The rump is the area between the back and the tail. Bright rump colours often become visible when a bird takes flight.",
        examples: [
            "White-rumped Shama",
            "White-rumped Vulture"
        ]
    },

    "Claw": {
        title: "Claw",
        description: "Claws are the curved tips of the toes. Their size and shape reflect how a bird moves, hunts, perches, or grips surfaces.",
        examples: [
            "Owls",
            "Eagles"
        ]
    },

    "Tail": {
        title: "Tail",
        description: "The tail helps with balance, steering, braking, and display. Tail length, shape, and pattern are often important identification features.",
        examples: [
            "Long-tailed Shrike",
            "Fork-tailed Drongo"
        ]
    }

};
function updateInfoPanel(part) {

    const panel =
        document.getElementById("infoPanel");

    const data =
        anatomyInfo[part];

    if (!data) return;

    panel.innerHTML = `
        <h2>${data.title}</h2>

        <p>${data.description}</p>

        <h3>Examples in Pokhi</h3>

        <ul>
            ${data.examples
                .map(
                    bird => `<li>${bird}</li>`
                )
                .join("")}
        </ul>
    `;
}
const hotspots =
    document.querySelectorAll(".hotspot");

hotspots.forEach(spot => {

    const part =
        spot.dataset.part;

    spot.addEventListener(
        "click",
        () => {

            document
                .querySelectorAll(".hotspot")
                .forEach(h =>
                    h.classList.remove("active")
                );

            spot.classList.add("active");

            updateInfoPanel(part);
        }
    );

});
