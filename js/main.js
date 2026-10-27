/**
 * AJAY GURJAR - REAL-WORLD PROBLEM SOLVER DEVELOPER PORTFOLIO
 * High-performance interactive engine & real-world simulators
 */

// Sound state
let soundEnabled = false;
let audioCtx = null;

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initSoundToggle();
  initNavigation();
  initTypewriter();
  initWorkstationDeck();
  initMiniGame();
  initCampusRouteSolver();
  initDebtSimplifier();
  initInteractiveTerminal();
  init3DWorkstationTilt();
  initAmbientCanvas();
  initSkillFilters();
  initTimeSplitDonut();
  initContactForm();
  initScrollSpy();
  initCurrentYear();

  // Welcome Toast
  setTimeout(() => {
    showToast('💡 Explore the Live Real-World Problem Solvers on the right!', 4000);
  }, 1200);
});

/* ===================================================================
   1. SOUND EFFECTS SYNTHESIZER (Web Audio API - Zero External Assets)
   =================================================================== */
function initSoundToggle() {
  const soundBtn = document.getElementById('sound-toggle-btn');
  if (!soundBtn) return;

  const onIcon = soundBtn.querySelector('.sound-on-icon');
  const offIcon = soundBtn.querySelector('.sound-off-icon');

  const savedSound = localStorage.getItem('selected-sound');
  if (savedSound === 'enabled') {
    soundEnabled = true;
    if (onIcon && offIcon) {
      onIcon.style.display = 'block';
      offIcon.style.display = 'none';
    }
  } else {
    soundEnabled = false;
    if (onIcon && offIcon) {
      onIcon.style.display = 'none';
      offIcon.style.display = 'block';
    }
  }

  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    localStorage.setItem('selected-sound', soundEnabled ? 'enabled' : 'disabled');

    if (soundEnabled) {
      if (onIcon && offIcon) {
        onIcon.style.display = 'block';
        offIcon.style.display = 'none';
      }
      playSynthBeep(650, 'sine', 0.1);
      showToast('🔊 UI Sound Enabled', 2000);
    } else {
      if (onIcon && offIcon) {
        onIcon.style.display = 'none';
        offIcon.style.display = 'block';
      }
      showToast('🔇 UI Sound Muted', 2000);
    }
  });
}

function playSynthBeep(freq = 520, type = 'sine', duration = 0.08) {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (err) {
    // Audio context fallback
  }
}

/* ===================================================================
   2. THEME SWITCHER (Dark & Light Mode)
   =================================================================== */
function initThemeToggle() {
  const themeButton = document.getElementById('theme-button');
  if (!themeButton) return;

  const savedTheme = localStorage.getItem('selected-theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
  }

  themeButton.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    localStorage.setItem('selected-theme', currentTheme);
    playSynthBeep(740, 'triangle', 0.12);
    showToast(`Switched to ${currentTheme} mode`, 2000);
  });
}

/* ===================================================================
   3. MOBILE NAVIGATION & HEADER SCROLL
   =================================================================== */
function initNavigation() {
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');
  const navLinks = document.querySelectorAll('.nav-link');
  const header = document.getElementById('header');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.add('show-menu');
      playSynthBeep(440, 'sine', 0.05);
    });
  }

  if (navClose && navMenu) {
    navClose.addEventListener('click', () => {
      navMenu.classList.remove('show-menu');
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu) navMenu.classList.remove('show-menu');
      playSynthBeep(520, 'sine', 0.05);
    });
  });

  window.addEventListener('scroll', () => {
    if (header) {
      if (window.scrollY >= 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  });
}

/* ===================================================================
   4. ROBUST TYPEWRITER WITH INSTANT FALLBACK
   =================================================================== */
function initTypewriter() {
  const target = document.getElementById('typewriter');
  if (!target) return;

  const phrases = [
    'C++ Algorithms & System Logic',
    'Interactive Game Loops & 60 FPS Physics',
    'Campus Route & Graph Traversal Optimizers',
    'Peer Financial & Expense Minimizers',
    'Python Scripts & Open Source Tooling'
  ];

  let phraseIndex = 0;
  let charIndex = phrases[0].length;
  let isDeleting = false;
  let typingSpeed = 90;

  target.textContent = phrases[0];

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      target.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 35;
    } else {
      target.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2200; // Pause when complete
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 450;
    }

    setTimeout(type, typingSpeed);
  }

  setTimeout(type, 2000);
}

