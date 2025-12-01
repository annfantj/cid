document.addEventListener('DOMContentLoaded', function() {
    // ========================
    // Notification (Existing Code)
    // ========================
    const notification = document.getElementById('notification');
    if (notification) {
        // Show notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('translate-y-4', 'opacity-0');
            notification.classList.add('translate-y-0', 'opacity-100');
        }, 3000);

        // Close notification
        const closeBtn = document.getElementById('close-notification');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                notification.classList.add('translate-y-4', 'opacity-0');
                setTimeout(() => {
                    notification.style.display = 'none';
                }, 300);
            });
        }
    }

    // ========================
    // Smooth scrolling for anchors (Existing Code)
    // ========================
    const offset = 80; // adjust if navbar height changes
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const elementPosition = target.getBoundingClientRect().top + window.scrollY;
                window.scrollTo({
                    top: elementPosition - offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================
    // Navbar shadow on scroll (Existing Code)
    // ========================
    customElements.whenDefined('custom-navbar').then(() => {
        const navbarEl = document.querySelector('custom-navbar');
        if (navbarEl?.shadowRoot) {
            const navbar = navbarEl.shadowRoot.querySelector('nav');
            window.addEventListener('scroll', () => {
                if (window.scrollY > 10) {
                    navbar.classList.add('shadow-lg', 'bg-white/90', 'dark:bg-gray-900/90');
                } else {
                    navbar.classList.remove('shadow-lg', 'bg-white/90', 'dark:bg-gray-900/90');
                }
            });
        }
    });

    // ========================
    // Theme toggle (Existing Code)
    // ========================
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
        });
    }

    // Apply saved or system theme preference
    if (localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    // ========================
    // Intersection Observer for animations (Existing Code)
    // ========================
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeIn');
                observer.unobserve(entry.target); // animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
    
    // =======================================================
    // 🧠 Grok 4.1 Chat Integration (New Code Block)
    // =======================================================
    const chatWindow = document.getElementById('chat-window');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const statusDiv = document.getElementById('status');
    
    // ⚠️ IMPORTANT: This MUST be your secure backend server endpoint.
    // NEVER put the Grok API endpoint here directly, as it exposes your API key.
    const BACKEND_ENDPOINT = 'http://localhost:3000/api/grok_chat'; 
    
    // Conversation history to maintain context for Grok
    const conversationHistory = [
        { role: "system", content: "You are Grok 4.1, an extremely intelligent and witty AI assistant with a humorous, slightly sarcastic tone. Keep your answers concise and engaging." }
    ];

    function addMessageToChat(role, content) {
        if (!chatWindow) return; // Exit if chat interface isn't present
        
        const messageDiv = document.createElement('div');
        // Note: Using the classes defined in the conceptual chat.html's CSS
        messageDiv.className = `message ${role}-message`;
        messageDiv.textContent = content;
        chatWindow.appendChild(messageDiv);
        
        // Auto-scroll to the latest message
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    async function sendMessage() {
        if (!userInput || !sendButton) return;

        const userMessage = userInput.value.trim();
        if (!userMessage) return;

        // 1. Display User Message and Clear Input
        addMessageToChat('user', userMessage);
        userInput.value = '';
        sendButton.disabled = true;
        
        if (statusDiv) {
            statusDiv.textContent = 'Grok is calculating the meaning of life... or typing.';
            statusDiv.style.display = 'block';
        }

        // 2. Add user message to history
        conversationHistory.push({ role: "user", content: userMessage });

        try {
            // 3. Send message history to your backend proxy
            const response = await fetch(BACKEND_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ messages: conversationHistory })
            });

            if (!response.ok) {
                // Try to read server error message if available
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Server error: ${response.status}. ${errorData.error || 'Check server logs.'}`);
            }

            const data = await response.json();
            
            const grokResponse = data.grokResponse; 
            
            // 4. Add Grok's response to the history and display it
            if (grokResponse) {
                conversationHistory.push({ role: "assistant", content: grokResponse });
                addMessageToChat('grok', grokResponse);
            } else {
                addMessageToChat('grok', "🤔 Grok is speechless. Something went wrong with the API response.");
            }

        } catch (error) {
            console.error('Error fetching Grok response:', error);
            addMessageToChat('grok', `❌ Error: Failed to connect to the Grok service. Details: ${error.message}`);
        } finally {
            sendButton.disabled = false;
            if (statusDiv) {
                statusDiv.style.display = 'none';
            }
        }
    }

    // Event Listeners for the Chat Interface
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }
    if (userInput) {
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});
