# nomore.dev

A personal portfolio website showcasing music, writing, code, and cover songs.

## 📁 Project Structure

```
.
├── index.html              # Home page
├── music.html              # Music section
├── covers.html             # Covers collection
├── code.html               # Code projects
├── writing.html            # Writing collection
├── css/                    # Stylesheets
│   ├── main.css           # Global styles
│   ├── index.css          # Home page styles
│   ├── music.css          # Music page styles
│   ├── covers.css         # Covers page styles
│   ├── code.css           # Code page styles
│   └── writing.css        # Writing page styles
├── js/                    # JavaScript files
│   ├── main.js
│   ├── covers.js
│   └── script.js
├── images/                # Images & icons
├── audios/                # Audio files
├── package.json           # Project metadata & scripts
├── vercel.json            # Vercel deployment config
└── README.md              # This file
```

## 🚀 Getting Started

### Local Development
```bash
# Start a local development server
npm run dev
```

### Build & Deploy
```bash
npm run build
```

The project is configured for automatic deployment on [Vercel](https://vercel.com).

## 📝 Content Sections

- **Home** - Introduction and overview
- **Music** - Personal music story and performances
- **Covers** - Collection of cover songs
- **Code** - Software projects and code samples
- **Writing** - Blog posts and written pieces

## 🔧 Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- Static site (no backend)

## 📦 Deployment

This site is deployed on Vercel. Configuration is in `vercel.json`:
- All HTML files are served as static content
- Routes handle file serving correctly

To deploy:
1. Push to GitHub
2. Connect repository to Vercel
3. Vercel automatically builds and deploys on push

## 📄 License

MIT License - feel free to use this as a template!
