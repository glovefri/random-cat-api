const express = require('express');
const app = express();

// Usar The Cat API (gratis, no requiere API key para uso básico)
const getRandomCatImage = async () => {
  try {
    const response = await fetch('https://api.thecatapi.com/v1/images/search');
    const data = await response.json();
    return data[0].url;
  } catch (error) {
    // Fallback a cataas.com si falla
    return 'https://cataas.com/cat?' + Date.now();
  }
};

// HTML simple para mostrar la imagen
const getHTML = (imageUrl) => `
<!DOCTYPE html>
<html>
<head>
  <title>Random Cat Image</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .container {
      background: white;
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      text-align: center;
      max-width: 600px;
    }
    h1 {
      color: #333;
      margin-bottom: 1.5rem;
    }
    img {
      max-width: 100%;
      max-height: 500px;
      border-radius: 10px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
      margin-bottom: 1.5rem;
    }
    button {
      background: #667eea;
      color: white;
      border: none;
      padding: 12px 30px;
      font-size: 16px;
      border-radius: 25px;
      cursor: pointer;
      transition: all 0.3s;
    }
    button:hover {
      background: #764ba2;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }
    .info {
      margin-top: 1rem;
      color: #666;
      font-size: 14px;
    }
    code {
      background: #f4f4f4;
      padding: 2px 6px;
      border-radius: 3px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🐱 Random Cat Image EDITED</h1>
    <img src="${imageUrl}" alt="Random cute cat" onerror="this.src='https://cataas.com/cat?${Date.now()}'">
    <br>
    <button onclick="location.reload()">Get Another Cat!</button>
    <div class="info">
      <p>API Endpoints:</p>
      <p><code>GET /</code> - This page</p>
      <p><code>GET /api/cat</code> - JSON with image URL</p>
      <p><code>GET /api/cat/image</code> - Direct image redirect</p>
    </div>
  </div>
</body>
</html>
`;

// Ruta principal - Muestra la imagen en HTML
app.get('/', async (req, res) => {
  const imageUrl = await getRandomCatImage();
  res.send(getHTML(imageUrl));
});

// Ruta API - Devuelve JSON con la URL de la imagen
app.get('/api/cat', async (req, res) => {
  const imageUrl = await getRandomCatImage();
  res.json({
    success: true,
    message: "Here's a random cat for you!",
    image_url: imageUrl,
    timestamp: new Date().toISOString()
  });
});

// Ruta que redirige directamente a la imagen
app.get('/api/cat/image', async (req, res) => {
  const imageUrl = await getRandomCatImage();
  res.redirect(imageUrl);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'cat-image-api' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🐱 Cat Image API running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to see random cat images!`);
});