/* ===================================================================
   5. WORKSTATION DECK TABS (Real-World Simulators Switcher)
   =================================================================== */
function initWorkstationDeck() {
  const tabs = document.querySelectorAll('.deck-tab');
  const panels = document.querySelectorAll('.deck-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetDeck = tab.getAttribute('data-deck');
      switchDeckTab(targetDeck);
    });
  });
}

function switchDeckTab(deckName) {
  const tabs = document.querySelectorAll('.deck-tab');
  const panels = document.querySelectorAll('.deck-panel');

  tabs.forEach(t => {
    if (t.getAttribute('data-deck') === deckName) {
      t.classList.add('active');
    } else {
      t.classList.remove('active');
    }
  });

  panels.forEach(p => {
    if (p.id === `panel-${deckName}`) {
      p.classList.add('active');
    } else {
      p.classList.remove('active');
    }
  });

  playSynthBeep(580, 'sine', 0.08);

  // If switched to terminal, focus input
  if (deckName === 'terminal') {
    const input = document.getElementById('cli-input');
    if (input) setTimeout(() => input.focus(), 100);
  }
}

// Expose switchDeckTab to window for inline onclick handlers
window.switchDeckTab = switchDeckTab;

/* ===================================================================
   6. REAL-WORLD MINI-GAME ENGINE (Scratch 2D Collision Loop Prototype)
   =================================================================== */
