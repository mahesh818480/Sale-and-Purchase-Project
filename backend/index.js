const express = require('express');
const app = express();
const axios = require('axios');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const http = require('http');
const server = http.Server(app);

const port = process.env.PORT || 3000;

// UltraMsg ID & Token instance140872
const INSTANCE_ID = 'instance140872';
const TOKEN = 'walu974tbd2uz8h1';
//walu974tbd2uz8h1

// ✅ Middleware
app.use(cors({
  origin: '*', // Dev purpose only. Use specific origin in production.
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json({ limit: '10mb' }));

// ✅ MongoDB URI
const uri = 'mongodb+srv://Mahesh:Mahesh123@cluster0.eqme0jn.mongodb.net/';
const client = new MongoClient(uri);

// ✅ Connect MongoDB
async function connectMongo() {
  try {
    await client.connect();
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err);
  }
}

// ✅ Register - GET
app.get('/api/register', async (req, res) => {
  try {
    const db = client.db("registerData");
    const collection = db.collection('registerDataCollection');
    const result = await collection.find({}).toArray();
    res.json(result);
  } catch (error) {
    console.error("GET /api/register error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Register - POST
app.post('/api/update/register', async (req, res) => {
  try {
    const db = client.db("registerData");
    const collection = db.collection('registerDataCollection');

    const existing = await collection.findOne({ Email: req.body.Email });

    if (existing) {
      res.json({ valid: false });
    } else {
      await collection.insertOne(req.body);
      console.log("1 document inserted");
      res.json({ valid: true });
    }
  } catch (error) {
    console.error("POST /api/update/register error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ House - GET
app.get('/api/house', async (req, res) => {
  try {
    const db = client.db("HouseData");
    const collection = db.collection('HouseDbCollection');
    const result = await collection.find({}).toArray();
    res.json(result);
  } catch (error) {
    console.error("GET /api/house error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ House - POST
app.post('/api/update/house', async (req, res) => {
  try {
    const db = client.db("HouseData");
    const collection = db.collection('HouseDbCollection');

    await collection.insertOne(req.body);
    console.log("1 document inserted");
    res.json({ valid: true });
  } catch (error) {
    console.error("POST /api/update/house error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Favorite Data Update
app.post('/api/update/favdata', async (req, res) => {
  try {
    const db = client.db("HouseData");
    const collection = db.collection('HouseDbCollection');

    await collection.updateOne(
      { username: req.body.username },
      { $set: { selectFav: req.body.selectFav } }
    );

    res.json({ valid: true });
  } catch (error) {
    console.error("POST /api/update/favdata error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Nodemailer - Send OTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'gmahesh8184@gmail.com',
    pass: 'qksb iptf hckm plgp',
  },
});

app.post('/send-otp', (req, res) => {
  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  const mailOptions = {
    from: 'gmahesh8184@gmail.com',
    to:req.body.to,
    subject: 'Your OTP',
    text: `Your OTP is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("OTP send error:", error);
      res.status(500).json({ success: false, message: 'Failed to send OTP', OTP: 'Otp not sent' });
    } else {
      console.log(`OTP sent: ${otp}`);
      console.log(mailOptions,'otp:::')
      res.json({ success: true, message: 'OTP sent successfully', OTP: `${otp}` });
    }
  });
});

// send wtsup Message
app.post('send-whatsapp', async (req, res) => {
  const { to, message } = req.body;
console.log(req.body,'156:::')
  try {
    const response = await axios.post(`https://api.ultramsg.com/${INSTANCE_ID}/messages/chat`, {
      token: TOKEN,
      to: to,
      body: message,
    });

    res.send({ success: true, data: response.data });
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
});

// ✅ Start Server
(async () => {
  try {
    await connectMongo();
    server.listen(port, () => {
      console.log(`Server started on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
})();
