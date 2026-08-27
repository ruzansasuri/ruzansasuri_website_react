
let chatMessages, chatForm, userInput, errorMessage;

const LAMBDA_A_BASE = `https://vdc8sf6h7c.execute-api.us-east-2.amazonaws.com/Prod`;
// AWS Lambda Function URL
const GATEWAY_URL = `${LAMBDA_A_BASE}/StycoBot`;

// Lambda A endpoints
const SUGGESTED_QUESTIONS_URL = `${LAMBDA_A_BASE}/tools/suggested-questions`;
const CV_DOWNLOAD_URL = `${LAMBDA_A_BASE}/tools/cv-download-url`;

// Clear command keywords
const CLEAR_COMMANDS = ['clear', 'reset', 'start over', 'new chat', 'clear chat', 'clear all'];

// Original welcome message
const WELCOME_MESSAGE = "Hello! I'm StycoBot. I can tell you all about Ruzan's skills and professional experiences. Please note that I can only answer questions based on Ruzan's resume, cover letter and Linkedin Profile. How can I assist you today?";

// ─────────────────────────────────────────────
// Init
// ─────────────────────────────────────────────
// NOTE: patched for SPA use. DOMContentLoaded only fires once per full page
// load, so it never fires again on client-side route changes. This is the
// standard fix - run immediately if the DOM is already ready, otherwise wait
// as before. Everything below this guard is unchanged from the original.
function initStycoBot() {
    chatMessages = document.getElementById('chatMessages');
    chatForm = document.getElementById('chatForm');
    userInput = document.getElementById('userInput');
    errorMessage = document.getElementById('errorMessage');

    if (!chatMessages || !chatForm || !userInput || !errorMessage) {
        console.error('One or more required elements are missing from the DOM');
        return;
    }

    while (chatMessages.firstChild) {
        chatMessages.removeChild(chatMessages.firstChild);
    }

    addMessage(WELCOME_MESSAGE, false);

    chatForm.addEventListener('submit', (e) => handleSubmit(e));
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    });

    loadSuggestedQuestions();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStycoBot);
} else {
    initStycoBot();
}

// ─────────────────────────────────────────────
// Suggested questions (Lambda A)
// ─────────────────────────────────────────────
async function loadSuggestedQuestions() {
    const chipsElem = document.getElementById('suggested-chips');
    if (!chipsElem) return;

    try {
        const res = await fetch(SUGGESTED_QUESTIONS_URL);
        const data = await res.json();
        if (!data.questions || !data.questions.length) {
            chipsElem.innerHTML = '';
            return;
        }
        chipsElem.innerHTML = data.questions
            .map(q => `<button class="suggested-chip" onclick="useChip(this)">${q}</button>`)
            .join('');
    } catch {
        chipsElem.innerHTML = '';
    }
}

function useChip(el) {
    userInput.value = el.textContent;
    const section = document.getElementById('suggested-section');
    if (section) section.style.display = 'none';
    handleSubmit();
}

