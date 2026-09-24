const sourceLanguage =
    document.getElementById("sourceLanguage");

const targetLanguage =
    document.getElementById("targetLanguage");

const inputText =
    document.getElementById("inputText");

const outputText =
    document.getElementById("outputText");

const translateButton =
    document.getElementById("translateButton");

const translateButtonText =
    document.getElementById("translateButtonText");

const loadingSpinner =
    document.getElementById("loadingSpinner");

const swapButton =
    document.getElementById("swapButton");

const clearButton =
    document.getElementById("clearButton");

const copyButton =
    document.getElementById("copyButton");

const speakButton =
    document.getElementById("speakButton");

const characterCount =
    document.getElementById("characterCount");

const statusMessage =
    document.getElementById("statusMessage");

const detectedLanguage =
    document.getElementById("detectedLanguage");

const toast =
    document.getElementById("toast");


// Supported languages
const languages = [
    {
        code: "auto",
        name: "Detect Language"
    },
    {
        code: "en",
        name: "English"
    },
    {
        code: "te",
        name: "Telugu"
    },
    {
        code: "hi",
        name: "Hindi"
    },
    {
        code: "ta",
        name: "Tamil"
    },
    {
        code: "kn",
        name: "Kannada"
    },
    {
        code: "ml",
        name: "Malayalam"
    },
    {
        code: "bn",
        name: "Bengali"
    },
    {
        code: "mr",
        name: "Marathi"
    },
    {
        code: "gu",
        name: "Gujarati"
    },
    {
        code: "pa",
        name: "Punjabi"
    },
    {
        code: "ur",
        name: "Urdu"
    },
    {
        code: "fr",
        name: "French"
    },
    {
        code: "de",
        name: "German"
    },
    {
        code: "es",
        name: "Spanish"
    },
    {
        code: "it",
        name: "Italian"
    },
    {
        code: "pt",
        name: "Portuguese"
    },
    {
        code: "ru",
        name: "Russian"
    },
    {
        code: "ja",
        name: "Japanese"
    },
    {
        code: "ko",
        name: "Korean"
    },
    {
        code: "zh-Hans",
        name: "Chinese (Simplified)"
    },
    {
        code: "ar",
        name: "Arabic"
    },
    {
        code: "tr",
        name: "Turkish"
    },
    {
        code: "nl",
        name: "Dutch"
    },
    {
        code: "sv",
        name: "Swedish"
    },
    {
        code: "pl",
        name: "Polish"
    },
    {
        code: "uk",
        name: "Ukrainian"
    },
    {
        code: "vi",
        name: "Vietnamese"
    },
    {
        code: "id",
        name: "Indonesian"
    }
];


// Populate language dropdowns
function populateLanguages() {

    sourceLanguage.innerHTML = "";
    targetLanguage.innerHTML = "";

    languages.forEach(language => {

        const sourceOption =
            document.createElement("option");

        sourceOption.value =
            language.code;

        sourceOption.textContent =
            language.name;

        sourceLanguage.appendChild(
            sourceOption
        );


        // Don't show "Detect Language"
        // as target language
        if (language.code !== "auto") {

            const targetOption =
                document.createElement("option");

            targetOption.value =
                language.code;

            targetOption.textContent =
                language.name;

            targetLanguage.appendChild(
                targetOption
            );
        }
    });

    // Default languages
    sourceLanguage.value = "en";
    targetLanguage.value = "te";
}


// Update character count
function updateCharacterCount() {

    const count =
        inputText.value.length;

    characterCount.textContent =
        `${count} / 5000`;
}


// Show status message
function showStatus(message, type = "") {

    statusMessage.textContent =
        message;

    statusMessage.className =
        `status-message ${type}`;
}


// Show toast
function showToast(message) {

    toast.textContent =
        message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);
}


// Set loading state
function setLoading(isLoading) {

    translateButton.disabled =
        isLoading;

    if (isLoading) {

        translateButtonText.textContent =
            "Translating...";

        loadingSpinner.hidden =
            false;

    } else {

        translateButtonText.textContent =
            "Translate";

        loadingSpinner.hidden =
            true;
    }
}


