const express = require("express");
const cors = require("cors");
const axios = require("axios");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const AZURE_TRANSLATOR_KEY = process.env.AZURE_TRANSLATOR_KEY;
const AZURE_TRANSLATOR_ENDPOINT =
    process.env.AZURE_TRANSLATOR_ENDPOINT;
const AZURE_TRANSLATOR_REGION =
    process.env.AZURE_TRANSLATOR_REGION;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Serve frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

// Supported languages
const languages = [
    { code: "auto", name: "Detect Language" },
    { code: "en", name: "English" },
    { code: "te", name: "Telugu" },
    { code: "hi", name: "Hindi" },
    { code: "ta", name: "Tamil" },
    { code: "kn", name: "Kannada" },
    { code: "ml", name: "Malayalam" },
    { code: "bn", name: "Bengali" },
    { code: "mr", name: "Marathi" },
    { code: "gu", name: "Gujarati" },
    { code: "pa", name: "Punjabi" },
    { code: "ur", name: "Urdu" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "es", name: "Spanish" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "zh-Hans", name: "Chinese (Simplified)" },
    { code: "ar", name: "Arabic" },
    { code: "tr", name: "Turkish" },
    { code: "nl", name: "Dutch" },
    { code: "sv", name: "Swedish" },
    { code: "pl", name: "Polish" },
    { code: "uk", name: "Ukrainian" },
    { code: "vi", name: "Vietnamese" },
    { code: "id", name: "Indonesian" }
];

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Language Translation API is running"
    });
});

// Get supported languages
app.get("/api/languages", (req, res) => {
    res.json({
        success: true,
        languages
    });
});

// Translation API
app.post("/api/translate", async (req, res) => {
    try {
        const { text, source, target } = req.body;

        // Validate input
        if (!text || !text.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please enter some text to translate."
            });
        }

        if (!target || target === "auto") {
            return res.status(400).json({
                success: false,
                message: "Please select a target language."
            });
        }

        if (!AZURE_TRANSLATOR_KEY) {
            return res.status(500).json({
                success: false,
                message: "Azure Translator API key is missing."
            });
        }

        if (!AZURE_TRANSLATOR_ENDPOINT) {
            return res.status(500).json({
                success: false,
                message: "Azure Translator endpoint is missing."
            });
        }

        // Remove trailing slash from endpoint
        const endpoint = AZURE_TRANSLATOR_ENDPOINT.replace(/\/+$/, "");

        // Build Azure Translator URL
        let translateUrl =
            `${endpoint}/translate?api-version=3.0&to=${encodeURIComponent(target)}`;

        // If source is not auto, specify source language
        if (source && source !== "auto") {
            translateUrl += `&from=${encodeURIComponent(source)}`;
        }

        const headers = {
            "Ocp-Apim-Subscription-Key": AZURE_TRANSLATOR_KEY,
            "Content-Type": "application/json"
        };

        // Global resources don't require the region header.
        // For regional/multi-service resources, send it.
        if (
            AZURE_TRANSLATOR_REGION &&
            AZURE_TRANSLATOR_REGION.toLowerCase() !== "global"
        ) {
            headers["Ocp-Apim-Subscription-Region"] =
                AZURE_TRANSLATOR_REGION;
        }

        const response = await axios.post(
            translateUrl,
            [
                {
                    text: text.trim()
                }
            ],
            {
                headers,
                timeout: 30000
            }
        );

        const result = response.data;

        if (
            !result ||
            !result[0] ||
            !result[0].translations ||
            !result[0].translations[0]
        ) {
            return res.status(500).json({
                success: false,
                message: "Invalid response received from Microsoft Translator."
            });
        }

        const translatedText =
            result[0].translations[0].text;

        const detectedLanguage =
            result[0].detectedLanguage?.language || source || null;

        res.json({
            success: true,
            translatedText,
            detectedLanguage
        });

    } catch (error) {
        console.error("Translation error:");

        if (error.response) {
            console.error(
                "Status:",
                error.response.status
            );

            console.error(
                "Response:",
                error.response.data
            );

            return res.status(error.response.status).json({
                success: false,
                message:
                    error.response.data?.error?.message ||
                    "Microsoft Translator API request failed."
            });
        }

        console.error(error.message);

        res.status(500).json({
            success: false,
            message:
                "Unable to connect to Microsoft Translator."
        });
    }
});

// Send frontend for unknown routes
app.get("*", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../frontend/index.html")
    );
});

// Start server
app.listen(PORT, () => {
    console.log("======================================");
    console.log(" Language Translation Tool");
    console.log("======================================");
    console.log(`Server running at: http://localhost:${PORT}`);
    console.log("Microsoft Translator API connected");
    console.log("======================================");
});