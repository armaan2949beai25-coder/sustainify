// js/components.js

class AppNavbar extends HTMLElement {
    connectedCallback() {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        
        const links = [
            { href: 'index.html', text: 'Home' },
            { href: 'calculator.html', text: 'Calculator' },
            { href: 'projects.html', text: 'Offset Projects' }
        ];

        const renderLinks = () => links.map(link => 
            `<li><a href="${link.href}" class="${currentPath === link.href ? 'active' : ''}">${link.text}</a></li>`
        ).join('');

        this.innerHTML = `
            <nav class="navbar">
                <a href="index.html" class="logo">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--primary)" style="margin-right: 8px;">
                        <path d="M10.5 12.5C10.5 14.5 9.5 16 8 16C6.5 16 5.5 14.5 5.5 12.5C5.5 10.5 7 7 8 7C9 7 10.5 10.5 10.5 12.5Z"/>
                        <circle cx="8" cy="4" r="1.5" />
                        <circle cx="5" cy="5" r="1.2" />
                        <circle cx="11" cy="5" r="1.2" />
                        <path d="M18.5 15.5C18.5 17.5 17.5 19 16 19C14.5 19 13.5 17.5 13.5 15.5C13.5 13.5 15 10 16 10C17 10 18.5 13.5 18.5 15.5Z" opacity="0.7"/>
                        <circle cx="16" cy="7" r="1.5" opacity="0.7"/>
                        <circle cx="13" cy="8" r="1.2" opacity="0.7"/>
                        <circle cx="19" cy="8" r="1.2" opacity="0.7"/>
                    </svg>
                    <span style="white-space: nowrap;">Sustaini<span class="highlight">fy</span></span>
                </a>
                <ul class="nav-links">
                    ${renderLinks()}
                </ul>
                <button class="menu-btn" id="menuToggle"><i class='bx bx-menu'></i></button>
            </nav>
            <div class="mobile-nav" id="mobileNav">
                <ul>
                    ${renderLinks()}
                </ul>
            </div>
        `;

        const menuToggle = this.querySelector('#menuToggle');
        const mobileNav = this.querySelector('#mobileNav');
        
        if (menuToggle && mobileNav) {
            menuToggle.addEventListener('click', () => {
                mobileNav.classList.toggle('active');
                const icon = menuToggle.querySelector('i');
                if (mobileNav.classList.contains('active')) {
                    icon.classList.replace('bx-menu', 'bx-x');
                } else {
                    icon.classList.replace('bx-x', 'bx-menu');
                }
            });
        }
    }
}

class AppFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer>
                <p>&copy; 2026 Sustainify.</p>
                <p>Made by NAS 🌿</p>
            </footer>
        `;
    }
}

customElements.define('app-navbar', AppNavbar);
customElements.define('app-footer', AppFooter);