// ─────────────────────────────────────────────
// CV download (Lambda A)
// ─────────────────────────────────────────────
async function downloadCV(event) {
    // This line STOPS the page from scrolling/jumping
    if (event) event.preventDefault();

    const btn = document.getElementById('cv-download-btn');
    const errorDiv = document.getElementById('cv-error-msg');
    const originalContent = btn.innerHTML;
    
    try {
        btn.disabled = true;
        btn.innerHTML = `<span class="spinner-border spinner-border-sm"></span>`;
        
        const response = await fetch(CV_DOWNLOAD_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        if (data.url) {
            window.location.href = data.url;
            btn.innerHTML = originalContent;
            btn.disabled = false;
        }

    } catch (error) {
        const isMobile = window.innerWidth <= 991;

        // 1. Enter Error State
        btn.classList.add('btn-error-state');
        btn.disabled = true;
        btn.innerHTML = `<i class="bi bi-info-circle"></i> Error`;

        errorDiv.classList.add('show-error');
        errorDiv.classList.remove('user-dismissed');


        let secondsLeft = 5;
        
        errorDiv.onclick = () => {
            errorDiv.style.display = 'none';
            errorDiv.classList.add('user-dismissed');
            secondsLeft = 0
        };

        const countdown = setInterval(() => {
            secondsLeft--;
            
            if (secondsLeft > 0) {
                errorDiv.textContent = isMobile 
                    ? `Download failed. Retrying in ${secondsLeft}s...` 
                    : `${error.message} (Resets in ${secondsLeft}s)`;

            } else {
                // 2. THE FIX: Clear and Reset the MOMENT we hit zero
                clearInterval(countdown);
                errorDiv.classList.remove('show-error'); // Hide tooltip instantly
                btn.classList.remove('btn-error-state');
                btn.innerHTML = originalContent;
                btn.disabled = false;
                // Wait for the CSS fade before wiping the text
                setTimeout(() => {
                    errorDiv.textContent = ""; 
                }, 300);
            }
        }, 1000);

        // Initial text set
        errorDiv.textContent = isMobile 
            ? `Download failed. Retrying in ${secondsLeft}s...` 
            : `${error.message} (Resets in ${secondsLeft}s)`;

    }
}
// ─────────────────────────────────────────────
// Existing chat logic — unchanged
// ─────────────────────────────────────────────
function isClearCommand(message) {
    return CLEAR_COMMANDS.some(cmd => message.toLowerCase().includes(cmd));
}

function clearChat() {
    while (chatMessages.children.length > 0) {
        chatMessages.removeChild(chatMessages.lastChild);
    }
    addMessage("Chat cleared!", false);
    addMessage(WELCOME_MESSAGE, false);
}

function addMessage(message, isUser = false) {
    if (!chatMessages) {
        console.error('chatMessages element not found');
        return;
    }
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${isUser ? 'user' : 'bot'}`;
    const bubble = document.createElement('div');
    bubble.className = 'chatbot-bubble';
    bubble.textContent = message;
    messageDiv.appendChild(bubble);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'chatbot-message bot';
    indicator.innerHTML = `
        <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    indicator.id = 'typingIndicator';
    chatMessages.appendChild(indicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

async function sendMessage(message) {
    try {
        showTypingIndicator();

        const response = await fetch(GATEWAY_URL, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'origin': 'https://ruzansasuri.com'
            },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) throw new Error('Failed to get response');

        const data = await response.json();
        console.log('Response data:', data);
        removeTypingIndicator();

        if (data && typeof data === 'object') {
            if (data.response) {
                addMessage(data.response);
            } else if (data.message) {
                if (data.message.answer) {
                    addMessage(data.message.answer);
                } else {
                    addMessage(data.message);
                }
            } else if (typeof data === 'string') {
                addMessage(data);
            } else if (Array.isArray(data)) {
                data.forEach(msg => addMessage(msg));
            }
        }
    } catch (error) {
        console.error('Error:', error);
        removeTypingIndicator();
        errorMessage.textContent = 'Sorry, there was an error processing your message. Please try again.';
        errorMessage.style.display = 'block';
        setTimeout(() => { errorMessage.style.display = 'none'; }, 5000);
    }
}

async function handleSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    const message = userInput.value.trim();
    if (!message) return;
    addMessage(message, true);
    userInput.value = '';
    if (isClearCommand(message)) {
        clearChat();
    } else {
        await sendMessage(message);
    }
}

function toggleExpand() {
    const container = document.querySelector('.chatbot-container');
    const icon = document.getElementById('expand-icon');
    const isExpanded = container.classList.toggle('is-expanded');

    if (isExpanded) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Swap icon to 'contract'
        document.getElementById('expand-icon').classList.replace('bi-arrows-angle-expand', 'bi-arrows-angle-contract');
        // Stop the background from scrolling
        document.body.style.overflow = 'hidden';
    } else {
        // Swap icon back to 'expand'
        document.getElementById('expand-icon').classList.replace('bi-arrows-angle-contract', 'bi-arrows-angle-expand');
        // Restore background scrolling
        document.body.style.overflow = '';
    }
}
