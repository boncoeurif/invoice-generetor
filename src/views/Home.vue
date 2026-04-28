<template>
  <div class="home-container">
    <!-- Navigation -->
    <nav class="home-nav">
      <div class="logo">
        <img src="/logo.svg" alt="Invoxa Logo">
        <span>Invoxa</span>
      </div>
      <div class="nav-links">
        <router-link to="/login" class="btn-cta-primary">Get Started</router-link>
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

    <!-- Features -->
    <section id="features" class="features-section">
      <div class="features-grid">
        <div class="feature-card rounded-card">
          <h3>Multi-Item Invoices</h3>
          <p>Add unlimited products or services to a single invoice with dynamic calculations.</p>
        </div>
        <div class="feature-card rounded-card">
          <h3>Instant PDF Export</h3>
          <p>Generate clean, professional PDFs optimized for printing or digital sharing.</p>
        </div>
        <div class="feature-card rounded-card">
          <h3>Real-time Analytics</h3>
          <p>Track your business performance with live charts and automated earnings summaries.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { authStore } from '@/store/authStore'
</script>

<style scoped>
.home-container { min-height: 100vh; background-color: var(--bg-dark); color: #fff; font-family: 'Inter', sans-serif; overflow-x: hidden; }
.text-gradient { background: linear-gradient(90deg, var(--primary-green), var(--color-secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.home-nav { display: flex; justify-content: space-between; align-items: center; padding: 20px 5%; max-width: 1400px; margin: 0 auto; }
.logo { display: flex; align-items: center; gap: 12px; font-size: 1.5rem; font-weight: 800; }
.logo img { height: 35px; }
.btn-cta-primary { background: var(--primary-green); color: #fff; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 700; transition: all 0.3s; }
.hero-section { display: flex; align-items: center; padding: 80px 5%; max-width: 1400px; margin: 0 auto; gap: 60px; }
.hero-content { flex: 1; }
.badge { display: inline-block; padding: 6px 16px; background: rgba(34, 197, 94, 0.1); color: var(--primary-green); border-radius: 20px; font-size: 0.75rem; font-weight: 800; letter-spacing: 0.1em; margin-bottom: 24px; }
.hero-content h1 { font-size: 4rem; font-weight: 900; margin-bottom: 24px; }
.hero-content p { font-size: 1.25rem; color: var(--text-secondary); margin-bottom: 40px; }
.hero-visual { flex: 1; }
.preview-card { background: var(--surface-dark); padding: 10px; border-radius: 16px; box-shadow: 0 40px 100px rgba(0,0,0,0.5); }
.app-preview-img { width: 100%; border-radius: 8px; }
.features-section { padding: 100px 5%; background: rgba(255,255,255,0.02); }
.features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; max-width: 1200px; margin: 0 auto; }
.feature-card { background: var(--bg-dark); padding: 40px; border: 1px solid rgba(255,255,255,0.05); }
@media (max-width: 1024px) { .hero-section { flex-direction: column; text-align: center; } .hero-visual { display: none; } }
</style>
