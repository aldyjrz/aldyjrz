<script setup>
import { onMounted, ref } from "vue";

const githubUser = "aldyjrz";

const data = ref({
  profile: {
    name: "Aldi Pranata",
    role: "Full-Stack Developer",
    summary:
      "Programmer who loves crafting clean, performant web experiences. Focused on PHP Framework / Native, Vue, Node.js, and modern tooling.",
    location: "Indonesia",
    email: "aldyjrz@gmail.com",
  },
  projects: [
    {
      title: "Islamic App",
      description:
        "Responsive mobile-first Islamic app featuring prayer times, Adzan scheduler (Aladhan API), and Quran recitation with audio playback.",
      tech: ["Next.js", "Aladhan API", "Al-Quran Cloud API"],
      link: "https://github.com/aldyjrz",
    },
    {
      title: "Portfolio Website",
      description:
        "This portfolio — a dark-themed Vue 3 + Vite SPA deployed on GitHub Pages with live GitHub integration.",
      tech: ["Vue 3", "Vite", "GitHub Pages"],
      link: "https://aldyjrz.github.io",
    },
  ],
  skills: [
    "PHP", "Laravel", "CodeIgniter", "MySQL", "PostgreSQL",
    "JavaScript", "TypeScript", "Vue 3", "React", "Next.js",
    "Node.js", "Express", "REST API", "HTML5", "CSS3",
    "Git", "GitHub Actions", "Vite",
  ],
  experience: [
    {
      company: "PT. Putraduta Buanasentosa",
      role: "Programmer",
      period: "2021 – 2026",
      details:
        "Building web and mobile apps. Maintaining and optimizing legacy projects. Specialising in PHP (CodeIgniter, Laravel).",
    },
    {
      company: "Self-employed",
      role: "Freelance Full-Stack Developer",
      period: "2017 – Present",
      details:
        "Building web apps and APIs for clients. Specialising in Web Development.",
    },
  ],
  contact: {
    phone: "+62 812-0000-0000",
    email: "aldyjrz@gmail.com",
    linkedin: "https://www.linkedin.com/in/aldi-pranata-1337elite/",
    github: "https://github.com/aldyjrz",
  },
});

const github = ref({ profile: null, repos: [], error: "" });

async function loadGithub() {
  try {
    const [profileRes, repoRes] = await Promise.all([
      fetch(`https://api.github.com/users/${githubUser}`, {
        headers: { Accept: "application/vnd.github+json" },
      }),
      fetch(
        `https://api.github.com/users/${githubUser}/repos?sort=updated&per_page=6`,
        { headers: { Accept: "application/vnd.github+json" } }
      ),
    ]);
    if (!profileRes.ok) throw new Error("GitHub profile unavailable");
    github.value.profile = await profileRes.json();
    if (repoRes.ok) github.value.repos = await repoRes.json();
  } catch (err) {
    github.value.error = err.message || "GitHub data unavailable";
  }
}

onMounted(loadGithub);
</script>

