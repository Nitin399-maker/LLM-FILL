# 🧠 LLM Word Predictor

> **This is a demo. It contains no confidential data/IP.**

An interactive web-based application to explore how **Language Models (LLMs)** predict missing words in sentences.  
Users can enter a sentence, select a word to blank out, and let the chosen LLM predict the most likely word(s) to fill in.  
The app also visualizes token probabilities in a structured table for deeper insights.

---

## 🚀 Features

- **Model Playground** – Select from multiple OpenAI/LLM models via OpenRouter.
- **Interactive Sentence Editing** – Click any word in the sentence to blank it out (`____`) and trigger predictions.
- **Top Predictions Table** – View the top 20 model predictions with probability scores.
- **API Key Support** – Securely enter your **OpenRouter API Key** to authenticate.
- **Responsive UI** – Built with **Bootstrap 5** and **Bootstrap Icons** for a modern, mobile-friendly experience.

---

## 🗂️ Project Structure

```
LLM-FILL/
├── index.html    # Main application UI (Bootstrap 5)
├── scripts.js    # Core logic: tokenization, API calls, rendering
└── README.md     # Project documentation
```

---

## ⚡ How It Works

```mermaid
flowchart TD
    A[User enters sentence] --> B[Click Process button]
    B --> C[Tokenize sentence into words]
    C --> D[Render interactive sentence as buttons]

    D -->|User clicks token| E[Replace token with ____]
    E --> F[Send modified sentence to OpenRouter API]
    F --> G[Model predicts top tokens + logprobs]
    G --> H[Process response JSON]
    H --> I[Visualize top 20 tokens in probability table]

    I --> J{User interaction}
    J -->|Click another token| E
    J -->|Reset blank| D
```

1. Enter a sentence in the input box.
2. Click **Process** to tokenize the sentence.
3. Click on any token (word) to blank it out (`____`).
4. The app sends the modified sentence to the selected **LLM model** via OpenRouter API.
5. The model predicts the most likely token(s) to fill the blank.
6. A **probability table** shows the top predictions with their likelihoods.

---

## 🛠️ Setup & Usage

### 1. Clone the repository
```bash
git clone https://github.com/Nitin399-maker/LLM-FILL.git
cd LLM-FILL
```

### 2. Open in browser

Open `index.html` directly in any modern browser — no build step or server required.

### 3. Configure

- Enter your **OpenRouter API Key** in the key field.
- Select an **LLM model** (GPT-4.1 Nano, Mini, or Full).
- Type a sentence, click **Process**, then click any word to see predictions.

---

## 🔑 API

This app uses the [OpenRouter API](https://openrouter.ai/) to access OpenAI models with `logprobs` support. You will need a valid OpenRouter API key to use the prediction feature.

---

## 🧰 Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 / CSS3 | Structure & styling |
| JavaScript (Vanilla) | Application logic |
| Bootstrap 5 | Responsive UI components |
| Bootstrap Icons | Icon set |
| OpenRouter API | LLM inference with logprobs |

---

## ⚠️ Disclaimer

This is a demo. It contains no confidential data/IP.
