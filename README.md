# AI Image Generator 🎨

A modern web application that generates high-quality images using OpenAI's DALL-E 3 API. Built with Next.js 14, TypeScript, and Tailwind CSS.

![AI Image Generator Demo](public/demo.gif)

## Features ✨

- **Multiple Image Generation**: Generates 4 unique variations for each prompt
- **Customizable Image Settings**:
  - Size options (1024x1024, 1792x1024, 1024x1792)
  - Quality settings (standard/HD)
  - Style options (vivid/natural)
- **Smart Preset System**:
  - Art styles (Synthwave, Anime, Photorealistic, Digital Art, etc.)
  - Quality presets
  - Lighting options
  - Perspective choices
- **Modern UI/UX**:
  - Responsive design
  - Real-time loading states
  - Error handling
  - Image preview

## Tech Stack 🛠️

- **Frontend**:
  - Next.js 14
  - TypeScript
  - Tailwind CSS
  - React Hooks
- **Backend**:
  - Next.js API Routes
  - OpenAI API (DALL-E 3)
- **Development**:
  - ESLint
  - Prettier
  - PostCSS

## Getting Started 🚀

### Prerequisites

- Node.js 18+ installed
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/christopherpturney/ai-image-generator.git
cd ai-image-generator
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage 💡

1. Enter your image prompt in the text field
2. (Optional) Select presets to enhance your prompt:
   - Choose an art style
   - Select quality preset
   - Pick lighting option
   - Choose perspective
3. Click "Generate Images"
4. View and download your generated images

## Security 🔒

- API keys are securely stored in environment variables
- All API calls are made server-side
- No sensitive data is exposed to the client

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📝

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 🙏

- Built with OpenAI's DALL-E 3
- Inspired by the creative AI community