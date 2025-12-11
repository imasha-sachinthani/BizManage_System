import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`✅ Test server running on port ${PORT}`);
});