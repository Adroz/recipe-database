// Screen Wake Lock API functionality
let wakeLock = null;
let wakeLockEnabled = true;

// Create and inject the wake lock toggle button
function createWakeLockButton() {
  const button = document.createElement('button');
  button.id = 'wake-lock-toggle';
  button.setAttribute('aria-label', 'Toggle screen wake lock');
  button.setAttribute('title', 'Keep screen awake');
  button.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
    background-color: var(--md-primary-fg-color, #ffa000);
    color: white;
    border: none;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s, transform 0.2s;
  `;
  button.innerHTML = '☀️';
  button.addEventListener('click', toggleWakeLock);
  document.body.appendChild(button);
  return button;
}

// Request the wake lock
async function requestWakeLock() {
  if (!('wakeLock' in navigator)) {
    console.log('Wake Lock API not supported');
    return false;
  }

  try {
    wakeLock = await navigator.wakeLock.request('screen');
    wakeLock.addEventListener('release', () => {
      console.log('Wake lock released');
    });
    console.log('Wake lock acquired');
    return true;
  } catch (err) {
    console.log(`Wake lock request failed: ${err.name}, ${err.message}`);
    return false;
  }
}

// Release the wake lock
async function releaseWakeLock() {
  if (wakeLock !== null) {
    await wakeLock.release();
    wakeLock = null;
    console.log('Wake lock released');
  }
}

// Toggle wake lock on/off
async function toggleWakeLock() {
  const button = document.getElementById('wake-lock-toggle');
  
  if (wakeLockEnabled) {
    await releaseWakeLock();
    wakeLockEnabled = false;
    button.innerHTML = '🌙';
    button.setAttribute('title', 'Screen can sleep');
    button.style.opacity = '0.6';
  } else {
    const success = await requestWakeLock();
    if (success) {
      wakeLockEnabled = true;
      button.innerHTML = '☀️';
      button.setAttribute('title', 'Keep screen awake');
      button.style.opacity = '1';
    }
  }
}

// Re-acquire wake lock when page becomes visible again
function handleVisibilityChange() {
  if (wakeLockEnabled && document.visibilityState === 'visible') {
    requestWakeLock();
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
  // Only initialize if Wake Lock API is supported
  if ('wakeLock' in navigator) {
    createWakeLockButton();
    
    // Enable wake lock by default
    await requestWakeLock();
    
    // Re-acquire wake lock when page becomes visible
    document.addEventListener('visibilitychange', handleVisibilityChange);
  }
});