function initMiniGame() {
  const canvas = document.getElementById('mini-game-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const scoreDisplay = document.getElementById('game-score-display');
  const fpsDisplay = document.getElementById('game-fps-display');
  const statusDisplay = document.getElementById('game-status-display');
  const jumpBtn = document.getElementById('game-jump-btn');
  const restartBtn = document.getElementById('game-restart-btn');

  // Game state
  let isRunning = false;
  let isGameOver = false;
  let score = 0;
  let lastTime = performance.now();
  let frameCount = 0;
  let fps = 60;
  let fpsTimer = 0;

  // Player physics
  const player = {
    x: 40,
    y: 150,
    w: 24,
    h: 28,
    vy: 0,
    gravity: 0.65,
    jumpPower: -11,
    groundY: 150,
    isJumping: false
  };

  // Obstacles & Collectibles
  let obstacles = [];
  let gems = [];
  let spawnTimer = 0;

  function resetGame() {
    score = 0;
    obstacles = [];
    gems = [];
    player.y = player.groundY;
    player.vy = 0;
    player.isJumping = false;
    isGameOver = false;
    isRunning = true;
    spawnTimer = 0;

    if (scoreDisplay) scoreDisplay.textContent = '0';
    if (statusDisplay) {
      statusDisplay.style.opacity = '0';
    }
    playSynthBeep(440, 'triangle', 0.1);
  }

  function doJump() {
    if (!isRunning) {
      resetGame();
      return;
    }
    if (isGameOver) {
      resetGame();
      return;
    }
    if (!player.isJumping) {
      player.vy = player.jumpPower;
      player.isJumping = true;
      playSynthBeep(620, 'square', 0.08);
    }
  }

  // Keyboard & click controls
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      const gamePanel = document.getElementById('panel-game');
      if (gamePanel && gamePanel.classList.contains('active')) {
        e.preventDefault();
        doJump();
      }
    }
  });

  if (jumpBtn) {
    jumpBtn.addEventListener('click', doJump);
  }

  if (restartBtn) {
    restartBtn.addEventListener('click', resetGame);
  }

  canvas.addEventListener('click', doJump);

  // Main Game Loop (60 FPS)
  function gameLoop(now) {
    const dt = (now - lastTime) / 1000;
    lastTime = now;

    // Calculate FPS
    frameCount++;
    fpsTimer += dt;
    if (fpsTimer >= 1.0) {
      fps = Math.round(frameCount / fpsTimer);
      frameCount = 0;
      fpsTimer = 0;
      if (fpsDisplay) fpsDisplay.textContent = fps;
    }

    if (isRunning && !isGameOver) {
      updateGame();
    }

    drawGame();
    requestAnimationFrame(gameLoop);
  }

  function updateGame() {
    // Player gravity
    player.vy += player.gravity;
    player.y += player.vy;

    if (player.y >= player.groundY) {
      player.y = player.groundY;
      player.vy = 0;
      player.isJumping = false;
    }

    // Spawn obstacles
    spawnTimer++;
    if (spawnTimer % 90 === 0) {
      const isGem = Math.random() > 0.65;
      if (isGem) {
        gems.push({ x: canvas.width + 20, y: 110, r: 8, collected: false });
      } else {
        obstacles.push({ x: canvas.width + 20, y: 154, w: 18, h: 24 });
      }
    }

    // Move obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
      const obs = obstacles[i];
      obs.x -= 4.2;

      // Collision Detection AABB
      if (
        player.x < obs.x + obs.w &&
        player.x + player.w > obs.x &&
        player.y < obs.y + obs.h &&
        player.y + player.h > obs.y
      ) {
        // Game Over!
        isGameOver = true;
        if (statusDisplay) {
          statusDisplay.textContent = 'COLLISION! CLICK RESTART';
          statusDisplay.style.opacity = '1';
        }
        playSynthBeep(220, 'sawtooth', 0.35);
      }

      if (obs.x + obs.w < 0) {
        obstacles.splice(i, 1);
        score += 10;
        if (scoreDisplay) scoreDisplay.textContent = score;
      }
    }

    // Move Gems
    for (let i = gems.length - 1; i >= 0; i--) {
      const gem = gems[i];
      gem.x -= 4.2;

      // Distance collision with player
      const cx = player.x + player.w / 2;
      const cy = player.y + player.h / 2;
      const dist = Math.hypot(cx - gem.x, cy - gem.y);

      if (dist < 22 && !gem.collected) {
        gem.collected = true;
        score += 50;
        if (scoreDisplay) scoreDisplay.textContent = score;
        playSynthBeep(880, 'sine', 0.12);
      }

      if (gem.x < -20 || gem.collected) {
        gems.splice(i, 1);
      }
    }
  }

  function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid background
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Ground plane
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 178);
    ctx.lineTo(canvas.width, 178);
    ctx.stroke();

    // Ground accent dashes
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
    ctx.setLineDash([8, 12]);
    ctx.beginPath();
    ctx.moveTo(0, 186);
    ctx.lineTo(canvas.width, 186);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Player
    ctx.fillStyle = '#00F0FF';
    ctx.shadowColor = '#00F0FF';
    ctx.shadowBlur = 10;
    ctx.fillRect(player.x, player.y, player.w, player.h);

    // Player eyes
    ctx.fillStyle = '#090A16';
    ctx.shadowBlur = 0;
    ctx.fillRect(player.x + 14, player.y + 6, 4, 6);

    // Draw Obstacles
    ctx.fillStyle = '#FF007A';
    ctx.shadowColor = '#FF007A';
    ctx.shadowBlur = 8;
    for (const obs of obstacles) {
      ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
      // Warning glow
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.strokeRect(obs.x + 2, obs.y + 2, obs.w - 4, obs.h - 4);
    }

    // Draw Gems
    ctx.fillStyle = '#00E599';
    ctx.shadowColor = '#00E599';
    ctx.shadowBlur = 10;
    for (const gem of gems) {
      ctx.beginPath();
      ctx.arc(gem.x, gem.y, gem.r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.shadowBlur = 0;
  }

  requestAnimationFrame(gameLoop);
}

/* ===================================================================
   7. REAL-WORLD CAMPUS ROUTE SOLVER (Dijkstra Shortest Path Simulation)
   =================================================================== */
