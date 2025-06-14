import React, { useState } from 'react';
import './styles.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setGeneratedImage('');
  };

  const handleGenerate = async () => {
    if (!selectedFile || !prompt) return;

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = async () => {
      const base64String = reader.result.split(',')[1];
      setLoading(true);

      try {
        const response = await fetch('http://localhost:5000/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64String, prompt }),
        });

        const data = await response.json();

        if (!response.ok || data.error) {
          alert(data.error || "Something went wrong.");
        } else {
          setGeneratedImage(data.url);
        }

      } catch (error) {
        alert('Server error. Please try again later.');
      }

      setLoading(false);
    };
  };

  return (
    <div className="container">
      <h1>✨ Interior Design Visualizer ✨</h1>

      <input type="file" accept="image/*" onChange={handleFileChange} />
      <input
        type="text"
        placeholder="Enter design idea (e.g., add bed)"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <br />
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Designing...' : 'Generate Design'}
      </button>

      {selectedFile && (
        <div className="preview">
          <h3>Original Room</h3>
          <img src={URL.createObjectURL(selectedFile)} alt="Original" />
        </div>
      )}

      {generatedImage && (
        <div className="preview">
          <h3>Designed Room</h3>
          <img src={generatedImage} alt="Generated Design" />
        </div>
      )}
    </div>
  );
}

export default App;
