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
                <button class="menu-btn" id="menuToggle" onclick="this.closest('app-navbar').toggleMenu()">
                    <i class='bx bx-menu'></i>
                </button>
            </nav>
            <div class="mobile-nav" id="mobileNav">
                <ul>
                    ${renderLinks()}
                </ul>
            </div>
        `;
    }

    toggleMenu() {
        const mobileNav = this.querySelector('#mobileNav');
        const menuToggle = this.querySelector('#menuToggle');
        if (mobileNav && menuToggle) {
            mobileNav.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (mobileNav.classList.contains('active')) {
                icon.classList.replace('bx-menu', 'bx-x');
            } else {
                icon.classList.replace('bx-x', 'bx-menu');
            }
        }
    }
}

class AppFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
    <footer class="modern-footer">
        <div class="footer-grid">
            <!-- Left Section — Branding -->
            <div class="footer-brand">
                <div class="brand-header">
                    <svg class="brand-logo" width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 21a9.002 9.002 0 0 0 8.046-5.046c-2.483-1.637-5.586-1.503-8.046.297-2.46-1.8-5.563-1.934-8.046-.297A9.002 9.002 0 0 0 12 21z" fill="currentColor" fill-opacity="0.2"/>
                        <path d="M12 12c-2 0-4 1.5-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 12c2 0 4 1.5 4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 2v10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span class="brand-name">SUSTAINIFY</span>
                </div>
                <p class="brand-tagline">Driving climate action for a greener and resilient tomorrow.</p>
            </div>

            <!-- Center Section — Copyright -->
            <div class="footer-copyright">
                <p>© 2026 Sustainify — Built for SDG 13</p>
            </div>

            <!-- Right Section — External Resources -->
            <div class="footer-resources">
                <h4 class="resources-title">External Resources</h4>
                <ul class="resources-links">
                    <li><a href="https://sdgs.un.org/goals/goal13" target="_blank" rel="noopener noreferrer">United Nations SDG 13</a></li>
                    <li><a href="https://unfccc.int/" target="_blank" rel="noopener noreferrer">UN Climate Change</a></li>
                    <li><a href="https://www.unep.org/explore-topics/climate-action" target="_blank" rel="noopener noreferrer">UNEP Climate Action</a></li>
                </ul>
            </div>
        </div>
    </footer>
        `;
    }
}

customElements.define('app-navbar', AppNavbar);
customElements.define('app-footer', AppFooter);