function initCampusRouteSolver() {
  const btnAudi = document.getElementById('btn-route-dijkstra');
  const btnLab = document.getElementById('btn-route-cslab');
  const resultDisplay = document.getElementById('route-result-display');
  const nodes = document.querySelectorAll('.graph-node');
  const edges = document.querySelectorAll('.graph-edges line');

  if (!btnAudi || !btnLab) return;

  function resetGraphVisuals() {
    edges.forEach(e => {
      e.setAttribute('stroke', 'rgba(0, 240, 255, 0.25)');
      e.setAttribute('stroke-width', '2');
    });
    nodes.forEach(n => {
      const c = n.querySelector('circle');
      if (c) c.setAttribute('fill', '#14142B');
    });
  }

  function highlightEdge(id) {
    const edge = document.getElementById(id);
    if (edge) {
      edge.setAttribute('stroke', '#00F0FF');
      edge.setAttribute('stroke-width', '4');
    }
  }

  function highlightNode(id) {
    const node = document.querySelector(`.graph-node[data-node="${id}"]`);
    if (node) {
      const c = node.querySelector('circle');
      if (c) c.setAttribute('fill', '#00F0FF');
    }
  }

  btnAudi.addEventListener('click', () => {
    resetGraphVisuals();
    playSynthBeep(520, 'sine', 0.1);

    // Shortest path: Hostel (A) -> CS Lab (B) -> Library (D) -> Audi (F)
    setTimeout(() => {
      highlightNode('A');
      highlightEdge('edge-A-B');
      highlightNode('B');
      playSynthBeep(600, 'sine', 0.08);
    }, 150);

    setTimeout(() => {
      highlightEdge('edge-B-D');
      highlightNode('D');
      playSynthBeep(720, 'sine', 0.08);
    }, 450);

    setTimeout(() => {
      highlightEdge('edge-D-F');
      highlightNode('F');
      playSynthBeep(880, 'sine', 0.15);

      if (resultDisplay) {
        resultDisplay.innerHTML = `<strong>Dijkstra's Path Solved:</strong> Hostel &rarr; CS Lab &rarr; Library &rarr; Audi &bull; <strong>Time Saved: 4.8 mins (38%)</strong>`;
      }
      showToast('⚡ Dijkstra Shortest Path: 4.8 mins saved', 3500);
    }, 750);
  });

  btnLab.addEventListener('click', () => {
    resetGraphVisuals();
    playSynthBeep(500, 'sine', 0.1);

    // Direct path: Hostel (A) -> CS Lab (B)
    setTimeout(() => {
      highlightNode('A');
      highlightEdge('edge-A-B');
      highlightNode('B');
      playSynthBeep(750, 'sine', 0.12);

      if (resultDisplay) {
        resultDisplay.innerHTML = `<strong>Direct Connection Solved:</strong> Hostel &rarr; CS Lab &bull; <strong>Latency: 2.1 mins (0 congestion)</strong>`;
      }
      showToast('⚡ Direct Connection: 2.1 mins', 2500);
    }, 250);
  });

  // Clicking individual nodes
  nodes.forEach(node => {
    node.addEventListener('click', () => {
      const nodeName = node.getAttribute('data-node');
      playSynthBeep(640, 'triangle', 0.08);
      if (resultDisplay) {
        resultDisplay.innerHTML = `Selected node: <strong>${nodeName}</strong>. Calculating adjacent weights to campus blocks...`;
      }
    });
  });
}

/* ===================================================================
   8. REAL-WORLD DEBT SIMPLIFIER (Greedy Debt Reduction Calculation)
   =================================================================== */
function initDebtSimplifier() {
  const slider = document.getElementById('debt-slider');
  const amountLabel = document.getElementById('debt-amount-label');
  const mathResult = document.getElementById('debt-math-result');

  if (!slider || !amountLabel) return;

  slider.addEventListener('input', () => {
    const val = parseInt(slider.value, 10);
    amountLabel.textContent = val;

    // Simulate real-world calculation
    const bankFeeSavings = Math.round((val * 0.02) + 40);
    if (mathResult) {
      mathResult.innerHTML = `For ₹${val} shared expenses: Eliminates <strong>1 bank transfer</strong> & saves approx <strong>₹${bankFeeSavings}</strong> in gateway overhead.`;
    }
  });

  slider.addEventListener('change', () => {
    playSynthBeep(680, 'sine', 0.08);
  });
}

/* ===================================================================
   9. INTERACTIVE COMMAND LINE TERMINAL
   =================================================================== */
