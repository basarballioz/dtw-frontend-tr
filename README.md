# Decathlon AI-Powered Sports Search Platform

A modern, AI-driven web application for exploring sports products, analyzing user reviews, and chatting about the world of sports. Built with Next.js, React, and Tailwind CSS, this project delivers a seamless, intelligent search and recommendation experience for sports enthusiasts.

---

## 🚀 Features

- **AI-Powered Product Search:**
  - Find sports products using advanced AI recommendations.
  - Switch between classic and AI search modes for flexibility.
- **Sports Chatbot:**
  - Chat with an AI agent about sports, equipment, and recommendations.
  - Get personalized advice and answers instantly.
- **Product Review Analysis:**
  - Enter a product SKU to analyze user reviews and receive a sentiment summary.
  - Fast, concise insights into product satisfaction.
- **Category Navigation:**
  - Browse by popular sports categories (Running, Football, Tennis, Swimming, Cycling, etc.).
- **Responsive UI:**
  - Clean, mobile-friendly design with reusable UI components.

---

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/basarballioz/dtw-frontend-tr
   cd your-repo
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. **Open in your browser:**
   Visit [http://localhost:3000](http://localhost:3000)

---

## 🧑‍💻 Usage

- **AI Product Search:**
  - Use the search bar on the homepage to find products by name, brand, or sport.
  - Toggle between classic and AI search for different experiences.
- **Chat About Sports:**
  - Go to `/ai-search` to ask the AI anything about sports, equipment, or training.
- **Review Analysis:**
  - Visit `/fast-results` and enter a product SKU to get a quick sentiment analysis of user reviews.
- **Example Queries:**
  - "I want to start running at home"
  - "Best football equipment"
  - "What do I need for camping?"

---

## 🗂️ Project Structure

```
app/
  components/         # Header, Navigation, FeatureCards, etc.
  ai-search/          # AI chat page
  fast-results/       # Product review analysis page
  search/             # Product search page
  data/constants.js   # Categories, example queries, mock products
src/
  components/ui/      # Reusable UI elements (Button, Badge, Input)
  lib/utils.js        # Utility functions
public/               # Static assets (SVGs, images)
```

---

## 🛠️ Technologies Used

- [Next.js 15](https://nextjs.org/)
- [React 19](https://react.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide React Icons](https://lucide.dev/)
- [Axios](https://axios-http.com/)

---

## 🤖 AI & API Integration

- **AI Agent Endpoint:** 
  - I used a custom GEMINI AI agent for API requests, but you can replace it with your own AI service if desired.
  - The app communicates with an external AI agent via:
    ```
    POST https://my-ai-agent-243439967412.europe-west1.run.app/ask 
    Content-Type: application/json
    Body: { "query": "your-question-here" }
    ```
  - Used for both chat and review analysis features.

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## 🙏 Credits

- Inspired by Decathlon and the sports community.
- Built with ❤️ using Next.js, React, and Tailwind CSS.
