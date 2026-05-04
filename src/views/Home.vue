<template>
  <div class="home-container">
    <div class="bg-glow"></div>
    
    <!-- Navigation -->
    <nav class="home-nav">
      <div class="logo">
        <img src="/logo.svg" alt="Invoxa Logo">
        <span>Invoxa</span>
      </div>
      <div class="nav-links">
        <router-link to="/login" class="btn-cta-outline">{{ langStore.t('login') }}</router-link>
        <router-link to="/login" class="btn-cta-primary small">{{ langStore.t('getStarted') }}</router-link>
      </div>
    </nav>

    <!-- Hero Section -->
    <header class="hero-section">
      <div class="hero-content">
        <div class="badge">
          <span class="pulse-dot"></span>
          {{ langStore.t('proInvoicing') }}
        </div>
        <h1>{{ langStore.t('homeTitle') }} <span class="text-gradient">{{ langStore.t('homeTitleSuffix') }}</span></h1>
        <p>{{ langStore.t('homeSubtitle') }}</p>
        
        <div class="cta-group">
          <router-link to="/login" class="btn-cta-primary">
            {{ langStore.t('getStartedFree') }}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </router-link>
          <div class="trust-badge">
            <div class="avatars">
              <div class="avatar" style="background-color: #3b82f6;"></div>
              <div class="avatar" style="background-color: #10b981;"></div>
              <div class="avatar" style="background-color: #f59e0b;"></div>
            </div>
            <span>{{ langStore.t('trustedBy') }}</span>
          </div>
        </div>
      </div>
      
      <div class="hero-visual">
        <div class="visual-wrapper">
          <div class="floating-card c1">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="green"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <span>{{ langStore.t('paidSuccess') }}</span>
          </div>
          <div class="floating-card c2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="blue"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            <span>{{ langStore.currency }}4,250.00</span>
          </div>
          <div class="preview-card">
            <div class="preview-header">
              <div class="dot red"></div>
              <div class="dot yellow"></div>
              <div class="dot green"></div>
            </div>
            <img src="/logo2.png" alt="App Preview" class="app-preview-img">
          </div>
        </div>
      </div>
    </header>

    <!-- Features -->
    <section id="features" class="features-section">
      <div class="section-title">
        <h2>{{ langStore.t('everythingNeed') }} <span class="text-gradient">{{ langStore.t('grow') }}</span></h2>
        <p>{{ langStore.t('builtForSpeed') }}</p>
      </div>
      <div class="features-grid">
        <div class="feature-card">
          <div class="f-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          </div>
          <h3>{{ langStore.t('feature1Title') }}</h3>
          <p>{{ langStore.t('feature1Desc') }}</p>
        </div>
        <div class="feature-card">
          <div class="f-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          </div>
          <h3>{{ langStore.t('feature2Title') }}</h3>
          <p>{{ langStore.t('feature2Desc') }}</p>
        </div>
        <div class="feature-card">
          <div class="f-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
          </div>
          <h3>{{ langStore.t('feature3Title') }}</h3>
          <p>{{ langStore.t('feature3Desc') }}</p>
        </div>
      </div>
    </section>

    <footer class="home-footer">
      <p>&copy; 2026 Invoxa. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { authStore } from '@/store/authStore'
import { langStore } from '@/store/languageStore'
</script>

<style scoped>
.home-container { 
  min-height: 100vh; 
  background-color: var(--bg-dark); 
  color: #fff; 
  font-family: 'Inter', sans-serif; 
  overflow-x: hidden; 
  position: relative;
}

.bg-glow {
  position: absolute;
  top: -100px;
  right: -100px;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(34, 197, 94, 0.08) 0%, rgba(34, 197, 94, 0) 70%);
  z-index: 0;
  pointer-events: none;
}

.text-gradient { background: linear-gradient(90deg, var(--primary-green), #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

.home-nav { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  padding: 30px 5%; 
  max-width: 1400px; 
  margin: 0 auto; 
  position: relative;
  z-index: 10;
}
.logo { display: flex; align-items: center; gap: 12px; font-size: 1.75rem; font-weight: 900; letter-spacing: -0.02em; }
.logo img { height: 40px; }

.nav-links { display: flex; gap: 20px; align-items: center; }

.btn-cta-primary { 
  background: var(--primary-green); 
  color: #fff; 
  padding: 16px 32px; 
  border-radius: 14px; 
  text-decoration: none; 
  font-weight: 800; 
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
  display: inline-flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 10px 25px rgba(34, 197, 94, 0.3);
}
.btn-cta-primary:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(34, 197, 94, 0.4); filter: brightness(1.1); }
.btn-cta-primary.small { padding: 10px 20px; font-size: 0.9rem; }

.btn-cta-outline {
  color: #fff;
  text-decoration: none;
  font-weight: 700;
  padding: 10px 20px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.1);
  transition: all 0.2s;
}
.btn-cta-outline:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.2); }

.hero-section { display: flex; align-items: center; padding: 60px 5% 100px; max-width: 1400px; margin: 0 auto; gap: 80px; position: relative; z-index: 1; }
.hero-content { flex: 1.2; }

