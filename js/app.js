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
        <div class="bird-image">

            <img
                src="images/birds/cards/${bird.id}.avif"
                alt="${bird.name}"
                onerror="this.src='images/placeholder.jpg'"
            >

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

        targetInput.value = bird.name;

        targetBox.style.display = "none";

        performSearch();
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

const hasActiveFilter =
    search !== "" || status !== "All";

if (resetSearchBtn) {
    resetSearchBtn.style.display =
        hasActiveFilter ? "inline-block" : "none";
}

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
    document.getElementById("modalImage");

const imageBlur =
    document.getElementById("modalImageBlur");

const imagePath =
    `images/birds/${bird.id}.avif`;

image.src = imagePath;
imageBlur.src = imagePath;

image.onerror = () => {

    image.src = "images/placeholder.jpg";
    imageBlur.src = "images/placeholder.jpg";
};

    document.getElementById(
        "modalName"
    ).textContent =
        bird.name || "";

    document.getElementById(
        "modalAssamese"
    ).textContent =
        bird.assameseName || "";

    const modalStatus =
    document.getElementById("modalStatus");

    modalStatus.textContent =
        `IUCN Status: ${bird.iucnStatus || ""}`;

    modalStatus.className =
        `status-badge ${getStatusClass(bird.iucnStatus)}`;

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

    description:
        "The bill is the hard, beak-like structure used for feeding, preening, nest building and many other tasks. Bill shape often reflects a bird's diet and lifestyle.",

    image:
        "images/bill.webp",

    caption:
        "Bill of a Stork-billed Kingfisher.",

    examples: [
        "Stork-billed Kingfisher",
        "Large-billed Crow"
    ]
},
    
"Chin": {
    title: "Chin",

    description:
        "The chin is the small area immediately below the bill. Its colour and markings can help distinguish similar species.",

    image:
        "images/chin.webp",

    caption:
        "Chin of a Pale-chinned Flycatcher.",

    examples: [
        "Pale-chinned Flycatcher",
        "Gray-chinned Minivet"
    ]
},

"Lore": {
    title: "Lore",

    description:
        "The lore is the area between the eye and the base of the bill. It may be bare, feathered, or brightly coloured and is often important for identification.",

    image:
        "images/lore.webp",

    caption:
        "Lore of a Grey-lored Broadbill.",

    examples: [
        "Grey-lored Broadbill",
        "Himalayan Black-lored Tit"
    ]
},

"Eye Ring": {
    title: "Eye Ring",

    description:
        "An eye ring is a ring of feathers or bare skin surrounding the eye. Its presence, colour, and thickness are useful identification features.",

    image:
        "images/eye_ring.webp",

    caption:
        "Eye ring of an Indian White Eye.",

    examples: [
        "Indian White Eye",
        "Yellow-eyed Babbler"
    ]
},

"Throat": {
    title: "Throat",

    description:
        "The throat is the feathered area below the chin and above the breast. Distinct throat patches or colours often help identify birds.",

    image:
        "images/throat.webp",

    caption:
        "Throat of a White-throated Kingfisher.",

    examples: [
        "White-throated Kingfisher",
        "White-throated Fantail"
    ]
},

"Breast": {
    title: "Breast",

    description:
        "The breast is the front part of the body below the throat. Breast colour, streaking and patterns are commonly used in field identification.",

    image:
        "images/breast.webp",

    caption:
        "Breast of a White-breasted Waterhen.",

    examples: [
        "White-breasted Waterhen",
        "Yellow-breasted Bunting"
    ]
},

"Belly": {
    title: "Belly",

    description:
        "The belly is the lower underside of a bird. Belly colour often contrasts with the breast and can be a key field mark.",

    image:
        "images/belly.webp",

    caption:
        "Belly of a Yellow-bellied Prinia.",

    examples: [
        "Yellow-bellied Prinia",
        "Spot-bellied Eagle-Owl"
    ]
},

"Tarsus": {
    title: "Tarsus",

    description:
        "The tarsus is the lower leg segment between the toes and the feathered part of the leg. Its length and colour vary among species.",

    image:
        "images/tarsus.webp",

    caption:
        "Tarsus of a Purple Heron.",

    examples: [
        "Herons",
        "Egrets"
    ]
},

"Toe": {
    title: "Toe",

    description:
        "Birds use their toes for walking, climbing, grasping branches and capturing prey. Toe arrangement differs among bird groups.",

    image:
        "images/toe.webp",

    caption:
        "Toes of a Short-toed Snake-Eagle.",

    examples: [
        "Short-toed Snake-Eagle",
        "Greater Short-toed Lark"
    ]
},

"Supercilium": {
    title: "Supercilium",

    description:
        "The supercilium/brow is the stripe running above a bird's eye, often called the eyebrow. It is one of the most useful field marks for identifying many species.",

    image:
        "images/supercilium.webp",

    caption:
        "Supercilium of a Snowy-browed Flycatcher.",

    examples: [
        "Snowy-browed Flycatcher",
        "Yellow-browed Warbler"
    ]
},

"Crest": {
    title: "Crest",

    description:
        "A crest is a tuft or crown of feathers on the head that can be raised or lowered. It is often used for display and communication.",

    image:
        "images/crest.webp",

    caption:
        "Crest of a Black-crested Bulbul.",

    examples: [
        "Black-crested Bulbul",
        "Crested Serpent Eagle"
    ]
},

"Nape": {
    title: "Nape",

    description:
        "The nape is the back of the neck. Many species have distinctive nape colours, stripes, or patches that help with identification.",

    image:
        "images/nape.webp",

    caption:
        "Nape of a White-naped Yuhina.",

    examples: [
        "White-naped Yuhina",
        "Black-naped Monarch"
    ]
},

