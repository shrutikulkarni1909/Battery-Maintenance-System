// =============================================
// PowerTrack Pro – Server (MongoDB Atlas)
// =============================================

const http       = require('http');
const fs         = require('fs');
const path       = require('path');
const url        = require('url');
const { MongoClient } = require('mongodb');

const PORT       = process.env.PORT || 3000;
const MONGO_URI  = process.env.MONGO_URI; // set in Railway environment variables

if (!MONGO_URI) {
  console.error('');
  console.error('  ERROR: MONGO_URI environment variable is not set.');
  console.error('  Please add it in Railway > your project > Variables.');
  console.error('');
  process.exit(1);
}

// ---- MongoDB setup ----
let db;
const client = new MongoClient(MONGO_URI);

async function connectDB() {
  await client.connect();
  db = client.db('powertrack');
  console.log('  ✅ Connected to MongoDB Atlas');
}

function collection() {
  return db.collection('appdata');
}

// ---- Static file serving ----
const MIME = {
  '.html': 'text/html',
  '.js':   'text/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
};

function serveStatic(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    const ext  = path.extname(filePath).toLowerCase();
    const mime = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });
}

// ---- HTTP Server ----
const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  const parsed   = url.parse(req.url, true);
  const pathname = parsed.pathname;

  // --- GET /api/data ---
  if (req.method === 'GET' && pathname === '/api/data') {
    try {
      const doc = await collection().findOne({ _id: 'main' });
      if (doc) {
        const { _id, ...data } = doc;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'No data yet' }));
      }
    } catch(e) {
      console.error('GET /api/data error:', e.message);
      res.writeHead(500); res.end('Server error');
    }
    return;
  }

  // --- POST /api/data ---
  if (req.method === 'POST' && pathname === '/api/data') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body);
        await collection().replaceOne(
          { _id: 'main' },
          { _id: 'main', ...payload },
          { upsert: true }
        );
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      } catch(e) {
        console.error('POST /api/data error:', e.message);
        res.writeHead(400); res.end('Invalid data');
      }
    });
    return;
  }

  // --- Static files ---
  let filePath;
  if (pathname === '/' || pathname === '/index.html') {
    filePath = path.join(__dirname, 'index.html');
  } else {
    filePath = path.join(__dirname, pathname);
  }

  const safeBase = path.resolve(__dirname);
  const safeFile = path.resolve(filePath);
  if (!safeFile.startsWith(safeBase)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }

  serveStatic(res, filePath);
});

// ---- Boot ----
connectDB().then(() => {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`  🚀 PowerTrack Pro running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err.message);
  process.exit(1);
});
