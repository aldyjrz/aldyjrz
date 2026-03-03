<script setup>
import { onMounted, ref } from "vue";

const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:3001";

const loading = ref(true);
const saving = ref(false);
const error = ref("");
const success = ref("");
const photoUploading = ref(false);
const data = ref({
  profile: {},
  projects: [],
  skills: [],
  experience: [],
  contact: {}
});

const form = ref(JSON.parse(JSON.stringify(data.value)));

async function loadPortfolio() {
  loading.value = true;
  error.value = "";
  try {
    const res = await fetch(`${apiBase}/api/portfolio`);
    if (!res.ok) throw new Error("Failed to load data");
    data.value = await res.json();
    form.value = JSON.parse(JSON.stringify(data.value));
  } catch (err) {
    error.value = err.message || "Something went wrong";
  } finally {
    loading.value = false;
  }
}

function addProject() {
  form.value.projects.push({
    title: "",
    description: "",
    tech: [],
    link: ""
  });
}

function removeProject(index) {
  form.value.projects.splice(index, 1);
}

function addExperience() {
  form.value.experience.push({
    company: "",
    role: "",
    period: "",
    details: ""
  });
}

function removeExperience(index) {
  form.value.experience.splice(index, 1);
}

function parseTech(value, index) {
  form.value.projects[index].tech = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function skillsString() {
  return form.value.skills.join(", ");
}

function setSkills(value) {
  form.value.skills = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function saveAll() {
  saving.value = true;
  error.value = "";
  success.value = "";
  try {
    const res = await fetch(`${apiBase}/api/portfolio`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form.value)
    });
    if (!res.ok) throw new Error("Failed to save data");
    data.value = await res.json();
    form.value = JSON.parse(JSON.stringify(data.value));
    success.value = "Saved successfully";
  } catch (err) {
    error.value = err.message || "Something went wrong";
  } finally {
    saving.value = false;
    setTimeout(() => (success.value = ""), 3000);
  }
}

async function uploadPhoto(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  photoUploading.value = true;
  error.value = "";
  success.value = "";
  try {
    const formData = new FormData();
    formData.append("photo", file);
    const res = await fetch(`${apiBase}/api/profile/photo`, {
      method: "POST",
      body: formData
    });
    if (!res.ok) throw new Error("Failed to upload photo");
    const payload = await res.json();
    form.value.profile.photo = payload.photo;
    success.value = "Photo updated";
  } catch (err) {
    error.value = err.message || "Something went wrong";
  } finally {
    photoUploading.value = false;
    setTimeout(() => (success.value = ""), 3000);
  }
}

onMounted(loadPortfolio);
</script>

