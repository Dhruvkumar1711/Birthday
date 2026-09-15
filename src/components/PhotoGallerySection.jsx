import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';

const PHOTOS = [
  { src: '/images/photo1.jpg', caption: 'Cutie', rot: -3 },
  { src: '/images/photo2.jpeg', caption: 'Beautiful', rot: 3 },
  { src: '/images/photo3.jpeg', caption: 'Smile', rot: -2 },
  { src: '/images/photo4.webp', caption: 'so beautiful, even the stars are jealous', rot: 4 },
  { src: '/images/photo5.jpeg', caption: 'Lovely', rot: -3 },
  { src: '/images/photo6.jpg', caption: 'Birthday queen', rot: 2 },
  { src: '/images/photo7.jpeg', caption: 'Shinning', rot: -4 },
  { src: '/images/photo8.jpg', caption: 'Gorgeous', rot: 3 },
  { src: '/images/photo9.jpeg', caption: 'Lovely', rot: -2 }
];

const HEARTS = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  fontSize: `${14 + (i * 7) % 18}px`,
  left: `${(i * 19 + 5) % 95}vw`,
  duration: `${3 + (i % 3)}s`,
  delay: `${(i * 0.3) % 2}s`
}));

export default function PhotoGallerySection({ onNext }) {
  const [activePhotoIndex, setActivePhotoIndex] = useState(null);
  const [isSlideshow, setIsSlideshow] = useState(false);
  const containerRef = useRef(null);
  const modalImgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.polaroid',
        { y: -60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.12,
          ease: 'bounce.out'
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (activePhotoIndex !== null) {
      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = document.documentElement.style.overflow;

      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
      document.documentElement.classList.add('modal-open');

      const onKeyDown = (e) => {
        if (e.key === 'Escape') {
          closeModal();
        } else if (e.key === 'ArrowRight') {
          goToNextPhoto();
        } else if (e.key === 'ArrowLeft') {
          goToPrevPhoto();
        } else if (e.key === ' ') {
          e.preventDefault();
          setIsSlideshow((prev) => !prev);
        }
      };

      window.addEventListener('keydown', onKeyDown);

      return () => {
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = prevHtmlOverflow;
        document.body.classList.remove('modal-open');
        document.documentElement.classList.remove('modal-open');
        window.removeEventListener('keydown', onKeyDown);
      };
    }
  }, [activePhotoIndex]);

  useEffect(() => {
    if (!isSlideshow || activePhotoIndex === null) return;

    const timer = setInterval(() => {
      setActivePhotoIndex((prev) => (prev + 1) % PHOTOS.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [isSlideshow, activePhotoIndex]);

  useEffect(() => {
    if (activePhotoIndex !== null && modalImgRef.current) {
      gsap.fromTo(
        modalImgRef.current,
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' }
      );
    }
  }, [activePhotoIndex]);

  const startSlideshow = () => {
    setIsSlideshow(true);
    setActivePhotoIndex(0);
  };

  const closeModal = () => {
    setIsSlideshow(false);
    setActivePhotoIndex(null);
  };

  const goToNextPhoto = () => {
    setActivePhotoIndex((prev) => (prev === null ? 0 : (prev + 1) % PHOTOS.length));
  };

  const goToPrevPhoto = () => {
    setActivePhotoIndex((prev) => (prev === null ? 0 : (prev - 1 + PHOTOS.length) % PHOTOS.length));
  };

  const handleNext = () => {
    closeModal();
    if (onNext) onNext();
  };

  const activePhoto = activePhotoIndex !== null ? PHOTOS[activePhotoIndex] : null;

  return (
    <section id="memory-gallery" className="fullscreen-section active" ref={containerRef}>
      <h2 className="section-title">Precious Memories 💖</h2>

      <div className="gallery-container">
        {PHOTOS.map((photo, index) => (
          <div
            key={index}
            className="polaroid"
            style={{ '--rot': `${photo.rot}deg` }}
            onClick={() => {
              setIsSlideshow(false);
              setActivePhotoIndex(index);
            }}
          >
            <img src={photo.src} alt={photo.caption} loading="lazy" />
            <div className="caption">{photo.caption}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button id="slideshow-btn" className="glow-on-hover" onClick={startSlideshow}>
          Start Slideshow 📸
        </button>
        <button id="next-to-gifts" className="nav-btn glow-on-hover" onClick={handleNext}>
          Next Surprise ✨
        </button>
      </div>

      {activePhoto && createPortal(
        <div
          id="photo-modal"
          className="show"
          onClick={closeModal}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div className="modal-toolbar" onClick={(e) => e.stopPropagation()}>
            <span className="photo-counter">
              {activePhotoIndex + 1} / {PHOTOS.length}
            </span>
            <div className="modal-actions">
              <button
                type="button"
                className="modal-action-btn"
                onClick={() => setIsSlideshow((prev) => !prev)}
              >
                {isSlideshow ? 'Pause Slideshow ⏸️' : 'Play Slideshow ▶️'}
              </button>
              <button
                type="button"
                className="close-modal-btn"
                onClick={closeModal}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>

          <button
            type="button"
            className="modal-arrow left"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevPhoto();
            }}
            aria-label="Previous photo"
          >
            ‹
          </button>

          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <img
              ref={modalImgRef}
              className="modal-content"
              src={activePhoto.src}
              alt={activePhoto.caption}
            />
            <p className="modal-caption">{activePhoto.caption}</p>
          </div>

          <button
            type="button"
            className="modal-arrow right"
            onClick={(e) => {
              e.stopPropagation();
              goToNextPhoto();
            }}
            aria-label="Next photo"
          >
            ›
          </button>

          <div id="floating-hearts" aria-hidden="true">
            {HEARTS.map((h) => (
              <div
                key={h.id}
                style={{
                  position: 'absolute',
                  fontSize: h.fontSize,
                  left: h.left,
                  bottom: '-50px',
                  animation: `floatHeartUp ${h.duration} linear infinite`,
                  animationDelay: h.delay
                }}
              >
                💖
              </div>
            ))}
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
