## File Structure

```
react-image-slider-main/
└── src
    ├── App.tsx
    ├── image-slider.css
    ├── ImageSlider.tsx
    ├── main.tsx
    └── vite-env.d.ts
```

### `src/App.tsx`

```typescript
import { ImageSlider } from "./ImageSlider";
import car1 from "./imgs/car-1.jpg";
import car2 from "./imgs/car-2.jpg";
import car3 from "./imgs/car-3.jpg";
import car4 from "./imgs/car-4.jpg";
import car5 from "./imgs/car-5.jpg";

const IMAGES = [
  { url: car1, alt: "Car One" },
  { url: car2, alt: "Car Two" },
  { url: car3, alt: "Car Three" },
  { url: car4, alt: "Car Four" },
  { url: car5, alt: "Car Five" },
];

export default function App() {
  return (
    <div
      style={{
        maxWidth: "1200px",
        width: "100%",
        aspectRatio: "10 / 6",
        margin: "0 auto",
      }}
    >
      <ImageSlider images={IMAGES} />
      <a href="/" style={{ fontSize: "4rem" }}>
        Link
      </a>
    </div>
  );
}
```

### `src/ImageSlider.tsx`

```typescript
import { useState } from "react";
import { ArrowBigLeft, ArrowBigRight, Circle, CircleDot } from "lucide-react";
import "./image-slider.css";

type ImageSliderProps = {
  images: {
    url: string;
    alt: string;
  }[];
};

export function ImageSlider({ images }: ImageSliderProps) {
  const [imageIndex, setImageIndex] = useState(0);

  function showNextImage() {
    setImageIndex((index) => {
      if (index === images.length - 1) return 0;
      return index + 1;
    });
  }

  function showPrevImage() {
    setImageIndex((index) => {
      if (index === 0) return images.length - 1;
      return index - 1;
    });
  }

  return (
    <section
      aria-label="Image Slider"
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      <a href="#after-image-slider-controls" className="skip-link">
        Skip Image Slider Controls
      </a>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          overflow: "hidden",
        }}
      >
        {images.map(({ url, alt }, index) => (
          <img
            key={url}
            src={url}
            alt={alt}
            aria-hidden={imageIndex !== index}
            className="img-slider-img"
            style={{ translate: `${-100 * imageIndex}%` }}
          />
        ))}
      </div>
      <button
        onClick={showPrevImage}
        className="img-slider-btn"
        style={{ left: 0 }}
        aria-label="View Previous Image"
      >
        <ArrowBigLeft aria-hidden />
      </button>
      <button
        onClick={showNextImage}
        className="img-slider-btn"
        style={{ right: 0 }}
        aria-label="View Next Image"
      >
        <ArrowBigRight aria-hidden />
      </button>
      <div
        style={{
          position: "absolute",
          bottom: ".5rem",
          left: "50%",
          translate: "-50%",
          display: "flex",
          gap: ".25rem",
        }}
      >
        {images.map((_, index) => (
          <button
            key={index}
            className="img-slider-dot-btn"
            aria-label={`View Image ${index + 1}`}
            onClick={() => setImageIndex(index)}
          >
            {index === imageIndex ? (
              <CircleDot aria-hidden />
            ) : (
              <Circle aria-hidden />
            )}
          </button>
        ))}
      </div>
      <div id="after-image-slider-controls" />
    </section>
  );
}
```

### `src/image-slider.css`

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

.img-slider-img {
  object-fit: cover;
  width: 100%;
  height: 100%;
  display: block;
  flex-shrink: 0;
  flex-grow: 0;
}

.img-slider-btn {
  all: unset;
  display: block;
  position: absolute;
  top: 0;
  bottom: 0;
  padding: 1rem;
  cursor: pointer;
  transition: background-color 100ms ease-in-out;
}

.img-slider-btn:hover,
.img-slider-btn:focus-visible {
  background-color: rgb(0, 0, 0, 0.2);
}

.img-slider-btn > * {
  stroke: white;
  fill: black;
  width: 2rem;
  height: 2rem;
}

@keyframes squish {
  50% {
    scale: 1.4 0.6;
  }
}

.img-slider-dot-btn {
  all: unset;
  display: block;
  cursor: pointer;
  width: 1rem;
  height: 1rem;
  transition: scale 100ms ease-in-out;
}

.img-slider-dot-btn:hover,
.img-slider-dot-btn:focus-visible {
  scale: 1.2;
}

.img-slider-dot-btn > * {
  stroke: white;
  fill: black;
  height: 100%;
  width: 100%;
}

.img-slider-dot-btn:focus-visible,
.img-slider-btn:focus-visible {
  outline: auto;
}

.skip-link {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  border: 0;
  clip: rect(0, 0, 0, 0);
}

.skip-link:focus-visible {
  top: 0;
  left: 0;
  border: 1px solid black;
  background-color: white;
  padding: 0.5rem;
  width: auto;
  height: auto;
  margin: 0;
  clip: unset;
  text-decoration: none;
  color: black;
  z-index: 100;
}

@media not (prefers-reduced-motion) {
  .img-slider-img {
    transition: translate 300ms ease-in-out;
  }

  .img-slider-btn:hover > *,
  .img-slider-btn:focus-visible > * {
    animation: squish 200ms ease-in-out;
  }
}
```

### `src/main.tsx`

```typescript
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### `src/vite-env.d.ts`

```typescript
/// <reference types="vite/client" />
```
