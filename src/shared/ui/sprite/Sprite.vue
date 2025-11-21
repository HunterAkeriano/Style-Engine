<template>
  <svg class="svg-sprite" aria-hidden="true" focusable="false">
    <symbol id="icon-menu" viewBox="0 0 24 24">
      <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" />
    </symbol>

    <symbol id="icon-close" viewBox="0 0 24 24">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" />
    </symbol>

    <symbol id="icon-arrow-down" viewBox="0 0 16 16">
      <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    </symbol>

    <symbol id="icon-chevron-down" viewBox="0 0 12 12">
      <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    </symbol>

    <symbol id="icon-sun" viewBox="0 0 24 24">
      <path d="M12 4V2M12 22V20M4.93 4.93L3.51 3.51M20.49 20.49L19.07 19.07M4 12H2M22 12H20M4.93 19.07L3.51 20.49M20.49 3.51L19.07 4.93" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="1.5" />
    </symbol>

    <symbol id="icon-moon" viewBox="0 0 24 24">
      <path d="M21 12.79A9 9 0 0 1 11.21 3 7 7 0 1 0 21 12.79Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </symbol>

    <symbol id="icon-logo" viewBox="0 0 40 40">
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#764ba2;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#f093fb;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="32" height="32" rx="8" fill="url(#logo-gradient)" />
      <path d="M12 16 L20 12 L28 16 L28 24 L20 28 L12 24 Z" fill="white" fill-opacity="0.9" />
      <circle cx="20" cy="20" r="4" fill="url(#logo-gradient)" />
    </symbol>

    <symbol id="icon-user" viewBox="0 0 20 20">
      <path d="M10 2a4 4 0 100 8 4 4 0 000-8zM4 14a6 6 0 0112 0v2H4v-2z" fill="currentColor" />
    </symbol>

    <symbol id="icon-logout" viewBox="0 0 20 20">
      <path d="M3 3a2 2 0 012-2h6a2 2 0 012 2v4h2V3a4 4 0 00-4-4H5a4 4 0 00-4 4v14a4 4 0 004 4h6a4 4 0 004-4v-4h-2v4a2 2 0 01-2 2H5a2 2 0 01-2-2V3zm11.293 4.707L17.586 11H7v2h10.586l-3.293 3.293 1.414 1.414L21.414 12l-5.707-5.707-1.414 1.414z" fill="currentColor" />
    </symbol>

    <symbol id="icon-search" viewBox="0 0 20 20">
      <path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" fill="currentColor" />
    </symbol>
  </svg>
</template>

<style lang="css" scoped src="./Sprite.scss"></style>
