# Birthday React Experience

An interactive birthday celebration website built with React and Vite. The experience guides visitors through animated surprises, memories, gifts, a balloon game, a cake interaction, a secret envelope, and a final celebration screen.

## Features

- Animated opening and name reveal
- Photo memory gallery with slideshow controls
- Interactive gift boxes with surprise messages
- Balloon-popping mini game
- Clickable birthday cake interaction
- Responsive secret-message envelope
- Confetti effects powered by `canvas-confetti`
- GSAP-powered animations
- Background music and sound effects
- Responsive layout for desktop and mobile screens

## Requirements

- Node.js 18 or newer
- npm

## Getting Started

Install the project dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL shown by Vite, usually:

```text
http://localhost:5173
```

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |

## Customization

The displayed name is configured in [`src/App.jsx`](src/App.jsx):

```jsx
const PERSON_NAME = 'Special';
```

Change this value to personalize the name used throughout the experience.

### Photos

Update the photo list in [`src/components/PhotoGallerySection.jsx`](src/components/PhotoGallerySection.jsx). Place matching image files in the `public/images/` directory or update the image paths to match your assets.

### Music

Background music and sound effects are referenced by the sound provider and public media files. Keep audio files in `public/music/` and update the relevant paths if you replace them.

### Messages and interactions

The main experience sections are located in `src/components/`:

- `OpeningSection.jsx`
- `NameRevealSection.jsx`
- `PhotoGallerySection.jsx`
- `GiftsSection.jsx`
- `MiniGameSection.jsx`
- `CakeSection.jsx`
- `EnvelopeSection.jsx`
- `FinaleSection.jsx`

Shared styling is in [`src/index.css`](src/index.css), and reusable confetti behavior is in `src/utils/`.

## Project Structure

```text
.
├── public/
│   ├── images/
│   └── music/
├── src/
│   ├── components/
│   ├── context/
│   ├── utils/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## Production Build

Build the application with:

```bash
npm run build
```

To serve the generated build locally:

```bash
npm run preview
```
