// --- Utils & Setup ---
const tl = gsap.timeline();

// Audio Elements
const bgMusic = document.getElementById('bg-music');
const popSound = document.getElementById('pop-sound');
let isMuted = true; // start muted for autoplay policy

document.getElementById('mute-btn').addEventListener('click', () => {
    isMuted = !isMuted;
    bgMusic.muted = isMuted;
    popSound.muted = isMuted;
    const btn = document.getElementById('mute-btn');
    if (!isMuted) {
        bgMusic.play().catch(e=>console.log("Audio play failed:", e));
        btn.innerHTML = '🔊';
    } else {
        bgMusic.pause();
        btn.innerHTML = '🔇';
    }
});

// Sparkle Cursor
document.addEventListener('mousemove', (e) => {
    const trail = document.getElementById('cursor-trail');
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = e.pageX + 'px';
    sparkle.style.top = e.pageY + 'px';
    trail.appendChild(sparkle);

    setTimeout(() => {
        sparkle.remove();
    }, 1000);
});

function switchSection(currentId, nextId, callback) {
    const current = document.getElementById(currentId);
    const next = document.getElementById(nextId);
    
    gsap.to(current, { opacity: 0, y: -50, duration: 1, onComplete: () => {
        current.classList.add('hidden');
        current.classList.remove('active');
        
        next.classList.remove('hidden');
        setTimeout(() => {
            next.classList.add('active');
            gsap.fromTo(next, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, onComplete: callback });
        }, 50);
    }});
}