function initInteractiveTerminal() {
  const input = document.getElementById('cli-input');
  const output = document.getElementById('cli-output');
  const chips = document.querySelectorAll('.cli-chip');

  if (!input || !output) return;

  const commands = {
    help: 'Available commands: solve, skills, projects, whoami, clear, contact, date',
    whoami: 'Ajay Gurjar (@ajaygurjar) - Computer Science Student at Newton School of Technology (DY Patil University). Focus: C++, Python, Game Dev & Problem Solving.',
    skills: 'Technical Skills: C++, Python, HTML5, CSS3, JavaScript (ES6+), Scratch 3.0, Git & GitHub, Problem Solving, Communication.',
    projects: 'Featured: 1) Multi-Level 2D Arcade Game (Scratch)  2) Campus Route Dijkstra Optimizer  3) FairShare Debt Simplifier  4) OpenFirst Git Onboarding.',
    solve: '⚡ Real-world challenges solved: 60 FPS Game Loop, Campus Transit Congestion Reduction, Peer Debt Graph Minimization.',
    contact: 'Email: ajaygurjar7227@gmail.com | LinkedIn: linkedin.com/in/ajay-gurjar-a28b0031b | Pune / Jaipur, India',
    date: () => `System Time: ${new Date().toLocaleString()}`,
    clear: () => {
      output.innerHTML = '';
      return null;
    }
  };

  function executeCmd(cmdText) {
    const cleanCmd = cmdText.trim().toLowerCase();
    if (!cleanCmd) return;

    // Append user input line
    const userLine = document.createElement('div');
    userLine.className = 'cli-line';
    userLine.innerHTML = `<span style="color: var(--neon-pink)">ajay@portfolio:~$</span> <strong>${cleanCmd}</strong>`;
    output.appendChild(userLine);

    // Process output
    let response = commands[cleanCmd];
    if (typeof response === 'function') {
      response = response();
    } else if (response === undefined) {
      response = `Command not recognized: '${cleanCmd}'. Type <span class="cmd-highlight">help</span> for assistance.`;
    }

    if (response !== null) {
      const respLine = document.createElement('div');
      respLine.className = 'cli-line';
      respLine.innerHTML = response;
      output.appendChild(respLine);
    }

    output.scrollTop = output.scrollHeight;
    playSynthBeep(520, 'sine', 0.05);
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = input.value;
      input.value = '';
      executeCmd(val);
    }
  });

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      executeCmd(cmd);
    });
  });
}

/* ===================================================================
   10. 3D WORKSTATION TILT & PARALLAX
   =================================================================== */
