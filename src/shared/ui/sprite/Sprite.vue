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

    <symbol id="icon-crown" viewBox="0 0 24 24">
      <path d="M12 2L15 9L22 8L19 15H5L2 8L9 9L12 2Z" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M5 15L5 19C5 19.5523 5.44772 20 6 20H18C18.5523 20 19 19.5523 19 19V15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="12" cy="6" r="1.5" fill="currentColor"/>
      <circle cx="7" cy="8.5" r="1.5" fill="currentColor"/>
      <circle cx="17" cy="8.5" r="1.5" fill="currentColor"/>
    </symbol>

    <symbol id="icon-eye" viewBox="0 0 24 24">
      <path
        d="M12 5c-5 0-9 4.5-9.9 6.2a1 1 0 0 0 0 .8C3 13.7 7 18 12 18s9-4.3 9.9-6.2a1 1 0 0 0 0-.8C21 9.5 17 5 12 5Zm0 11c-3.7 0-6.8-3-7.8-5 1-2 4.1-5 7.8-5s6.8 3 7.8 5c-1 2-4.1 5-7.8 5Zm0-8a3 3 0 1 0 0 6a3 3 0 0 0 0-6Zm0 4a1 1 0 1 1 0-2a1 1 0 0 1 0 2Z"
        fill="currentColor"
      />
    </symbol>

    <symbol id="icon-eye-off" viewBox="0 0 24 24">
      <path
        d="M3.7 2.3a1 1 0 0 0-1.4 1.4l3 3C3.3 8 2.3 9.5 2 10a1 1 0 0 0 0 .8C3 12.7 7 17 12 17c1.8 0 3.4-.5 4.8-1.3l3.5 3.5a1 1 0 0 0 1.4-1.4l-18-18ZM6 10.8c.5-.8 1.5-2 2.9-2.8l1.5 1.5a3 3 0 0 0 4.1 4.1l1.5 1.5A8.4 8.4 0 0 1 12 15c-3.7 0-6.8-3-7.8-5c.2-.5.9-1.6 1.8-2.6Zm6-4.8c3.7 0 6.8 3 7.8 5a12 12 0 0 1-2.2 2.8l1.4 1.4c1.1-1 2-2.3 2.6-3.7a1 1 0 0 0 0-.8C21 8.5 17 4 12 4c-1.2 0-2.3.2-3.4.6l1.6 1.6A7.4 7.4 0 0 1 12 6Z"
        fill="currentColor"
      />
    </symbol>

    <symbol id="icon-message" viewBox="0 0 24 24">
      <path d="M5 4h14a2 2 0 012 2v8a2 2 0 01-2 2H9l-4 4v-4H3a1 1 0 01-1-1V6a2 2 0 012-2z" fill="currentColor" />
    </symbol>

    <symbol id="icon-telegram" viewBox="0 0 24 24">
      <path d="M21.6 3.4 18.9 20c-.2 1.1-.9 1.4-1.9.9l-5.2-3.9-2.5 2.4c-.3.3-.6.5-1 .5l.4-5.5L18.9 5.5c.3-.2 0-.4-.3-.2L7.2 13l-5-1.6C1 11 1 10.2 2.3 9.6l17.9-7c.9-.3 1.7.2 1.4.8z" fill="currentColor" />
    </symbol>

    <symbol id="icon-viber" viewBox="0 0 24 24">
      <path d="M6.2 2h11.6A2.2 2.2 0 0120 4.2v11.6a2.2 2.2 0 01-2.2 2.2h-1.8l-2.7 2.7a1 1 0 01-1.7-.7V18H6.2A2.2 2.2 0 014 15.8V4.2A2.2 2.2 0 016.2 2zm5 4.2c2.9.2 4.6 2 4.7 5 .1.6-.4 1.1-1 1.1h-.1a1 1 0 01-1-.9c-.1-2-1.1-3-3.1-3.1a1 1 0 11.1-2.1zm0 2.6c1.5.1 2.3 1 2.4 2.5 0 .6-.4 1-1 1h-.1a1 1 0 01-1-.9c0-.7-.3-1-1-1.1a1 1 0 11-.3-2zm.1 3.2c.6 0 1 .4 1 1v.6c0 .5-.5 1-1 1-1.8-.1-3.3-1.6-3.4-3.4 0-.6.5-1 1-1h.6c.6 0 1 .4 1 1 0 .4.4.8.8.8z" fill="currentColor" />
    </symbol>

    <symbol id="icon-mail" viewBox="0 0 24 24">
      <path d="M4 5h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2zm0 2v.2l8 4.8 8-4.8V7l-8 4.8L4 7z" fill="currentColor" />
    </symbol>

    <symbol id="icon-download" viewBox="0 0 24 24">
      <path d="M12 2v13m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    </symbol>
  </svg>
</template>

<style lang="css" scoped src="./sprite.scss"></style>
