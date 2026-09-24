# 🌐 LinguaTranslate - Language Translation Tool

LinguaTranslate is a web-based language translation application that allows users to translate text between multiple languages using the **Microsoft Azure Translator API**.

The application provides a simple and responsive interface where users can enter text, select source and target languages, translate the text instantly, copy the result, and listen to the translated text using text-to-speech.

## 🚀 Features

- 🌍 Translate text between multiple languages
- 🔄 Swap source and target languages
- 🤖 Microsoft Azure Translator API integration
- 🔍 Source language detection
- 📋 Copy translated text
- 🔊 Text-to-speech for translated text
- 🔢 Character counter
- ⚡ Fast translation
- 📱 Responsive user interface
- ⌨️ `Ctrl + Enter` shortcut for translation
- 🔐 API key stored securely using environment variables

## 🛠️ Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Node.js
- Express.js
- Axios
- dotenv
- CORS

### API

- Microsoft Azure Translator

## 📁 Project Structure

```text
Language-Translation-Tool/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   └── .env.example
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── .gitignore
└── README.md