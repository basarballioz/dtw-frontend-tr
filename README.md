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

- **API Architecture:** The application uses a client-server model for AI-powered features.
  - **Client-Side:** The `askGemini` function in `src/lib/api.js` sends requests from the user's browser to our own backend.
  - **Server-Side:** A Next.js API route at `app/api/ask-gemini/route.js` receives these requests. This route acts as a secure proxy, forwarding the request to the Google Gemini API using a private API key stored in environment variables.

- **How it Works:**
  1. A user action on the frontend (e.g., submitting a search query) calls the `askGemini` function.
  2. `askGemini` makes a `POST` request to the `/api/ask-gemini` endpoint within the application.
  3. The API route on the server receives the request, attaches the `GEMINI_API_KEY`, and sends it to the official Google Gemini API.
  4. The response from Gemini is streamed back to the client, ensuring the API key is never exposed to the public.

- **To use the AI features, you need to:**
  1. Get a Google Gemini API key.
  2. Create a `.env.local` file in the root of the project.
  3. Add your API key to the file like this:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```

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