function init3DWorkstationTilt() {
  const container = document.getElementById('interactive-hero-card');
  if (!container) return;

  const inner = container.querySelector('.workstation-inner');
  const cardShine = document.getElementById('card-shine');

  if (!inner) return;

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 10;

    inner.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`;

    if (cardShine) {
      cardShine.style.opacity = '1';
      cardShine.style.background = `radial-gradient(circle at ${(x / rect.width) * 100}% ${(y / rect.height) * 100}%, rgba(255, 255, 255, 0.18) 0%, transparent 60%)`;
    }
  });

  container.addEventListener('mouseleave', () => {
    inner.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    if (cardShine) {
      cardShine.style.opacity = '0';
    }
  });
}

/* ===================================================================
   11. AMBIENT BACKGROUND CANVAS (Floating Stars & Faint Constellations)
   =================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouse = { x: null, y: null, radius: 140 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  const particleCount = Math.min(Math.floor((width * height) / 20000), 55);
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? 'rgba(0, 240, 255, 0.5)' : 'rgba(139, 92, 246, 0.45)'
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.x -= (dx / dist) * force * 1.5;
          p.y -= (dy / dist) * force * 1.5;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.15 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.7;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ===================================================================
   12. SKILL CATEGORY FILTERS
   =================================================================== */
function initSkillFilters() {
  const tabs = document.querySelectorAll('.skill-tab');
  const cards = document.querySelectorAll('.skill-card');

  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');
      playSynthBeep(520, 'sine', 0.05);

      cards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            card.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 30);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ===================================================================
   13. HOW I SPLIT MY TIME (Interactive Donut & Activity Cards)
   =================================================================== */
function initTimeSplitDonut() {
  const segments = document.querySelectorAll('.donut-segment');
  const activityCards = document.querySelectorAll('.activity-card');
  const centerTitle = document.getElementById('donut-center-title');
  const centerIcon = document.getElementById('donut-center-icon');

  const segmentData = {
    'seg-a': { label: 'Learning Coding (28%)', icon: '💻' },
    'seg-b': { label: 'Continuous Education (20%)', icon: '🎓' },
    'seg-c': { label: 'Open Source (16%)', icon: '🌱' },
    'seg-d': { label: 'Building Network (14%)', icon: '🌐' },
    'seg-e': { label: 'Playing Basketball (12%)', icon: '🏀' },
    'seg-f': { label: 'Meeting People (10%)', icon: '🤝' }
  };

  segments.forEach(seg => {
    const classList = Array.from(seg.classList);
    const key = classList.find(c => c.startsWith('seg-'));

    seg.addEventListener('mouseenter', () => {
      highlightItem(key);
      playSynthBeep(640, 'sine', 0.04);
    });

    seg.addEventListener('click', () => {
      highlightItem(key);
    });
  });

  activityCards.forEach(card => {
    const key = card.getAttribute('data-segment');

    card.addEventListener('mouseenter', () => {
      highlightItem(key);
      playSynthBeep(640, 'sine', 0.04);
    });

    card.addEventListener('click', () => {
      highlightItem(key);
    });
  });

  function highlightItem(key) {
    if (!key || !segmentData[key]) return;

    if (centerTitle) centerTitle.textContent = segmentData[key].label;
    if (centerIcon) centerIcon.textContent = segmentData[key].icon;

    activityCards.forEach(c => {
      if (c.getAttribute('data-segment') === key) {
        c.classList.add('highlighted');
      } else {
        c.classList.remove('highlighted');
      }
    });
  }
}

/* ===================================================================
   14. CONTACT FORM VALIDATION & DIRECT EMAIL LAUNCH
   =================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('form-submit-btn');
  const successBanner = document.getElementById('form-success-banner');

  if (!form) return;

  const nameInput = document.getElementById('user_name');
  const emailInput = document.getElementById('user_email');
  const subjectInput = document.getElementById('user_subject');
  const messageInput = document.getElementById('user_message');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim()) {
      showError(nameInput, true);
      isValid = false;
    } else {
      showError(nameInput, false);
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      showError(emailInput, true);
      isValid = false;
    } else {
      showError(emailInput, false);
    }

    // Validate Message
    if (!messageInput.value.trim()) {
      showError(messageInput, true);
      isValid = false;
    } else {
      showError(messageInput, false);
    }

    if (!isValid) {
      playSynthBeep(300, 'sawtooth', 0.2);
      showToast('⚠️ Please fill in all required fields properly.', 3000);
      return;
    }

    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    const sendIcon = submitBtn.querySelector('.btn-send-icon');

    if (btnText && btnLoader && sendIcon) {
      btnText.textContent = 'Preparing Message...';
      btnLoader.style.display = 'inline-block';
      sendIcon.style.display = 'none';
      submitBtn.disabled = true;
    }

    playSynthBeep(650, 'sine', 0.15);

    setTimeout(() => {
      const subject = encodeURIComponent(subjectInput.value.trim() || `Portfolio Collaboration with ${nameInput.value.trim()}`);
      const body = encodeURIComponent(
        `Hi Ajay,\n\nName: ${nameInput.value.trim()}\nEmail: ${emailInput.value.trim()}\n\nChallenge / Message:\n${messageInput.value.trim()}`
      );

      window.location.href = `mailto:ajaygurjar7227@gmail.com?subject=${subject}&body=${body}`;

      if (btnText && btnLoader && sendIcon) {
        btnText.textContent = 'Message Prepared!';
        btnLoader.style.display = 'none';
        sendIcon.style.display = 'inline-block';
        submitBtn.disabled = false;
      }

      if (successBanner) {
        successBanner.style.display = 'flex';
      }

      playSynthBeep(880, 'sine', 0.2);
      showToast('🎉 Direct mail client launched to ajaygurjar7227@gmail.com', 4000);
      form.reset();
    }, 700);
  });

  function showError(inputElement, hasError) {
    const parentGroup = inputElement.closest('.form-group');
    if (parentGroup) {
      if (hasError) {
        parentGroup.classList.add('has-error');
      } else {
        parentGroup.classList.remove('has-error');
      }
    }
  }
}

/* ===================================================================
   15. SCROLL SPY & ACTIVE NAV HIGHLIGHT
   =================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 130;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active-link');
          } else {
            link.classList.remove('active-link');
          }
        });
      }
    });
  });
}

/* ===================================================================
   16. TOAST NOTIFICATION HELPER
   =================================================================== */
function showToast(message, duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

/* ===================================================================
   17. CURRENT YEAR IN FOOTER
   =================================================================== */
function initCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
