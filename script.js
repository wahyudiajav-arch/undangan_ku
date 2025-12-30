const bgMusic = document.getElementById('background-music');
let isPlaying = false;

function toggleMusic() {
    const btn = document.getElementById('music-btn');
    if (isPlaying) {
        bgMusic.pause();
        btn.classList.remove('playing');
        btn.innerHTML = '🔇';
    } else {
        bgMusic.play().catch(err => console.log("Audio play failed:", err));
        btn.classList.add('playing');
        btn.innerHTML = '🎵';
    }
    isPlaying = !isPlaying;
}

function openInvitation() {
    document.getElementById('hero').classList.add('unlock');
    document.body.style.overflow = 'auto';
    document.getElementById('music-btn').style.display = 'flex';
    
    // Start music
    if (!isPlaying) {
        bgMusic.currentTime = 35; // Mulai dari detik ke-20
        toggleMusic();
    }
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.innerText = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: white;
        color: var(--text-main);
        padding: 15px 30px;
        border-radius: 50px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.15);
        z-index: 9999;
        transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        border-left: 5px solid var(--primary-gold);
        font-weight: 600;
        pointer-events: none;
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.transform = "translateX(-50%) translateY(0)";
    }, 100);
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(-50%) translateY(20px)";
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast("Nomor berhasil disalin: " + text);
    }).catch(err => {
        console.error('Gagal menyalin: ', err);
    });
}

function sendGreeting() {
    const name = document.getElementById('name').value;
    const msg = document.getElementById('message').value;
    const att = document.getElementById('attendance').value;

    if(!name || !msg) return showToast('Mohon isi nama dan ucapan ya.. 🙏');

    // Construct WhatsApp Message
    const phone = "6281234567890"; // Ganti dengan nomor mempelai
    const waText = `Halo Iduyhaw & Ait,\n\nNama: ${name}\nKehadiran: ${att}\nUcapan: ${msg}\n\nTerima kasih!`;
    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(waText)}`;

    // UI Update (Guest Book)
    const badgeClass = att === 'Hadir' ? 'badge-hadir' : (att === 'Tidak Hadir' ? 'badge-tidakhadir' : 'badge-ragu');
    const greeting = document.createElement('div');
    greeting.className = 'guestbook-item';
    greeting.innerHTML = `
        <div class="guestbook-name">
            <span>${name}</span>
            <span class="attendance-badge ${badgeClass}">${att}</span>
        </div>
        <p style="margin-top:10px; color:#555; line-height:1.6;">${msg}</p>
    `;
    
    document.getElementById('greetings-display').prepend(greeting);
    document.getElementById('rsvp-form').reset();

    // Redirect to WhatsApp after short delay
    showToast('Ucapan berhasil disimpan! Terima kasih sudah mendoakan kami. ✨');
    
    setTimeout(() => {
        if(confirm("Buka WhatsApp untuk mengirim ucapan secara personal?")) {
            window.open(waUrl, '_blank');
        }
    }, 1000);
}

// Countdown Timer Logic
// Set to exactly 7 days (1 week) from now
const offset = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
const weddingDate = new Date(new Date().getTime() + offset).getTime();
const timer = setInterval(function() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerHTML = days;
    document.getElementById("hours").innerHTML = hours;
    document.getElementById("minutes").innerHTML = minutes;
    document.getElementById("seconds").innerHTML = seconds;

    if (distance < 0) {
        clearInterval(timer);
        document.getElementById("countdown").innerHTML = "HAPPY WEDDING!";
    }
}, 1000);

// Parse URL parameters for Guest Name
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const guest = urlParams.get('to');
    if (guest) {
        const guestNameElement = document.getElementById('guest-name');
        const guestGreetingElement = document.getElementById('guest-greeting');
        guestNameElement.innerText = guest;
        guestGreetingElement.style.display = 'block';
        
        // Pre-fill RSVP name if they use the link
        const rsvpNameInput = document.getElementById('name');
        if (rsvpNameInput) {
            rsvpNameInput.value = guest;
        }
    }
});

// Lock scroll initially for hero
document.body.style.overflow = 'hidden';

// Scroll Reveal Animation
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Floating sparkles generator
function createSparkle() {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = Math.random() * 100 + 'vw';
    sparkle.style.top = '100vh';
    const size = Math.random() * 8 + 4;
    sparkle.style.width = size + 'px';
    sparkle.style.height = size + 'px';
    sparkle.style.animation = `float ${Math.random() * 5 + 5}s linear forwards`;
    sparkle.style.background = `rgba(197, 160, 89, ${Math.random() * 0.5 + 0.2})`;
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 10000);
}
setInterval(createSparkle, 1000);

// Initialize Lucide Icons
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}