<template>
  <div class="page">
    <!-- Hero -->
    <header class="hero">
      <div class="hero-card">
        <p class="tag">Portfolio</p>
        <h1>{{ data.profile.name }}</h1>
        <h2>{{ data.profile.role }}</h2>
        <p class="summary">{{ data.profile.summary }}</p>
        <div class="meta">
          <span>{{ data.profile.location }}</span>
          <span>{{ data.profile.email }}</span>
        </div>
        <div class="hero-actions">
          <a href="https://github.com/aldyjrz" target="_blank" rel="noreferrer" class="btn btn-primary">GitHub</a>
          <a href="mailto:aldyjrz@gmail.com" class="btn btn-ghost">Contact</a>
        </div>
      </div>
      <div class="hero-accent">
        <div class="avatar-ring">
          <img v-if="github.profile" :src="github.profile.avatar_url" alt="Profile photo" class="avatar-img" />
          <div v-else class="avatar-fallback">
            <span>{{ data.profile.name?.[0] || "A" }}</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Projects -->
    <section class="section">
      <div class="section-title">
        <span class="section-label">Work</span>
        <h3>Projects</h3>
        <p>Selected projects and case studies.</p>
      </div>
      <p class="nda-note">
        🔒 Several projects built during my time at PT. Putraduta Buanasentosa are not publicly listed
        due to company NDA and proprietary agreements.
      </p>
      <div class="grid">
        <article v-for="project in data.projects" :key="project.title" class="card">
          <div class="card-top">
            <h4>{{ project.title }}</h4>
            <a v-if="project.link" :href="project.link" target="_blank" rel="noreferrer" class="card-link">Visit ↗</a>
          </div>
          <p>{{ project.description }}</p>
          <div class="chips">
            <span v-for="tech in project.tech" :key="tech">{{ tech }}</span>
          </div>
        </article>

        <!-- Private / NDA projects -->
        <article class="card card-private">
          <div class="card-top">
            <h4>Internal Survey System</h4>
            <span class="badge-private">Private</span>
          </div>
          <p>Internal survey system for internal employee.</p>
          <div class="chips">
            <span>PHP</span><span>CodeIgniter</span><span>MySQL</span>
          </div>
        </article>
        <article class="card card-private">
          <div class="card-top">
            <h4>NPS</h4>
            <span class="badge-private">Private</span>
          </div>
          <p>Web-based application for net promoter score. Used for internal employee.</p>
          <div class="chips">
            <span>PHP</span><span>Codeigniter</span><span>MySQL</span>
          </div>
        </article>
        <article class="card card-private">
          <div class="card-top">
            <h4>Record Management System</h4>
            <span class="badge-private">Private</span>
          </div>
          <p>Web-based application for managing records. Used for internal employee.</p>
          <div class="chips">
            <span>PHP</span><span>PHP</span><span>REST API</span>
          </div>
        </article>
      </div>
    </section>

    <!-- Skills -->
    <section class="section">
      <div class="section-title">
        <span class="section-label">Stack</span>
        <h3>Skills</h3>
        <p>Technologies and tools I work with.</p>
      </div>
      <div class="chips skills-wrap">
        <span v-for="skill in data.skills" :key="skill">{{ skill }}</span>
      </div>
    </section>

    <!-- Experience -->
    <section class="section">
      <div class="section-title">
        <span class="section-label">History</span>
        <h3>Experience</h3>
        <p>Where I have created impact.</p>
      </div>
      <div class="timeline">
        <div v-for="item in data.experience" :key="item.company + item.role" class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <h4>{{ item.role }}</h4>
            <p class="company">{{ item.company }} &bull; {{ item.period }}</p>
            <p class="details">{{ item.details }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- GitHub -->
    <section class="section">
      <div class="section-title">
        <span class="section-label">Open Source</span>
        <h3>GitHub</h3>
        <p>Live profile and latest repositories.</p>
      </div>
      <div v-if="github.profile" class="github-profile">
        <img :src="github.profile.avatar_url" alt="GitHub avatar" />
        <div>
          <h4>{{ github.profile.name || github.profile.login }}</h4>
          <p class="muted">{{ github.profile.bio }}</p>
          <div class="github-stats">
            <span>{{ github.profile.public_repos }} repos</span>
            <span>{{ github.profile.followers }} followers</span>
            <span>{{ github.profile.following }} following</span>
          </div>
          <a :href="github.profile.html_url" target="_blank" rel="noreferrer" class="gh-link">
            github.com/{{ githubUser }} ↗
          </a>
        </div>
      </div>
      <p v-else-if="github.error" class="muted">{{ github.error }}</p>
      <div class="grid" v-if="github.repos.length">
        <article v-for="repo in github.repos" :key="repo.id" class="card">
          <div class="card-top">
            <h4>{{ repo.name }}</h4>
            <a :href="repo.html_url" target="_blank" rel="noreferrer" class="card-link">View ↗</a>
          </div>
          <p>{{ repo.description || "No description yet." }}</p>
          <div class="chips">
            <span v-if="repo.language">{{ repo.language }}</span>
            <span v-if="repo.stargazers_count">★ {{ repo.stargazers_count }}</span>
            <span v-if="repo.forks_count">⑂ {{ repo.forks_count }}</span>
          </div>
        </article>
      </div>
    </section>

    <!-- Contact -->
    <section class="section contact-section">
      <div class="section-title">
        <span class="section-label">Let's Talk</span>
        <h3>Contact</h3>
        <p>Let's build something together.</p>
      </div>
      <div class="contact-grid">
        <a :href="`tel:${data.contact.phone.replace(/\s|-/g, '')}`" class="contact-item">
          <span class="contact-label">Phone</span>
          <strong>{{ data.contact.phone }}</strong>
        </a>
        <a :href="`mailto:${data.contact.email}`" class="contact-item">
          <span class="contact-label">Email</span>
          <strong>{{ data.contact.email }}</strong>
        </a>
        <a :href="data.contact.linkedin" target="_blank" rel="noreferrer" class="contact-item">
          <span class="contact-label">LinkedIn</span>
          <strong>Aldi Pranata↗</strong>
        </a>
        <a :href="data.contact.github" target="_blank" rel="noreferrer" class="contact-item">
          <span class="contact-label">GitHub</span>
          <strong>github.com/aldyjrz ↗</strong>
        </a>
      </div>
    </section>

    <footer class="footer">
      <p>Built with Vue 3 + Vite &middot; Deployed on GitHub Pages</p>
    </footer>
  </div>
</template>

<style scoped>
:global(*) { box-sizing: border-box; }

:global(body) {
  margin: 0;
  font-family: "Work Sans", sans-serif;
  background: #111;
  color: #d4d4d4;
  min-height: 100vh;
}

.page {
  max-width: 1060px;
  margin: 0 auto;
  padding: 60px 24px 100px;
  display: flex;
  flex-direction: column;
  gap: 72px;
}

/* Hero */
.hero {
  display: grid;
  grid-template-columns: 1.3fr 0.7fr;
  gap: 20px;
  align-items: start;
}

.hero-card {
  padding: 36px 40px;
  border-radius: 8px;
  border: 1px solid #222;
  background: #191919;
}

.hero-accent {
  border-radius: 8px;
  background: #161616;
  border: 1px solid #222;
  display: grid;
  place-items: center;
  min-height: 250px;
}

.avatar-ring {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  border: 1px solid #333;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.avatar-fallback {
  width: 100%;
  height: 100%;
  background: #222;
  display: grid;
  place-items: center;
  font-family: "Space Grotesk", sans-serif;
  font-size: 42px;
  color: #666;
}

.tag {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #555;
  margin-bottom: 14px;
}

h1 {
  font-family: "Space Grotesk", sans-serif;
  font-size: 38px;
  margin: 0 0 6px;
  color: #ebebeb;
  line-height: 1.2;
}

h2 {
  font-size: 17px;
  margin: 0 0 14px;
  color: #777;
  font-weight: 400;
}

.summary {
  font-size: 14.5px;
  line-height: 1.7;
  margin: 0 0 18px;
  color: #888;
}

.meta {
  display: flex;
  gap: 18px;
  font-size: 13px;
  color: #555;
  margin-bottom: 22px;
}

.hero-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  padding: 8px 18px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.12s, border-color 0.12s, color 0.12s;
}

