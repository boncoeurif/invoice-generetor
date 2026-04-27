<template>
  <div class="home-container">
    <!-- Navigation -->
    <nav class="home-nav">
      <div class="logo">
        <img src="/logo.svg" alt="Invoxa Logo">
        <span>Invoxa</span>
      </div>
      <div class="nav-links">
        <router-link v-if="!authStore.user" to="/login" class="btn-login-nav">Sign In</router-link>
        <router-link v-else to="/" class="btn-dashboard-nav">Go to Dashboard</router-link>
      </div>
    </nav>

    <!-- Hero Section -->
    <header class="hero-section">
      <div class="hero-content">
        <div class="badge">PRO INVOICING MADE SIMPLE</div>
        <h1>Generate Professional Invoices in <span class="text-gradient">Seconds.</span></h1>
        <p>The ultimate invoicing tool for freelancers, small businesses, and professionals. Fast, secure, and ready for deployment.</p>
        
        <div class="cta-group">
          <router-link to="/login" class="btn-cta-primary">
            Get Started for Free
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </router-link>
          <a href="#features" class="btn-cta-secondary">View Features</a>
        </div>
      </div>
      
      <div class="hero-visual">
        <div class="preview-card rounded-card">
          <div class="preview-header">
            <div class="dot red"></div>
            <div class="dot yellow"></div>
            <div class="dot green"></div>
          </div>
          <img src="/logo2.png" alt="App Preview" class="app-preview-img">
        </div>
      </div>
    </header>

    <!-- Features Grid -->
    <section id="features" class="features-section">
      <div class="section-title">
        <h2>Everything you need to <span class="text-gradient">grow.</span></h2>
        <p>Designed to be powerful yet incredibly easy to use.</p>
      </div>

      <div class="features-grid">
        <div class="feature-card rounded-card">
          <div class="feature-icon primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          </div>
          <h3>Multi-Item Invoices</h3>
          <p>Add unlimited products or services to a single invoice with dynamic calculations.</p>
        </div>

        <div class="feature-card rounded-card">
          <div class="feature-icon secondary">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          </div>
          <h3>Instant PDF Export</h3>
          <p>Generate clean, professional PDFs optimized for printing or digital sharing.</p>
        </div>

        <div class="feature-card rounded-card">
          <div class="feature-icon success">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
          </div>
          <h3>Real-time Analytics</h3>
          <p>Track your business performance with live charts and automated earnings summaries.</p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="home-footer">
      <div class="footer-content">
        <p>&copy; 2026 Invoxa Invoicing System. All rights reserved.</p>
        <div class="footer-links">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { authStore } from '@/store/authStore'
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background-color: var(--bg-dark);
  color: #fff;
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
}

.text-gradient {
  background: linear-gradient(90deg, var(--primary-green), var(--color-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Nav */
.home-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 5%;
  max-width: 1400px;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.5rem;
  font-weight: 800;
}

.logo img { height: 35px; }

.btn-login-nav {
  padding: 10px 24px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-login-nav:hover { background: rgba(255,255,255,0.1); }

/* Hero */
.hero-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 80px 5%;
  max-width: 1400px;
  margin: 0 auto;
  gap: 60px;
}

.hero-content { flex: 1; }

.badge {
  display: inline-block;
  padding: 6px 16px;
  background: rgba(34, 197, 94, 0.1);
  color: var(--primary-green);
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  margin-bottom: 24px;
}

.hero-content h1 {
  font-size: 4rem;
  line-height: 1.1;
  font-weight: 900;
  margin-bottom: 24px;
}

.hero-content p {
  font-size: 1.25rem;
  color: var(--text-secondary);
  max-width: 500px;
  line-height: 1.6;
  margin-bottom: 40px;
}

.cta-group {
  display: flex;
  gap: 20px;
}

.btn-cta-primary {
  background: var(--primary-green);
  color: #fff;
  padding: 16px 32px;
  border-radius: 14px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 10px 30px rgba(34, 197, 94, 0.3);
  transition: all 0.3s;
}

.btn-cta-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(34, 197, 94, 0.4);
}

.btn-cta-secondary {
  padding: 16px 32px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.1);
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-cta-secondary:hover { background: rgba(255,255,255,0.05); }

.hero-visual {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.preview-card {
  width: 100%;
  max-width: 600px;
  background: var(--surface-dark);
  padding: 10px;
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 40px 100px rgba(0,0,0,0.5);
  transform: perspective(1000px) rotateY(-10deg);
}

.preview-header {
  display: flex;
  gap: 8px;
  padding: 10px 15px;
}

.dot { width: 10px; height: 10px; border-radius: 50%; }
.dot.red { background: #ff5f56; }
.dot.yellow { background: #ffbd2e; }
.dot.green { background: #27c93f; }

.app-preview-img {
  width: 100%;
  border-radius: 8px;
  filter: brightness(0.9);
}

/* Features */
.features-section {
  padding: 100px 5%;
  background: rgba(255,255,255,0.02);
}

.section-title {
  text-align: center;
  margin-bottom: 60px;
}

.section-title h2 { font-size: 2.5rem; font-weight: 800; margin-bottom: 16px; }
.section-title p { color: var(--text-secondary); font-size: 1.1rem; }

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: var(--bg-dark);
  padding: 40px;
  border: 1px solid rgba(255,255,255,0.05);
  transition: all 0.3s;
}

.feature-card:hover {
  transform: translateY(-10px);
  border-color: var(--primary-green);
}

.feature-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.feature-icon.primary { background: rgba(34, 197, 94, 0.1); color: var(--primary-green); }
.feature-icon.secondary { background: rgba(37, 99, 235, 0.1); color: #2563eb; }
.feature-icon.success { background: rgba(16, 185, 129, 0.1); color: #10b981; }

.feature-card h3 { font-size: 1.25rem; font-weight: 700; margin-bottom: 12px; }
.feature-card p { color: var(--text-secondary); line-height: 1.6; }

/* Footer */
.home-footer {
  padding: 60px 5%;
  border-top: 1px solid rgba(255,255,255,0.05);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.footer-links { display: flex; gap: 30px; }

/* Mobile Adjustments */
@media (max-width: 1024px) {
  .hero-section { flex-direction: column; text-align: center; padding-top: 40px; }
  .hero-content h1 { font-size: 3rem; }
  .hero-content p { margin: 0 auto 40px; }
  .cta-group { justify-content: center; }
  .hero-visual { display: none; }
}

@media (max-width: 480px) {
  .hero-content h1 { font-size: 2.25rem; }
  .cta-group { flex-direction: column; }
}
</style>
