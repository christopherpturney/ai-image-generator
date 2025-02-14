"use client";

import { useState } from "react";

const PROMPT_PRESETS = {
  artStyle: [
    { label: "Select art style", value: "" },
    { label: "Synthwave", value: ", synthwave style, retro-futuristic, neon colors, grid perspective, dark background with glowing elements, 80s aesthetic, cyberpunk" },
    { label: "Anime", value: ", anime style, Studio Ghibli inspired" },
    { label: "Photorealistic", value: ", photorealistic, highly detailed, 8K resolution" },
    { label: "Digital Art", value: ", digital art, concept art, trending on artstation" },
    { label: "Pixel Art", value: ", pixel art style, retro gaming aesthetic" },
    { label: "Oil Painting", value: ", oil painting, textured brushstrokes, canvas" },
    { label: "Watercolor", value: ", watercolor painting, soft edges, flowing colors" },
    { label: "3D Render", value: ", 3D render, octane render, cinema 4D" },
    { label: "Pencil Sketch", value: ", pencil sketch, detailed shading, graphite" },
  ],
  quality: [
    { label: "Select quality", value: "" },
    { label: "Highly Detailed", value: ", intricate details, high definition, sharp" },
    { label: "Minimalist", value: ", minimalist style, clean lines, simple" },
    { label: "Artistic", value: ", artistic composition, creative interpretation" },
    { label: "Professional", value: ", professional quality, perfect composition" },
  ],
  lighting: [
    { label: "Select lighting", value: "" },
    { label: "Bright", value: ", bright lighting, well-lit, vibrant" },
    { label: "Dark", value: ", dark atmosphere, moody lighting, shadows" },
    { label: "Sunset", value: ", sunset lighting, golden hour, warm colors" },
    { label: "Studio", value: ", studio lighting, professional photography" },
  ],
  perspective: [
    { label: "Select view", value: "" },
    { label: "Close-up", value: ", close-up shot, detailed view" },
    { label: "Wide Shot", value: ", wide angle, full scene view" },
    { label: "Aerial View", value: ", aerial perspective, bird's eye view" },
    { label: "Portrait", value: ", portrait view, front facing" },
  ],
};

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [presets, setPresets] = useState({
    artStyle: "",
    quality: "",
    lighting: "",
    perspective: "",
  });

  // Fix TypeScript error in handleMouseMove
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const tooltip = e.currentTarget.querySelector('::before') as HTMLElement;
    if (tooltip) {
      const x = e.clientX;
      const y = e.clientY;
      tooltip.style.left = `${x}px`;
      tooltip.style.top = `${y}px`;
    }
  };

  const handlePresetChange = (category: string, value: string) => {
    setPresets(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const getFinalPrompt = () => {
    let finalPrompt = prompt;
    Object.values(presets).forEach(preset => {
      if (preset) finalPrompt += preset;
    });
    return finalPrompt;
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch("/api/openai/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: getFinalPrompt()
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate images");
      }

      const data = await response.json();
      setImages(data.output);
    } catch (err) {
      setError((err as Error).message);
      console.error("Error generating images:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading image:", err);
    }
  };

  return (
    <>
      <main className="min-h-screen p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 neon-text">
            Image Generator
          </h1>
          <p className="text-purple-200">
            Transform what you imagine into a masterpiece!
          </p>
        </div>

        {/* Prompt Input and Settings */}
        <form onSubmit={handleGenerate} className="mb-12">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A cyberpunk city at night with neon signs..."
              className="w-full sm:flex-1 p-4 rounded-lg synthwave-input focus:outline-none"
            />
            <button
              type="submit"
              disabled={isGenerating || !prompt}
              className="relative px-8 py-4 rounded-lg font-medium synthwave-button group"
              data-tooltip={!prompt && !isGenerating ? "✨ Type in what you'd like to create" : ""}
              onMouseMove={handleMouseMove}
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                  Generating...
                </div>
              ) : (
                'Generate Images'
              )}
            </button>
          </div>

          {/* Preset Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.entries(PROMPT_PRESETS).map(([category, options]) => (
              <div key={category}>
                <label className="block text-sm font-medium text-purple-200 mb-2 capitalize">
                  {category === 'artStyle' ? 'Art Style' : category}
                </label>
                <div className="relative">
                  <select
                    value={presets[category as keyof typeof presets]}
                    onChange={(e) => handlePresetChange(category, e.target.value)}
                    className="w-full appearance-none rounded-lg synthwave-select pl-3 pr-10 py-2.5 focus:outline-none"
                  >
                    {options.map((option) => (
                      <option key={option.label} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-cyan-300">
                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {/* Image Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Generated image ${index + 1}`}
                  className="w-full rounded-lg synthwave-image"
                />
                <button 
                  onClick={() => setSelectedImage(image)}
                  className="absolute bottom-4 right-4 px-4 py-2 rounded-lg synthwave-button opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Choose This Image
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="relative bg-purple-900/50 rounded-xl max-w-4xl w-full p-4 border border-purple-500/50">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-purple-200 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="aspect-square overflow-hidden rounded-lg synthwave-image">
              <img
                src={selectedImage}
                alt="Selected generated image"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-4 flex justify-end gap-4">
              <button
                onClick={() => setSelectedImage(null)}
                className="px-4 py-2 rounded-lg border border-purple-500/50 hover:border-purple-400/50 text-purple-200 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDownload(selectedImage);
                  setSelectedImage(null);
                }}
                className="px-4 py-2 rounded-lg synthwave-button"
              >
                Download Image
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
