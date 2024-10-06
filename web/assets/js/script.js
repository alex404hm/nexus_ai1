// Toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
    updateDarkModeIcon(isDark);
}

function updateDarkModeIcon(isDark) {
    document.getElementById('dark-mode-button').innerHTML = isDark 
        ? '<i class="fas fa-sun text-white"></i>' 
        : '<i class="fas fa-moon text-white"></i>';
}

// Manage modal visibility
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('show');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
}

// Auto close modal on background click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', e => {
        if (e.target === modal) closeModal(modal.id);
    });
});

// Show word of the day
function showWordOfTheDay(word, definition) {
    document.getElementById('wotd-word').textContent = word;
    document.getElementById('wotd-definition').textContent = definition;
}

// Handle search
document.getElementById('search-button').addEventListener('click', handleSearch);

function handleSearch() {
    const query = document.getElementById('search-input').value.trim().toLowerCase();
    if (query) {
        document.getElementById('loading-screen').classList.remove('hidden');
        
        // Simulate API call
        setTimeout(() => {
            document.getElementById('loading-screen').classList.add('hidden');
            document.getElementById('search-results').classList.remove('hidden');
            document.getElementById('search-results').innerHTML = `<h3>Søgeresultat for: ${query}</h3>`;
        }, 1000);
    }
}

// Chat handling
document.getElementById('chat-form').addEventListener('submit', e => {
    e.preventDefault();
    const input = document.getElementById('chat-input').value.trim();
    if (input) {
        const messages = document.getElementById('chat-messages');
        messages.innerHTML += `<p>${input}</p>`;
        document.getElementById('chat-input').value = '';
        messages.scrollTop = messages.scrollHeight;
    }
});

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark');
        updateDarkModeIcon(true);
    }
    document.getElementById('dark-mode-button').addEventListener('click', toggleDarkMode);
    document.querySelectorAll('.close').forEach(btn => btn.addEventListener('click', () => closeModal(btn.closest('.modal').id)));
});