.btn-primary {
  background: #e8e8e8;
  color: #111;
  border: 1px solid #e8e8e8;
}
.btn-primary:hover { background: #fff; border-color: #fff; }

.btn-ghost {
  background: transparent;
  color: #999;
  border: 1px solid #2e2e2e;
}
.btn-ghost:hover { border-color: #555; color: #ccc; }

/* Sections */
.section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-title {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.section-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.8px;
  text-transform: uppercase;
  color: #444;
  margin-bottom: 4px;
}

.section-title h3 {
  font-family: "Space Grotesk", sans-serif;
  font-size: 24px;
  margin: 0;
  color: #ddd;
}

.section-title p {
  margin: 0;
  color: #555;
  font-size: 14px;
}

/* Cards */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 14px;
}

.card {
  background: #191919;
  padding: 20px 22px;
  border-radius: 8px;
  border: 1px solid #222;
  transition: border-color 0.15s;
}
.card:hover { border-color: #3a3a3a; }

.card-private {
  opacity: 0.6;
  border-style: dashed;
}
.card-private:hover { opacity: 0.8; }

.badge-private {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #555;
  border: 1px solid #2e2e2e;
  padding: 2px 8px;
  border-radius: 4px;
  white-space: nowrap;
}

.nda-note {
  margin: 0;
  font-size: 13px;
  color: #555;
  border-left: 2px solid #2a2a2a;
  padding-left: 12px;
  line-height: 1.6;
}


.card-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.card-top h4 {
  margin: 0;
  font-family: "Space Grotesk", sans-serif;
  font-size: 15px;
  color: #ddd;
}

.card-link {
  color: #666;
  text-decoration: none;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  transition: color 0.12s;
}
.card-link:hover { color: #bbb; }

.card p {
  color: #777;
  margin: 0 0 14px;
  font-size: 13.5px;
  line-height: 1.6;
}

/* Chips */
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chips span {
  background: #1e1e1e;
  color: #777;
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 11.5px;
  font-weight: 500;
  border: 1px solid #2a2a2a;
}

.skills-wrap span {
  cursor: default;
  transition: border-color 0.12s, color 0.12s;
}
.skills-wrap span:hover {
  border-color: #444;
  color: #bbb;
}

/* Timeline */
.timeline {
  display: flex;
  flex-direction: column;
  padding-left: 16px;
  border-left: 1px solid #252525;
}

.timeline-item {
  display: flex;
  gap: 18px;
  padding-bottom: 26px;
}

.timeline-dot {
  width: 8px;
  height: 8px;
  background: #3a3a3a;
  border-radius: 50%;
  margin-left: -20px;
  margin-top: 7px;
  flex-shrink: 0;
}

.timeline-content h4 {
  margin: 0 0 4px;
  font-family: "Space Grotesk", sans-serif;
  font-size: 16px;
  color: #ddd;
}

.company {
  margin: 0 0 8px;
  color: #555;
  font-size: 13px;
}

.details {
  color: #777;
  font-size: 13.5px;
  line-height: 1.65;
  margin: 0;
}

/* GitHub */
.github-profile {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
  align-items: center;
  background: #191919;
  border-radius: 8px;
  padding: 18px 20px;
  border: 1px solid #222;
}

.github-profile img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 1px solid #2e2e2e;
}

.github-profile h4 {
  margin: 0 0 4px;
  font-family: "Space Grotesk", sans-serif;
  font-size: 16px;
  color: #ddd;
}

.github-stats {
  display: flex;
  gap: 14px;
  font-size: 12.5px;
  color: #555;
  margin: 6px 0;
  flex-wrap: wrap;
}

.gh-link {
  color: #666;
  text-decoration: none;
  font-size: 13px;
  transition: color 0.12s;
}
.gh-link:hover { color: #bbb; }

.muted { color: #555; font-size: 13.5px; }

/* Contact */
.contact-section {
  background: #191919;
  padding: 28px 32px;
  border-radius: 8px;
  border: 1px solid #222;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.contact-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 14px 16px;
  background: #141414;
  border-radius: 6px;
  border: 1px solid #1e1e1e;
  text-decoration: none;
  transition: border-color 0.12s;
}
.contact-item:hover { border-color: #383838; }

.contact-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: #444;
  font-weight: 700;
}

.contact-item strong {
  font-size: 13.5px;
  color: #aaa;
  font-weight: 500;
}

/* Footer */
.footer {
  text-align: center;
  color: #2e2e2e;
  font-size: 12px;
  padding-top: 14px;
  border-top: 1px solid #1c1c1c;
}

/* Animations */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Responsive */
@media (max-width: 860px) {
  .hero { grid-template-columns: 1fr; }
  .hero-accent { min-height: 160px; }
  h1 { font-size: 32px; }
  .github-profile { grid-template-columns: 1fr; text-align: center; }
  .github-stats { justify-content: center; }
}

@media (max-width: 520px) {
  .page { padding: 32px 16px 60px; gap: 52px; }
  h1 { font-size: 26px; }
  .section-title h3 { font-size: 20px; }
  .hero-card { padding: 24px; }
}
</style>
