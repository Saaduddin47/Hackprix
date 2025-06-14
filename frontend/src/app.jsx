import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [style, setStyle] = useState("modern");
  const [generatedImg, setGeneratedImg] = useState("");

  const convertToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = (error) => reject(error);
  });

  const handleGenerate = async () => {
    if (!selectedFile) return;

    const base64 = await convertToBase64(selectedFile);
    const res = await axios.post("http://localhost:5000/generate", {
      image: base64,
      style: style
    });

    if (res.data.image) {
      setGeneratedImg(`data:image/png;base64,${res.data.image}`);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100 text-center">
      <h1 className="text-3xl font-bold mb-4">Interior Design Visualizer</h1>
      <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
      <select value={style} onChange={(e) => setStyle(e.target.value)} className="ml-4 p-1 border rounded">
        <option value="modern">Modern</option>
        <option value="boho">Boho</option>
        <option value="minimal">Minimal</option>
        <option value="futuristic">Futuristic</option>
      </select>
      <button onClick={handleGenerate} className="ml-4 bg-blue-500 text-white px-4 py-2 rounded">
        Generate
      </button>
      {generatedImg && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Generated Design:</h2>
          <img src={generatedImg} alt="Design" className="mt-2 max-w-md mx-auto" />
        </div>
      )}
    </div>
  );
}

export default App;