<template>
  <div class="page">
    <header class="topbar">
      <div>
        <p class="tag">Admin</p>
        <h1>Portfolio Editor</h1>
      </div>
      <a class="ghost" href="/index.html">View Site</a>
    </header>

    <section class="admin">
      <div class="admin-grid">
        <div class="admin-card">
          <h4>Profile</h4>
          <label>
            Name
            <input v-model="form.profile.name" type="text" />
          </label>
          <label>
            Role
            <input v-model="form.profile.role" type="text" />
          </label>
          <label>
            Summary
            <textarea v-model="form.profile.summary" rows="3"></textarea>
          </label>
          <label>
            Location
            <input v-model="form.profile.location" type="text" />
          </label>
          <label>
            Email
            <input v-model="form.profile.email" type="email" />
          </label>
          <label class="upload">
            Profile Photo
            <input type="file" accept="image/*" @change="uploadPhoto" />
          </label>
          <p class="muted" v-if="photoUploading">Uploading photo...</p>
        </div>

        <div class="admin-card">
          <h4>Projects</h4>
          <div v-for="(project, index) in form.projects" :key="index" class="admin-block">
            <label>
              Title
              <input v-model="project.title" type="text" />
            </label>
            <label>
              Description
              <textarea v-model="project.description" rows="3"></textarea>
            </label>
            <label>
              Tech (comma separated)
              <input
                :value="project.tech?.join(', ')"
                type="text"
                @input="parseTech($event.target.value, index)"
              />
            </label>
            <label>
              Link
              <input v-model="project.link" type="url" />
            </label>
            <button class="danger" @click="removeProject(index)">Remove</button>
          </div>
          <button class="ghost" @click="addProject">Add Project</button>
        </div>

        <div class="admin-card">
          <h4>Skills</h4>
          <label>
            Skills (comma separated)
            <textarea :value="skillsString()" rows="3" @input="setSkills($event.target.value)"></textarea>
          </label>
        </div>

        <div class="admin-card">
          <h4>Experience</h4>
          <div v-for="(item, index) in form.experience" :key="index" class="admin-block">
            <label>
              Company
              <input v-model="item.company" type="text" />
            </label>
            <label>
              Role
              <input v-model="item.role" type="text" />
            </label>
            <label>
              Period
              <input v-model="item.period" type="text" />
            </label>
            <label>
              Details
              <textarea v-model="item.details" rows="3"></textarea>
            </label>
            <button class="danger" @click="removeExperience(index)">Remove</button>
          </div>
          <button class="ghost" @click="addExperience">Add Experience</button>
        </div>

        <div class="admin-card">
          <h4>Contact</h4>
          <label>
            Phone
            <input v-model="form.contact.phone" type="text" />
          </label>
          <label>
            Email
            <input v-model="form.contact.email" type="email" />
          </label>
          <label>
            LinkedIn
            <input v-model="form.contact.linkedin" type="url" />
          </label>
          <label>
            GitHub
            <input v-model="form.contact.github" type="url" />
          </label>
        </div>
      </div>

      <div class="admin-actions">
        <button class="primary" :disabled="saving" @click="saveAll">
          {{ saving ? "Saving..." : "Save All" }}
        </button>
        <span class="muted" v-if="success">{{ success }}</span>
      </div>
    </section>

    <div v-if="loading" class="overlay">Loading...</div>
    <div v-if="error" class="overlay error">{{ error }}</div>
  </div>
</template>

<style scoped>
:global(body) {
  margin: 0;
  font-family: "Work Sans", sans-serif;
  background: radial-gradient(circle at top, #0b1120 0%, #0f172a 55%, #111827 100%);
  color: #e2e8f0;
}

:global(*) {
  box-sizing: border-box;
}

.page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px 80px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.tag {
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 12px;
  color: #60a5fa;
  font-weight: 600;
  margin-bottom: 8px;
}

h1 {
  font-family: "Space Grotesk", sans-serif;
  font-size: 32px;
  margin: 0;
}

.admin {
  background: rgba(15, 23, 42, 0.7);
  border-radius: 24px;
  padding: 28px;
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.admin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 18px;
}

.admin-card {
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 18px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.admin-card h4 {
  margin: 0;
  font-family: "Space Grotesk", sans-serif;
}

label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: #cbd5f5;
}

input,
textarea {
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  background: #0f172a;
  color: #e2e8f0;
  padding: 10px 12px;
  font-family: inherit;
  font-size: 14px;
}

.admin-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.6);
}

.admin-actions {
  margin-top: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.ghost {
  border: 1px solid rgba(96, 165, 250, 0.4);
  background: rgba(15, 23, 42, 0.6);
  color: #93c5fd;
  padding: 10px 16px;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
}

.primary {
  border: none;
  background: #3b82f6;
  color: white;
  padding: 12px 20px;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
}

.danger {
  border: none;
  background: rgba(239, 68, 68, 0.2);
  color: #fecaca;
  padding: 8px 14px;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
}

.muted {
  color: #94a3b8;
  font-size: 13px;
}

.overlay {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(2, 6, 23, 0.8);
  font-size: 18px;
  font-weight: 600;
}

.overlay.error {
  color: #fca5a5;
}
</style>