.badge { 
  display: inline-flex; 
  align-items: center; 
  gap: 10px;
  padding: 8px 16px; 
  background: rgba(34, 197, 94, 0.1); 
  color: var(--primary-green); 
  border-radius: 30px; 
  font-size: 0.75rem; 
  font-weight: 800; 
  letter-spacing: 0.1em; 
  margin-bottom: 32px; 
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: var(--primary-green);
  border-radius: 50%;
  position: relative;
}
.pulse-dot::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background: inherit;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(3); opacity: 0; }
}

.hero-content h1 { 
  font-size: clamp(2.2rem, 8vw, 4.5rem); 
  font-weight: 900; 
  margin-bottom: 24px; 
  line-height: 1.1; 
  letter-spacing: -0.03em; 
  word-wrap: break-word;
  overflow-wrap: break-word;
}
.hero-content p { font-size: clamp(1rem, 3vw, 1.35rem); color: var(--text-secondary); margin-bottom: 48px; line-height: 1.6; max-width: 600px; }

.cta-group { display: flex; flex-direction: column; gap: 24px; align-items: flex-start; }

.trust-badge { display: flex; align-items: center; gap: 16px; }
.avatars { display: flex; }
.avatar { width: 32px; height: 32px; border-radius: 50%; border: 2px solid var(--bg-dark); margin-left: -12px; }
.avatar:first-child { margin-left: 0; }
.trust-badge span { font-size: 0.9rem; color: var(--text-secondary); font-weight: 600; }

.hero-visual { flex: 1; position: relative; }
.visual-wrapper { position: relative; }

.preview-card { 
  background: var(--surface-dark); 
  padding: 12px; 
  border-radius: 24px; 
  box-shadow: 0 50px 100px rgba(0,0,0,0.6); 
  border: 1px solid rgba(255,255,255,0.05);
  position: relative;
  z-index: 2;
}
.preview-header { display: flex; gap: 6px; margin-bottom: 12px; padding-left: 8px; }
.dot { width: 8px; height: 8px; border-radius: 50%; }
.dot.red { background: #ff5f56; }
.dot.yellow { background: #ffbd2e; }
.dot.green { background: #27c93f; }

.app-preview-img { width: 100%; border-radius: 12px; }

.floating-card {
  position: absolute;
  background: rgba(17, 24, 39, 0.8);
  backdrop-filter: blur(12px);
  padding: 16px 24px;
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 3;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.floating-card.c1 { top: -40px; right: -20px; }
.floating-card.c2 { bottom: 40px; left: -40px; animation-delay: -3s; }
.floating-card svg.green { color: var(--primary-green); }
.floating-card svg.blue { color: #3b82f6; }
.floating-card span { font-weight: 800; font-size: 0.9rem; }

.features-section { padding: 120px 5%; background: rgba(255,255,255,0.01); border-top: 1px solid rgba(255,255,255,0.03); }
.section-title { text-align: center; margin-bottom: 80px; }
.section-title h2 { font-size: 3rem; font-weight: 900; margin-bottom: 16px; }
.section-title p { color: var(--text-secondary); font-size: 1.2rem; }

.features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 32px; max-width: 1200px; margin: 0 auto; }
.feature-card { 
  background: rgba(255,255,255,0.02); 
  padding: 48px; 
  border-radius: 24px;
  border: 1px solid rgba(255,255,255,0.05); 
  transition: all 0.3s;
}
.feature-card:hover { 
  background: rgba(255,255,255,0.04); 
  transform: translateY(-10px); 
  border-color: rgba(34, 197, 94, 0.2); 
}

.f-icon { 
  width: 50px; 
  height: 50px; 
  background: rgba(34, 197, 94, 0.1); 
  color: var(--primary-green); 
  border-radius: 14px; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  margin-bottom: 24px;
}

.feature-card h3 { font-size: 1.5rem; margin-bottom: 16px; font-weight: 800; }
.feature-card p { color: var(--text-secondary); line-height: 1.6; font-size: 1.05rem; }

.home-footer { padding: 60px 5%; text-align: center; color: var(--text-secondary); font-size: 0.9rem; border-top: 1px solid rgba(255,255,255,0.03); }

@media (max-width: 1024px) { 
  .hero-section { flex-direction: column; text-align: center; padding-top: 20px; padding-bottom: 120px; } 
  .hero-content p { font-size: 1.1rem; margin-bottom: 30px; margin-left: auto; margin-right: auto; }
  .cta-group { align-items: center; }
  .hero-visual { width: 100%; max-width: 500px; margin-top: 40px; }
  .floating-card { display: none; }
}

@media (max-width: 600px) {
  .home-nav { padding: 20px 4%; }
  .home-nav .logo span { display: none; }
  .nav-links { gap: 10px; }
  .btn-cta-primary.small { padding: 8px 15px; font-size: 0.85rem; }
  .btn-cta-outline { padding: 8px 15px; font-size: 0.85rem; }
}
</style>
