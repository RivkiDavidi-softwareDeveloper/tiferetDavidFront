const express = require('express');
const path = require('path');
const app = express();

// שים את שם התיקייה בתוך dist במקום PROJECT_NAME
app.use(express.static(path.join(__dirname, 'dist/PROJECT_NAME')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/PROJECT_NAME/index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