"Wing Bars": {
    title: "Wing Bars",

    description:
        "Wing bars are contrasting bands formed by the tips of wing feathers. They are among the most useful field marks for identifying small birds.",

    image:
        "images/wing_bar.webp",

    caption:
        "Wing bar of a Chestnut-crowned Warbler.",

    examples: [
        "Chestnut-crowned Warbler",
        "Blyth's Leaf Warbler"
    ]
},

"Vent": {
    title: "Vent",

    description:
        "The vent is the area surrounding the cloaca beneath the tail. Its colour can be an important identification feature in some species.",

    image:
        "images/vent.webp",

    caption:
        "Vent of a Red-vented Bulbul.",

    examples: [
        "Red-vented Bulbul",
        "Yellow-vented Warbler"
    ]
},

"Rump": {
    title: "Rump",

    description:
        "The rump is the area between the back and the tail. Bright rump colours often become visible when a bird takes flight.",

    image:
        "images/rump.webp",

    caption:
        "Rump of a White-rumped Shama.",

    examples: [
        "White-rumped Shama",
        "White-rumped Vulture"
    ]
},

"Claw": {
    title: "Claw",

    description:
        "Claws are the curved tips of the toes. Their size and shape reflect how a bird moves, hunts, perches, or grips surfaces.",

    image:
        "images/claw.webp",

    caption:
        "Claws of an Asian Barred Owlet.",

    examples: [
        "Owls",
        "Eagles"
    ]
},

"Tail": {
    title: "Tail",

    description:
        "The tail helps with balance, steering, braking, and display. Tail length, shape, and pattern are often important identification features.",

    image:
        "images/tail.webp",

    caption:
        "Tail of a Long-tailed Shrike.",

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

        <div class="anatomy-example">

            <img
                src="${data.image}"
                alt="${data.title}">

            <p class="example-caption">
                ${data.caption}
            </p>

        </div>

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
const labels = document.querySelectorAll(".anatomy-label");

labels.forEach(label => {

    label.addEventListener("click", () => {

        labels.forEach(l =>
            l.classList.remove("active")
        );

        label.classList.add("active");

        updateInfoPanel(label.dataset.part);

    });

});

/* ==========================================
   HERO SLIDESHOW
========================================== */

const heroImages = [

    {
        src: "images/hero/hero1.webp",
        desktopPosition: "center center",
        mobilePosition: "100% center"
    },

    {
        src: "images/hero/hero2.webp",
        desktopPosition: "center center",
        mobilePosition: "65% center"
    },

    {
        src: "images/hero/hero3.webp",
        desktopPosition: "center center",
        mobilePosition: "65% center"
    },
    {
        src: "images/hero/hero4.webp",
        desktopPosition: "center center",
        mobilePosition: "65% center"
    },
    {
        src: "images/hero/hero5.webp",
        desktopPosition: "center center",
        mobilePosition: "65% center"
    }
    {
        src: "images/hero/hero6.webp",
        desktopPosition: "center center",
        mobilePosition: "35% center"
    },
    {
        src: "images/hero/hero7.webp",
        desktopPosition: "center center",
        mobilePosition: "0% center"
    },
    {
        src: "images/hero/hero8.webp",
        desktopPosition: "center center",
        mobilePosition: "100% center"
    },
    {
        src: "images/hero/hero9.webp",
        desktopPosition: "center center",
        mobilePosition: "50% center"
    },
    {
        src: "images/hero/hero10.webp",
        desktopPosition: "center center",
        mobilePosition: "80% center"
    },
    {
        src: "images/hero/hero11.webp",
        desktopPosition: "center center",
        mobilePosition: "100% center"
    },
    {
        src: "images/hero/hero12.webp",
        desktopPosition: "center center",
        mobilePosition: "35% center"
    },
    {
        src: "images/hero/hero13.webp",
        desktopPosition: "center center",
        mobilePosition: "0% center"
    },
    {
        src: "images/hero/hero14.webp",
        desktopPosition: "center center",
        mobilePosition: "80% center"
    },
    {
        src: "images/hero/hero15.webp",
        desktopPosition: "center center",
        mobilePosition: "80% center"
    }

];

function initHeroSlideshow() {

    const slideshow =
        document.getElementById("heroSlideshow");

    if (!slideshow) return;

    heroImages.forEach((image, index) => {

    const slide = document.createElement("div");

    slide.className = "hero-slide";

    slide.style.backgroundImage = `url(${image.src})`;

    if (window.innerWidth <= 768) {

        slide.style.backgroundPosition = image.mobilePosition;

    } else {

        slide.style.backgroundPosition = image.desktopPosition;

    }

    slideshow.appendChild(slide);

});

    const slides =
        slideshow.querySelectorAll(".hero-slide");

    let current = 0;

    setInterval(() => {

        slides[current].classList.remove("active");

        current = (current + 1) % slides.length;

        slides[current].classList.add("active");

    }, 5000);

}
function updateHeroImagePositions() {

    const slides = document.querySelectorAll(".hero-slide");

    slides.forEach((slide, index) => {

        const image = heroImages[index];

        slide.style.backgroundPosition =
            window.innerWidth <= 768
                ? image.mobilePosition
                : image.desktopPosition;

    });

}

document.addEventListener("DOMContentLoaded", () => {

    loadBirds();

    initHeroSlideshow();

});
/* ==========================================
   MOBILE NAVIGATION
========================================== */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

    navLinks.classList.toggle("active");
    menuToggle.classList.toggle("active");

});

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("active");
        menuToggle.classList.remove("active");

    });

});

}
window.addEventListener("resize", updateHeroImagePositions);