function fireConfetti(duration = 2000, colorMap = null) {
    var end = Date.now() + duration;
    var colors = colorMap || ['#ff9a9e', '#fecfef', '#a18cd1', '#fbc2eb', '#ffb199', '#fad0c4'];

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

document.addEventListener('DOMContentLoaded', () => {
    // Show opening section
    const opening = document.getElementById('opening');
    opening.classList.remove('hidden');
    opening.classList.add('active');
    
    gsap.to('.intro-text', { opacity: 1, y: 0, duration: 2, ease: "power2.out", delay: 1 });

    // Generate Stars
    const starsContainer = document.querySelector('.stars');
    for(let i=0; i<100; i++) {
        let star = document.createElement('div');
        star.style.position = 'absolute';
        star.style.left = Math.random() * 100 + 'vw';
        star.style.top = Math.random() * 100 + 'vh';
        star.style.width = Math.random() * 3 + 'px';
        star.style.height = Math.random() * 3 + 'px';
        star.style.backgroundColor = '#fff';
        star.style.borderRadius = '50%';
        star.style.opacity = Math.random();
        star.style.animation = `flicker ${Math.random()*2 + 1}s infinite alternate`;
        starsContainer.appendChild(star);
    }
});

// --- 1. Opening -> Name Reveal ---
document.getElementById('enter-btn').addEventListener('click', () => {
    // Try playing music on first interaction
    if (bgMusic.paused && !isMuted) bgMusic.play().catch(e=>console.log(e));
    if (bgMusic.paused && isMuted) {
        // Auto unmute and play if user starts interaction without unmuting
        isMuted = false;
        bgMusic.muted = false;
        popSound.muted = false;
        document.getElementById('mute-btn').innerHTML = '🔊';
        bgMusic.play().catch(e=>console.log(e));
    }

    fireConfetti();
    
    switchSection('opening', 'name-reveal', () => {
        revealName();
    });
});

function revealName() {
    const name = "RUNJHUN"; // Name from user prompt
    const container = document.getElementById('balloon-container');
    
    for(let i=0; i<name.length; i++) {
        let b = document.createElement('div');
        b.className = 'name-balloon';
        b.innerText = name[i];
        container.appendChild(b);
    }

    // Animate balloons rising
    gsap.to('.name-balloon', {
        y: 0,
        opacity: 1,
        duration: 2,
        stagger: 0.3,
        ease: "back.out(1.7)",
        onComplete: () => {
            // Wiggle animation
            gsap.to('.name-balloon', {
                y: -10,
                duration: 1,
                yoyo: true,
                repeat: -1,
                ease: "sine.inOut",
                stagger: 0.1
            });
            
            setTimeout(() => {
                fireConfetti(3000);
                const msg = document.getElementById('happy-birthday-msg');
                msg.classList.remove('hidden');
                gsap.fromTo(msg, {opacity: 0, scale: 0.5}, {opacity: 1, scale: 1, duration: 1, ease:"elastic.out(1, 0.3)"});
                
                setTimeout(() => {
                    const nextBtn = document.getElementById('next-to-gallery');
                    nextBtn.classList.remove('hidden');
                    gsap.fromTo(nextBtn, {opacity:0}, {opacity:1, duration:1});
                }, 1000);
            }, 1000);
        }
    });
}

// --- 2. Name Reveal -> Gallery ---
document.getElementById('next-to-gallery').addEventListener('click', () => {
    switchSection('name-reveal', 'memory-gallery', () => {
        // Animate polaroids falling
        gsap.to('.polaroid', {
            y: 0,
            opacity: 1,
            duration: 1.5,
            stagger: 0.2,
            ease: "bounce.out"
        });
    });
});

// Gallery Interactions
const modal = document.getElementById('photo-modal');
const modalImg = document.getElementById('img01');
const closeBtn = document.getElementsByClassName('close-modal')[0];

document.querySelectorAll('.polaroid').forEach(p => {
    p.addEventListener('click', function() {
        modal.classList.remove('hidden');
        modal.classList.add('show');
        modalImg.src = this.querySelector('img').src;
        createFloatingHearts();
    });
});

closeBtn.onclick = function() {
    modal.classList.remove('show');
    setTimeout(() => modal.classList.add('hidden'), 300);
    document.getElementById('floating-hearts').innerHTML = ''; // clear hearts
}

function createFloatingHearts() {
    const container = document.getElementById('floating-hearts');
    for(let i=0; i<15; i++) {
        let heart = document.createElement('div');
        heart.innerHTML = '💖';
        heart.style.position = 'absolute';
        heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.bottom = '-50px';
        heart.style.opacity = Math.random() + 0.5;
        heart.style.animation = `floatUp ${Math.random()*3 + 3}s linear infinite`;
        container.appendChild(heart);
    }
}

let slideshowInterval;
document.getElementById('slideshow-btn').addEventListener('click', function() {
    if (this.innerText.includes('Start')) {
        this.innerText = 'Stop Slideshow ⏹️';
        let items = document.querySelectorAll('.polaroid');
        let index = 0;
        
        modal.classList.remove('hidden');
        modal.classList.add('show');
        createFloatingHearts();

        function showNext() {
            modalImg.src = items[index].querySelector('img').src;
            gsap.fromTo(modalImg, {opacity: 0, scale: 0.8}, {opacity: 1, scale: 1, duration: 1});
            index = (index + 1) % items.length;
        }
        showNext();
        slideshowInterval = setInterval(showNext, 3000);

    } else {
        this.innerText = 'Start Slideshow 📸';
        clearInterval(slideshowInterval);
        closeBtn.click();
    }
});

// --- 3. Gallery -> Gifts ---
document.getElementById('next-to-gifts').addEventListener('click', () => {
    clearInterval(slideshowInterval); // ensure stopped
    switchSection('memory-gallery', 'gifts', () => {
        gsap.from('.gift-box', {y: 100, opacity: 0, duration: 1, stagger: 0.2, ease: "back.out(1.7)"});
    });
});

// Gift Interactions
let openedGifts = 0;
document.querySelectorAll('.gift-box').forEach(box => {
    box.addEventListener('click', function() {
        if (this.classList.contains('opened')) return; // already opened
        
        this.classList.add('opened');
        
        const textElement = document.getElementById('surprise-text');
        textElement.classList.remove('hidden');
        textElement.innerText = this.getAttribute('data-surprise');
        gsap.fromTo(textElement, {opacity: 0, y: 20}, {opacity: 1, y: 0, duration: 0.5});
        
        // Small confetti pop at box position
        const rect = this.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;
        
        confetti({
            particleCount: 30,
            spread: 40,
            origin: { x, y }
        });
        
        if(!popSound.paused) popSound.currentTime = 0;
        popSound.play().catch(e=>{});
        
        openedGifts++;
        if(openedGifts === 3) {
            setTimeout(() => {
                const nextBtn = document.getElementById('next-to-game');
                nextBtn.classList.remove('hidden');
                gsap.fromTo(nextBtn, {opacity:0}, {opacity:1, duration:1});
            }, 1000);
        }
    });
});

// --- 4. Gifts -> Mini Game ---
document.getElementById('next-to-game').addEventListener('click', () => {
    switchSection('gifts', 'mini-game', () => {
        startGame();
    });
});

let gameScore = 0;
const targetScore = 10;
let gameActive = false;
let gameInterval;

function startGame() {
    gameScore = 0;
    document.getElementById('score').innerText = gameScore;
    gameActive = true;
    
    gameInterval = setInterval(() => {
        if(!gameActive) return;
        createGameBalloon();
    }, 800);
}

function createGameBalloon() {
    const area = document.getElementById('game-area');
    const balloon = document.createElement('div');
    balloon.className = 'game-balloon';
    
    // Random color
    const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a18cd1', '#ff9a9e'];
    balloon.style.setProperty('--bg-color', colors[Math.floor(Math.random() * colors.length)]);
    
    // Random position
    balloon.style.left = Math.random() * 80 + 10 + '%';
    
    const duration = Math.random() * 3 + 3; // 3-6 seconds
    balloon.style.animationDuration = duration + 's';
    
    balloon.addEventListener('click', () => {
        if(!gameActive) return;
        
        balloon.remove();
        gameScore++;
        document.getElementById('score').innerText = gameScore;
        
        if(!popSound.paused) popSound.currentTime = 0;
        popSound.play().catch(e=>{});
        
        // Mini explosion
        const rect = balloon.getBoundingClientRect();
        confetti({
            particleCount: 15,
            spread: 20,
            origin: { 
                x: (rect.left + 25) / window.innerWidth, 
                y: (rect.top + 30) / window.innerHeight 
            },
            colors: [colors[Math.floor(Math.random() * colors.length)]],
            ticks: 50
        });

        if(gameScore >= targetScore) {
            endGame();
        }
    });
    
    area.appendChild(balloon);
    
    // Cleanup
    setTimeout(() => {
        if(balloon.parentNode) balloon.remove();
    }, duration * 1000);
}

function endGame() {
    gameActive = false;
    clearInterval(gameInterval);
    
    document.getElementById('game-area').innerHTML = ''; // clear remaining
    
    const reward = document.getElementById('game-reward');
    reward.classList.remove('hidden');
    gsap.fromTo(reward, {opacity: 0, scale: 0.5}, {opacity: 1, scale: 1, duration: 1, ease: "elastic.out"});
    
    setTimeout(() => {
        const nextBtn = document.getElementById('next-to-cake');
        nextBtn.classList.remove('hidden');
        gsap.fromTo(nextBtn, {opacity:0}, {opacity:1, duration:1});
    }, 1500);
}

// --- 5. Game -> Cake ---
document.getElementById('next-to-cake').addEventListener('click', () => {
    switchSection('mini-game', 'cake-section', () => {});
});

const cake = document.getElementById('birthday-cake');
cake.addEventListener('click', function() {
    if (this.classList.contains('cut')) return;
    
    this.classList.add('cut');
    
    // Firework burst
    fireConfetti();
    
    setTimeout(() => {
        const msg = document.getElementById('cake-message');
        msg.classList.remove('hidden');
        
        setTimeout(() => {
            const nextBtn = document.getElementById('next-to-envelope');
            nextBtn.classList.remove('hidden');
            gsap.fromTo(nextBtn, {opacity:0}, {opacity:1, duration:1});
        }, 1500);
    }, 1000);
});

// --- 6. Cake -> Envelope ---
document.getElementById('next-to-envelope').addEventListener('click', () => {
    switchSection('cake-section', 'envelope-section', () => {
        gsap.from('.envelope', {y: 100, opacity: 0, rotationX: 45, duration: 1});
    });
});

const envelope = document.getElementById('secret-envelope');
envelope.addEventListener('click', function() {
    if(this.classList.contains('open')) return;
    this.classList.add('open');
    
    setTimeout(() => {
        const nextBtn = document.getElementById('next-to-finale');
        nextBtn.classList.remove('hidden');
        gsap.fromTo(nextBtn, {opacity:0}, {opacity:1, duration:1});
    }, 1500);
});

// --- 7. Envelope -> Finale ---
document.getElementById('next-to-finale').addEventListener('click', () => {
    switchSection('envelope-section', 'finale-section', () => {
        startFinaleFireworks();
    });
});

function startFinaleFireworks() {
    var duration = 15 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function() {
      var timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      var particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
}

