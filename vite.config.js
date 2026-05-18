import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import fs from 'fs'

const getHtmlEntries = () => {
  const entries = {};
  
  // Add all HTML files in the root folder
  const rootFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.html'));
  rootFiles.forEach(file => {
    const name = file.replace('.html', '');
    entries[name] = resolve(__dirname, file);
  });

  // Add all sdg-X folders' index.html
  for (let i = 1; i <= 17; i++) {
    const folder = `sdg-${i}`;
    const indexPath = resolve(__dirname, folder, 'index.html');
    if (fs.existsSync(indexPath)) {
      entries[folder] = indexPath;
    }
  }
  return entries;
};

// Automatically determine the base path for GitHub Pages
// GITHUB_REPOSITORY is automatically set by GitHub Actions (e.g., 'username/repo-name')
const getBasePath = () => {
  if (process.env.GITHUB_REPOSITORY) {
    const repoName = process.env.GITHUB_REPOSITORY.split('/')[1];
    return `/${repoName}/`;
  }
  return '/'; // Fallback for local testing or custom domains
};

// https://vite.dev/config/
export default defineConfig({
  base: getBasePath(),
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: getHtmlEntries()
    }
  }
})
