// Simple test endpoint
module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ message: 'Hello World!', method: req.method });
};
