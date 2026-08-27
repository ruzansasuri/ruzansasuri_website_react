// Function to load the navbar
function loadNavbar() {
    const navbar = `
        <nav class="navbar navbar-expand-lg navbar-light bg-white py-3">
            <div class="container px-5">
                <a class="navbar-brand" href="index"><span class="fw-bolder text-primary">Ruzan Sasuri's Portfolio</span></a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav ms-auto mb-2 mb-lg-0 small fw-bolder">
                        <li class="nav-item"><a class="nav-link" href="index">Home</a></li>
                        <li class="nav-item"><a class="nav-link" href="resume">Resume</a></li>
                        <li class="nav-item"><a class="nav-link" href="skills">Skills</a></li>
                        <li class="nav-item"><a class="nav-link" href="projects">Projects</a></li>
                        <li class="nav-item"><a class="nav-link" href="stycobot">StycoBot</a></li>
                        <li class="nav-item"><a class="nav-link" href="contact">Contact</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    `;
    
    // Insert the navbar at the beginning of the main element
    document.querySelector('main').insertAdjacentHTML('afterbegin', navbar);
    
    // Highlight the current page in the navbar
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
}

// Load the navbar when the DOM is ready
document.addEventListener('DOMContentLoaded', loadNavbar); 