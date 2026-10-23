import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { IngestionEngine } from './services/IngestionEngine.js';
import { createApiRouter } from './routes/api.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import { ExportEngine } from './services/ExportEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root paths relative to server file
const rootDir = path.resolve(__dirname, '../../');
const initialDataPath = path.resolve(rootDir, 'candidate/data/01_initial.json');
const updateDataPath = path.resolve(rootDir, 'candidate/data/02_update.json');
const exportDir = path.resolve(rootDir, 'exports');
const storePersistencePath = path.resolve(rootDir, 'server/store.json');
const clientDistDir = path.resolve(rootDir, 'client/dist');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Initialize ingestion engine
const engine = new IngestionEngine(storePersistencePath);

// Seed on startup if store is empty
const loaded = engine.loadPersistence();
if (!loaded || engine.count() === 0) {
  console.log('[Startup] Loading default initial batch (01_initial.json)...');
  if (fs.existsSync(initialDataPath)) {
    const raw = fs.readFileSync(initialDataPath, 'utf8');
    const initBatch = JSON.parse(raw);
    engine.ingestBatch(initBatch);
    console.log(`[Startup] Seeded ${engine.count()} records from initial batch.`);
  }
}

// Ensure initial export exists
const exporter = new ExportEngine(exportDir);
exporter.generateExport(engine.getAll());

// Mount API routes
app.use('/api', createApiRouter(engine, initialDataPath, updateDataPath, exportDir));

// Serve client in production
if (fs.existsSync(clientDistDir)) {
  console.log(`[Startup] Serving client build from ${clientDistDir}`);
  app.use(express.static(clientDistDir));
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.resolve(clientDistDir, 'index.html'));
  });
}

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`SpendNest Revenue Intelligence Engine running on http://localhost:${port}`);
    console.log(`API available at http://localhost:${port}/api/records`);
  });
}

export { app, engine };
