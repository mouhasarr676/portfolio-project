import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import profileRoutes from './routes/profile.routes.js';
import skillsRoutes from './routes/skills.routes.js';
import projectsRoutes from './routes/projects.routes.js';
import certificationsRoutes from './routes/certifications.routes.js';
import experiencesRoutes from './routes/experiences.routes.js';
import educationRoutes from './routes/education.routes.js';
import socialLinksRoutes from './routes/socialLinks.routes.js';
import messagesRoutes from './routes/messages.routes.js';
import cvRoutes from './routes/cv.routes.js';
import languagesRoutes from './routes/languages.routes.js';

dotenv.config();

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API du portfolio opérationnelle' });
});

// Routes métier
app.use('/api/profile', profileRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/certifications', certificationsRoutes);
app.use('/api/experiences', experiencesRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/social-links', socialLinksRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/languages', languagesRoutes);
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Erreur interne du serveur',
  });
});

export default app;