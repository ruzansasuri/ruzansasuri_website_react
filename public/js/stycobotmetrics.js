
const openBtn = document.getElementById("open-react-panel");
const modal = document.getElementById("react-modal");
const closeBtn = document.getElementById("close-react-modal");
const iframe = document.getElementById("react-iframe");
const loader = document.getElementById('iframe-loader');

const IS_PROD = true; // Change this if you want to test a locally served version of the metrics app

console.log('Current hostname:', window.location.hostname);
console.log('Current protocol:', window.location.protocol);
console.log('Full URL:', window.location.href);

const REACT_APP_URL = IS_PROD 
  ? 'https://styco-bot-metrics.vercel.app/' // Production
  : 'http://localhost:5000'; // Local development

  // Open modal and lazy-load React app
openBtn.addEventListener("click", () => { 
  // Show loader
  modal.style.display = 'flex';
  loader.style.display = 'block';
  iframe.classList.remove('loaded');
  iframe.src = REACT_APP_URL; // set path to your React build
  modal.style.display = "flex";

  iframe.addEventListener('error', function handleError() {
    const standInImg = document.createElement('img');
    standInImg.src = 'assets/maintainance.jpeg';
    standInImg.alt = 'Content unavailable';
    standInImg.style.width = '100%';
    standInImg.style.height = '100%';
    standInImg.style.objectFit = 'contain';

    loader.style.display = 'none';
    iframe.classList.add('loaded');
    iframe.parentNode.replaceChild(standInImg, iframe);
  }, { once: true }); // Use once: true to auto-remove listener
  
  // Timeout fallback (more reliable for cross-origin issues)
  const timeoutId = setTimeout(() => {
    try {
      // Try to access iframe content
      const doc = iframe.contentWindow.document;
      // If we can access it, check if it has content
      if (!doc || !doc.body || doc.body.children.length === 0) {
        iframe.dispatchEvent(new Event('error'));
      }
    } catch(e) {
      // Cross-origin error means it likely loaded (if from different origin)
      // For localhost, this error means it failed to load
      iframe.dispatchEvent(new Event('error'));
    }
  }, 3000); // 3 second timeout
  
  // Clear timeout on successful load
  iframe.addEventListener('load', () => {
    loader.style.display = 'none';
    iframe.classList.add('loaded');
    clearTimeout(timeoutId);
  }, { once: true });
});

// Close modal
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
  iframe.src = ""; // unload React app for performance
});

// Optional: close modal on clicking outside content
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
    iframe.src = "";
  }
});