// Translate text
async function translateText() {

    const text =
        inputText.value.trim();

    const source =
        sourceLanguage.value;

    const target =
        targetLanguage.value;


    if (!text) {

        showStatus(
            "Please enter some text to translate.",
            "error"
        );

        inputText.focus();

        return;
    }


    if (!target) {

        showStatus(
            "Please select a target language.",
            "error"
        );

        return;
    }


    if (
        source !== "auto" &&
        source === target
    ) {

        outputText.textContent =
            text;

        detectedLanguage.textContent =
            "";

        showStatus(
            "Source and target languages are the same.",
            "success"
        );

        return;
    }


    setLoading(true);

    showStatus(
        "Translating your text...",
        "loading"
    );


    try {

        const response =
            await fetch(
                "/api/translate",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        text,
                        source,
                        target
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Translation failed."
            );
        }


        outputText.textContent =
            data.translatedText;


        // Show detected language
        if (
            source === "auto" &&
            data.detectedLanguage
        ) {

            const detected =
                languages.find(
                    language =>
                        language.code ===
                        data.detectedLanguage
                );

            detectedLanguage.textContent =
                detected
                    ? `Detected: ${detected.name}`
                    : `Detected: ${data.detectedLanguage}`;

        } else {

            detectedLanguage.textContent =
                "";
        }


        showStatus(
            "Translation completed successfully.",
            "success"
        );

    } catch (error) {

        console.error(error);

        outputText.textContent =
            "Translation failed. Please try again.";

        detectedLanguage.textContent =
            "";

        showStatus(
            error.message ||
            "Something went wrong.",
            "error"
        );

    } finally {

        setLoading(false);
    }
}


// Swap languages
function swapLanguages() {

    // Can't swap when source is auto
    if (sourceLanguage.value === "auto") {

        showToast(
            "Select a source language before swapping."
        );

        return;
    }


    const oldSource =
        sourceLanguage.value;

    const oldTarget =
        targetLanguage.value;


    sourceLanguage.value =
        oldTarget;

    targetLanguage.value =
        oldSource;


    // Swap text if translation exists
    const translated =
        outputText.textContent;


    if (
        translated &&
        translated !==
        "Your translation will appear here..."
    ) {

        inputText.value =
            translated;

        outputText.textContent =
            "Your translation will appear here...";

        updateCharacterCount();

        detectedLanguage.textContent =
            "";

        showStatus(
            "",
            ""
        );
    }
}


// Clear input
function clearText() {

    inputText.value = "";

    outputText.textContent =
        "Your translation will appear here...";

    detectedLanguage.textContent =
        "";

    updateCharacterCount();

    showStatus(
        "",
        ""
    );

    inputText.focus();
}


// Copy translated text
async function copyTranslation() {

    const text =
        outputText.textContent.trim();


    if (
        !text ||
        text ===
        "Your translation will appear here..."
    ) {

        showToast(
            "Nothing to copy."
        );

        return;
    }


    try {

        await navigator.clipboard.writeText(
            text
        );

        showToast(
            "Translation copied!"
        );

    } catch (error) {

        showToast(
            "Unable to copy text."
        );
    }
}


// Text to speech
function speakTranslation() {

    const text =
        outputText.textContent.trim();


    if (
        !text ||
        text ===
        "Your translation will appear here..."
    ) {

        showToast(
            "Nothing to read."
        );

        return;
    }


    if (!("speechSynthesis" in window)) {

        showToast(
            "Text-to-speech is not supported."
        );

        return;
    }


    window.speechSynthesis.cancel();


    const speech =
        new SpeechSynthesisUtterance(text);


    speech.lang =
        targetLanguage.value === "zh-Hans"
            ? "zh-CN"
            : targetLanguage.value;


    window.speechSynthesis.speak(
        speech
    );
}


// Event listeners

translateButton.addEventListener(
    "click",
    translateText
);

swapButton.addEventListener(
    "click",
    swapLanguages
);

clearButton.addEventListener(
    "click",
    clearText
);

copyButton.addEventListener(
    "click",
    copyTranslation
);

speakButton.addEventListener(
    "click",
    speakTranslation
);

inputText.addEventListener(
    "input",
    updateCharacterCount
);


// Ctrl + Enter to translate
inputText.addEventListener(
    "keydown",
    event => {

        if (
            event.ctrlKey &&
            event.key === "Enter"
        ) {

            event.preventDefault();

            translateText();
        }
    }
);


// Initialize
populateLanguages();
updateCharacterCount();