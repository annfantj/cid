class CustomNavbar extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                nav {
                    transition: all 0.3s ease;
                }
                .nav-link {
                    position: relative;
                }
                .nav-link::after {
                    content: '';
                    position: absolute;
                    left: 0;
                    bottom: -2px;
                    width: 0;
                    height: 2px;
                    background: linear-gradient(to right, #6366f1, #a855f7);
                    transition: width 0.3s ease;
                }
                .nav-link:hover::after {
                    width: 100%;
                }
                .active::after {
                    width: 100%;
                }
            </style>
            <nav class="fixed w-full z-50 py-4 px-6 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 transition-colors duration-300">
                <div class="container mx-auto flex justify-between items-center">
                    <a href="#" class="text-2xl font-bold text-gray-900 dark:text-white">
                        <span class="text-primary-500">SN</span>
                    </a>
                    <div class="hidden md:flex items-center space-x-8">
                        <a href="#" class="nav-link active text-gray-900 dark:text-white">Home</a>
                        <a href="#about" class="nav-link text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">About</a>
                        <a href="#projects" class="nav-link text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Projects</a>
                        <a href="https://neoaz.is-a.dev/docs" class="nav-link text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Docs</a>
                        <a href="#contact" class="nav-link text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Contact</a>
                        <button id="theme-toggle" class="p-2 rounded-full bg-white/20 dark:bg-gray-800/50 hover:bg-white/30 dark:hover:bg-gray-700/50 transition-colors duration-300">
                            <i data-feather="moon" class="hidden dark:block w-5 h-5 text-gray-300"></i>
                            <i data-feather="sun" class="dark:hidden w-5 h-5 text-gray-700"></i>
                        </button>
                    </div>
                    <button class="md:hidden p-2 rounded-full bg-white/20 dark:bg-gray-800/50">
                        <i data-feather="menu" class="w-5 h-5 text-gray-900 dark:text-gray-300"></i>
                    </button>
                </div>
            </nav>
        `;
    }
}
customElements.define('custom-navbar', CustomNavbar);