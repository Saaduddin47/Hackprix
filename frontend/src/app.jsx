import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [generatedImg, setGeneratedImg] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const convertToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]); // Remove data:image/png;base64,
    reader.onerror = (error) => reject(error);
  });

  const handleGenerate = async () => {
    setError("");
    if (!selectedFile) {
      setError("Please select a PNG image first.");
      return;
    }

    // Check if file is PNG
    if (selectedFile.type !== "image/png") {
      setError("Only PNG files are supported by OpenAI for variations.");
      return;
    }

    try {
      setLoading(true);
      const base64 = await convertToBase64(selectedFile);

      const res = await axios.post("http://localhost:5000/generate", {
        image: base64
      });

      if (res.data.generated_image) {
        setGeneratedImg(res.data.generated_image);
      } else {
        setError("No image returned from API.");
      }
    } catch (err) {
      setError("Error generating image. Check if your backend is running and key is valid.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100 text-center">
      <h1 className="text-3xl font-bold mb-4">Interior Design Visualizer</h1>

      <input
        type="file"
        accept="image/png"
        onChange={(e) => setSelectedFile(e.target.files[0])}
        className="mb-4"
      />
      
      <button
        onClick={handleGenerate}
        className="ml-4 bg-blue-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Design"}
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {generatedImg && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Generated Design:</h2>
          <img
            src={generatedImg}
            alt="Redesigned Room"
            className="mt-2 max-w-md mx-auto rounded shadow-md"
          />
        </div>
      )}
    </div>
  );
}

export default App;
