function loadFooter() {
    const footer = `
        <footer class="py-5 mt-auto" style="background: linear-gradient(180deg, rgba(30, 48, 243, 0.05), rgba(226, 30, 128, 0.05));">
            <div class="container px-5">
                <div class="row gy-4">
                    <div class="col-6 col-md-3">
                        <h6 class="fw-bolder mb-3">Site Map</h6>
                        <ul class="list-unstyled small">
                            <li class="mb-2"><a class="link-secondary text-decoration-none" href="index">Home</a></li>
                            <li class="mb-2"><a class="link-secondary text-decoration-none" href="resume">Resume</a></li>
                            <li class="mb-2"><a class="link-secondary text-decoration-none" href="skills">Skills</a></li>
                        </ul>
                    </div>
                    <div class="col-6 col-md-3">
                        <h6 class="fw-bolder mb-3">Work</h6>
                        <ul class="list-unstyled small">
                            <li class="mb-2"><a class="link-secondary text-decoration-none" href="projects">Projects</a></li>
                            <li class="mb-2"><a class="link-secondary text-decoration-none" href="stycobot">StycoBot</a></li>
                        </ul>
                    </div>
                    <div class="col-6 col-md-3">
                        <h6 class="fw-bolder mb-3">Connect</h6>
                        <ul class="list-unstyled small">
                            <li class="mb-2"><a class="link-secondary text-decoration-none" href="contact">Contact</a></li>
                            <li class="mb-2"><a class="link-secondary text-decoration-none" href="https://github.com/ruzansasuri" target="_blank" rel="noopener">GitHub</a></li>
                        </ul>
                    </div>
                    <div class="col-6 col-md-3">
                        <h6 class="fw-bolder mb-3">Ruzan Sasuri</h6>
                        <p class="small text-muted mb-0">Fullstack Software Engineer</p>
                    </div>
                </div>
                <hr class="my-4">
                <div class="row align-items-center">
                    <div class="col-auto small text-muted">&copy; ${new Date().getFullYear()} Ruzan Sasuri</div>
                </div>
            </div>
        </footer>
    `;

    document.querySelector('main').insertAdjacentHTML('afterend', footer);
}

document.addEventListener('DOMContentLoaded', loadFooter);