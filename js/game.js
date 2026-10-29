        // Detectar si es un dispositivo táctil
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // Elementos del DOM
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const startScreen = document.getElementById('startScreen');
        const gameOverScreen = document.getElementById('gameOver');
        const startBtn = document.getElementById('startBtn');
        const restartBtn = document.getElementById('restartBtn');
        const menuBtn = document.getElementById('menuBtn');
        const langBtn = document.getElementById('langBtn');
        const hud = document.getElementById('hud');
        const finalScore = document.getElementById('finalScore');
        const difficultyIndicator = document.getElementById('difficulty');
        const demoOverlay = document.getElementById('demoOverlay');
        const touchControls = document.getElementById('touchControls');
        const crouchButton = document.getElementById('crouchButton');
        const touchIndicator = document.getElementById('touchIndicator');
        const leftButton = document.getElementById('leftButton');
        const rightButton = document.getElementById('rightButton');
        const mobileControlsInfo = document.getElementById('mobileControlsInfo');
        const skinPreview = document.getElementById('skinPreview');
        const previewCtx = skinPreview.getContext('2d');
        const currentMeters = document.getElementById('currentMeters');
        const nextUnlock = document.getElementById('nextUnlock');
        const progressFill = document.getElementById('progressFill');
        const nextSkinInfo = document.getElementById('nextSkinInfo');
        const codeInput = document.getElementById('codeInput');
        const enterCodeBtn = document.getElementById('enterCodeBtn');
        const rainbowSkin = document.getElementById('rainbowSkin');
        const starsContainer = document.getElementById('stars');
        const resetBtn = document.getElementById('resetBtn');
        
        // Elementos de debug
        const debugIndicator = document.getElementById('debugIndicator');
        const debugPanel = document.getElementById('debugPanel');
        const debugAddMeters = document.getElementById('debugAddMeters');
        const debugUnlockAll = document.getElementById('debugUnlockAll');
        const debugGodMode = document.getElementById('debugGodMode');
        const debugDisableGodMode = document.getElementById('debugDisableGodMode');
        const debugClose = document.getElementById('debugClose');
        const debugMeters = document.getElementById('debugMeters');
        const debugSkinsCount = document.getElementById('debugSkinsCount');
        const debugMessage = document.querySelector('.debug-message');
        const godModeStatus = document.getElementById('godModeStatus');

        // Variables del juego
        let gameRunning = false;
        let lastTime = 0;
        let imagesLoaded = false;
        // ----- Demo / attract mode -----
        let demoMode = false;            // true mientras la demo se juega sola
        let demoIdleTimer = null;        // temporizador de inactividad en el menú
        let demoTargetMeters = 0;        // metros a los que el bot se deja morir
        let prevSkinBeforeDemo = null;   // skin a restaurar al salir de la demo
        const DEMO_IDLE_MS = 15000;      // 15 s de inactividad en el menú -> demo
        let currentLanguage = 'en';
        let currentSkin = 'default';
        let unlockedSkins = ['default'];
        let hasPickedSkin = false; // true cuando el jugador elige una skin manualmente
        let highScore = 0;
        let totalMeters = 0;
        let maxMetersReached = 0;
        let rainbowHue = 0;
        
        // Variables de debug
        let debugMode = false;
        let godMode = false;
        
        // Variables para controles
        let keys = {};
        let touchLeft = false;
        let touchRight = false;
        let touchCrouch = false;

        // Sistema de niveles de dificultad
        const difficultyLevels = [
            { threshold: 0, speedMultiplier: 1.0, platformColor: '#4a6572', name: 'x1' },
            { threshold: 100, speedMultiplier: 1.2, platformColor: '#4a6572', name: 'x2' },
            { threshold: 200, speedMultiplier: 1.5, platformColor: '#4a6572', name: 'x3' },
            { threshold: 300, speedMultiplier: 1.8, platformColor: '#3a5f8c', name: 'x4' },
            { threshold: 400, speedMultiplier: 2.2, platformColor: '#3a5f8c', name: 'x5' },
            { threshold: 500, speedMultiplier: 2.7, platformColor: '#3a5f8c', name: 'x6' },
            { threshold: 600, speedMultiplier: 3.3, platformColor: '#3a5f8c', name: 'x7' },
            { threshold: 700, speedMultiplier: 4.0, platformColor: '#8b4513', name: 'x8' },
            { threshold: 800, speedMultiplier: 4.8, platformColor: '#8b4513', name: 'x9' },
            { threshold: 900, speedMultiplier: 5.7, platformColor: '#8b4513', name: 'x10' },
            { threshold: 1000, speedMultiplier: 6.7, platformColor: '#2f4f4f', name: 'x11' },
            { threshold: 1100, speedMultiplier: 7.8, platformColor: '#2f4f4f', name: 'x12' },
            { threshold: 1200, speedMultiplier: 9.0, platformColor: '#2f4f4f', name: 'x13' },
            { threshold: 1300, speedMultiplier: 10.3, platformColor: '#800080', name: 'x14' },
            { threshold: 1400, speedMultiplier: 11.7, platformColor: '#800080', name: 'x15' },
            { threshold: 1500, speedMultiplier: 13.2, platformColor: '#800080', name: 'x16' },
            { threshold: 1600, speedMultiplier: 14.8, platformColor: '#000000', name: 'x17' },
            { threshold: 1700, speedMultiplier: 16.5, platformColor: '#000000', name: 'x18' },
            { threshold: 1800, speedMultiplier: 18.3, platformColor: '#000000', name: 'x19' },
            { threshold: 1900, speedMultiplier: 20.2, platformColor: '#ffffff', name: 'x20' },
            { threshold: 2000, speedMultiplier: 22.2, platformColor: '#ffffff', name: 'x21' },
            { threshold: 2100, speedMultiplier: 24.3, platformColor: '#ffffff', name: 'x22' },
            { threshold: 2200, speedMultiplier: 26.5, platformColor: '#ff0000', name: 'x23' },
            { threshold: 2300, speedMultiplier: 28.8, platformColor: '#ff0000', name: 'x24' },
            { threshold: 2400, speedMultiplier: 31.2, platformColor: '#ff0000', name: 'x25' }
        ];

        let currentDifficultyLevel = 0;

        function createStars() {
            starsContainer.innerHTML = '';
            for (let i = 0; i < 100; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                star.style.width = `${Math.random() * 3 + 1}px`;
                star.style.height = star.style.width;
                star.style.left = `${Math.random() * 100}%`;
                star.style.top = `${Math.random() * 100}%`;
                star.style.animationDelay = `${Math.random() * 3}s`;
                star.style.opacity = Math.random() * 0.7 + 0.3;
                starsContainer.appendChild(star);
            }
        }

        function resizeCanvas() {
            const container = document.getElementById('gameContainer');
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
            if (isTouchDevice && gameRunning) {
                touchControls.style.display = 'flex';
                crouchButton.style.display = 'flex';
                touchIndicator.style.display = 'block';
                mobileControlsInfo.style.display = 'block';
            } else {
                touchControls.style.display = 'none';
                crouchButton.style.display = 'none';
                touchIndicator.style.display = 'none';
                mobileControlsInfo.style.display = 'none';
            }
            if (gameRunning) draw();
        }

        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('orientationchange', resizeCanvas);

        const player = {
            x: 0, y: 0, width: 40, height: 40, vx: 0, vy: 0,
            isOnPlatform: false, isCrouching: false, jumpCharge: 0, maxJumpCharge: 60,
            state: 'default'
        };

        let platforms = [];
        let cosmicDustY = 0;
        let score = 0;
        let cameraY = 0;
        let cosmicDustSpeed = 1.0;

        const GRAVITY = 0.5;
        const BASE_JUMP_FORCE = -15;
        const PLAYER_SPEED = 8;
        const BASE_COSMIC_DUST_SPEED = 1.0;

        const images = {
            starDefault: new Image(), starCrouch: new Image(), starJump: new Image(),
            platform: new Image(), squid: new Image(),
            OGStarDefault: new Image(), OGStarS: new Image(), OGStarG: new Image(),
            VStarDefault: new Image(), VStarS: new Image(), VStarG: new Image(),
            DStarDefault: new Image(), DStarS: new Image(), DStarG: new Image(),
            AStarDefault: new Image(), AStarS: new Image(), AStarG: new Image(),
            Tristar: new Image(),
            // Colaboración Glob Defenders
            GlobDefault: new Image(), GlobG: new Image(), GlobS: new Image(),
            GlobStarDefault: new Image(), GlobStarG: new Image(), GlobStarS: new Image(),
            PGlobStarDefault: new Image(), PGlobStarG: new Image(), PGlobStarS: new Image(),
            AGlobStarDefault: new Image(), AGlobStarG: new Image(), AGlobStarS: new Image()
        };
        ['Glob', 'GlobStar', 'PGlobStar', 'AGlobStar'].forEach(n => {
            ['Default', 'G', 'S'].forEach(p => { images[n + p].src = `assets/Especiales (SJ)/${n}${p}.png`; });
        });

        images.starDefault.src = "assets/StarDefault.png";
        images.starCrouch.src = "assets/StarG.png";
        images.starJump.src = "assets/StarS.png";
        images.platform.src = "assets/Platform.png";
        images.squid.src = "assets/Squid.png";
        images.OGStarDefault.src = "assets/OG-StarDefault.png";
        images.OGStarS.src = "assets/OG-StarS.png";
        images.OGStarG.src = "assets/OG-StarG.png";
        images.VStarDefault.src = "assets/VStarDefault.png";
        images.VStarS.src = "assets/VStarS.png";
        images.VStarG.src = "assets/VStarG.png";
        images.DStarDefault.src = "assets/DStarDefault.png";
        images.DStarS.src = "assets/DStarS.png";
        images.DStarG.src = "assets/DStarG.png";
        images.AStarDefault.src = "assets/AStarDefault.png";
        images.AStarS.src = "assets/AStarS.png";
        images.AStarG.src = "assets/AStarG.png";
        images.Tristar.src = "assets/TrisTar.png";

        let loadedCount = 0;
        const totalImages = Object.keys(images).length;
        
        function checkAllImagesLoaded() {
            loadedCount++;
            if (loadedCount === totalImages) {
                imagesLoaded = true;
                resizeCanvas();
                draw();
            }
        }

        Object.values(images).forEach(img => {
            img.onload = checkAllImagesLoaded;
            img.onerror = () => checkAllImagesLoaded();
        });

        const skinConfig = {
            'default': { type: 'colored', images: { default: 'starDefault', crouch: 'starCrouch', jump: 'starJump' }, filter: 'none' },
            'verde': { type: 'colored', images: { default: 'starDefault', crouch: 'starCrouch', jump: 'starJump' }, filter: 'hue-rotate(80deg) saturate(1.3)', meters: 100 },
            'rosa': { type: 'colored', images: { default: 'starDefault', crouch: 'starCrouch', jump: 'starJump' }, filter: 'hue-rotate(300deg) saturate(1.2)', meters: 200 },
            'naranja': { type: 'colored', images: { default: 'starDefault', crouch: 'starCrouch', jump: 'starJump' }, filter: 'hue-rotate(-20deg) saturate(1.4)', meters: 220 },
            'rojo': { type: 'colored', images: { default: 'starDefault', crouch: 'starCrouch', jump: 'starJump' }, filter: 'hue-rotate(-40deg) saturate(1.5)', meters: 250 },
            'amarillo': { type: 'colored', images: { default: 'starDefault', crouch: 'starCrouch', jump: 'starJump' }, filter: 'hue-rotate(0deg) saturate(1.2)', meters: 280 },
            'azul': { type: 'colored', images: { default: 'starDefault', crouch: 'starCrouch', jump: 'starJump' }, filter: 'hue-rotate(160deg) saturate(1.4)', meters: 300 },
            'marron': { type: 'colored', images: { default: 'starDefault', crouch: 'starCrouch', jump: 'starJump' }, filter: 'hue-rotate(-30deg) brightness(0.7) saturate(0.9)', meters: 350 },
            'cian': { type: 'colored', images: { default: 'starDefault', crouch: 'starCrouch', jump: 'starJump' }, filter: 'hue-rotate(120deg) brightness(1.2)', meters: 380 },
            'pastel': { type: 'colored', images: { default: 'starDefault', crouch: 'starCrouch', jump: 'starJump' }, filter: 'hue-rotate(300deg) saturate(0.8) brightness(1.3)', meters: 400 },
            'bronce': { type: 'colored', images: { default: 'starDefault', crouch: 'starCrouch', jump: 'starJump' }, filter: 'hue-rotate(-20deg) brightness(0.8) saturate(0.8)', meters: 450 },
            'plata': { type: 'colored', images: { default: 'starDefault', crouch: 'starCrouch', jump: 'starJump' }, filter: 'grayscale(1) brightness(1.2)', meters: 650 },
            'oro': { type: 'colored', images: { default: 'starDefault', crouch: 'starCrouch', jump: 'starJump' }, filter: 'hue-rotate(0deg) brightness(1.1) saturate(1.5)', meters: 850 },
            'vacio': { type: 'colored', images: { default: 'starDefault', crouch: 'starCrouch', jump: 'starJump' }, filter: 'grayscale(1) brightness(0.3)', meters: 1000 },
            'negativo': { type: 'colored', images: { default: 'starDefault', crouch: 'starCrouch', jump: 'starJump' }, filter: 'invert(1) hue-rotate(180deg) contrast(1.2)', meters: 1500 },
            'angelical': { type: 'colored', images: { default: 'starDefault', crouch: 'starCrouch', jump: 'starJump' }, filter: 'hue-rotate(160deg) saturate(0.8) brightness(1.4)', meters: 1700 },
            'demoniaco': { type: 'colored', images: { default: 'starDefault', crouch: 'starCrouch', jump: 'starJump' }, filter: 'hue-rotate(-60deg) brightness(0.7) saturate(1.6)', meters: 1950 },
            'power': { type: 'animated', images: { default: 'OGStarDefault', crouch: 'OGStarG', jump: 'OGStarS' }, filter: 'none', meters: 2200 },
            'power_invertido': { type: 'animated', images: { default: 'OGStarDefault', crouch: 'OGStarG', jump: 'OGStarS' }, filter: 'invert(1) hue-rotate(180deg)', meters: 2400 },
            'power_dorado': { type: 'animated', images: { default: 'OGStarDefault', crouch: 'OGStarG', jump: 'OGStarS' }, filter: 'hue-rotate(0deg) brightness(1.2) saturate(1.8)', meters: 2600 },
            'power_rojo': { type: 'animated', images: { default: 'OGStarDefault', crouch: 'OGStarG', jump: 'OGStarS' }, filter: 'hue-rotate(-40deg) saturate(1.6)', meters: 2800 },
            'virtual': { type: 'animated', images: { default: 'VStarDefault', crouch: 'VStarG', jump: 'VStarS' }, filter: 'none', meters: 3000 },
            'virtual_rojo': { type: 'animated', images: { default: 'VStarDefault', crouch: 'VStarG', jump: 'VStarS' }, filter: 'hue-rotate(-40deg) saturate(1.5)', meters: 3200 },
            'purple_virtual': { type: 'animated', images: { default: 'VStarDefault', crouch: 'VStarG', jump: 'VStarS' }, filter: 'hue-rotate(260deg) saturate(1.3) brightness(1.1)', meters: 3400 },
            'virtual_azul': { type: 'animated', images: { default: 'VStarDefault', crouch: 'VStarG', jump: 'VStarS' }, filter: 'hue-rotate(160deg) saturate(1.4)', meters: 3600 },
            'possesed': { type: 'animated', images: { default: 'DStarDefault', crouch: 'DStarG', jump: 'DStarS' }, filter: 'none', meters: 3800 },
            'possesed_invertido': { type: 'animated', images: { default: 'DStarDefault', crouch: 'DStarG', jump: 'DStarS' }, filter: 'invert(1) hue-rotate(180deg)', meters: 4000 },
            'possesed_rosa': { type: 'animated', images: { default: 'DStarDefault', crouch: 'DStarG', jump: 'DStarS' }, filter: 'hue-rotate(300deg) saturate(1.2)', meters: 4200 },
            'possesed_verde': { type: 'animated', images: { default: 'DStarDefault', crouch: 'DStarG', jump: 'DStarS' }, filter: 'hue-rotate(80deg) saturate(1.3)', meters: 4400 },
            'astral': { type: 'animated', images: { default: 'AStarDefault', crouch: 'AStarG', jump: 'AStarS' }, filter: 'none', meters: 4600 },
            'astral_azul': { type: 'animated', images: { default: 'AStarDefault', crouch: 'AStarG', jump: 'AStarS' }, filter: 'hue-rotate(160deg) saturate(1.4)', meters: 4700 },
            'astral_rojo': { type: 'animated', images: { default: 'AStarDefault', crouch: 'AStarG', jump: 'AStarS' }, filter: 'hue-rotate(-40deg) saturate(1.5)', meters: 4800 },
            'astral_invertido': { type: 'animated', images: { default: 'AStarDefault', crouch: 'AStarG', jump: 'AStarS' }, filter: 'invert(1) hue-rotate(180deg)', meters: 4850 },
            'squid': { type: 'static', image: 'squid', filter: 'none', meters: 2025 },
            'squid_rojo': { type: 'static', image: 'squid', filter: 'hue-rotate(-40deg) saturate(1.5)', meters: 4900 },
            'squid_azul': { type: 'static', image: 'squid', filter: 'hue-rotate(160deg) saturate(1.4)', meters: 5000 },
            'squid_verde': { type: 'static', image: 'squid', filter: 'hue-rotate(80deg) saturate(1.3)', meters: 5100 },
            'squid_invertido': { type: 'static', image: 'squid', filter: 'invert(1) hue-rotate(180deg)', meters: 5200 },
            'powered_rainbow': { type: 'animated', images: { default: 'OGStarDefault', crouch: 'OGStarG', jump: 'OGStarS' }, filter: 'rainbow', meters: 6050 },
            'virtual_rainbow': { type: 'animated', images: { default: 'VStarDefault', crouch: 'VStarG', jump: 'VStarS' }, filter: 'rainbow', meters: 6900 },
            'rainbow_matter': { type: 'animated', images: { default: 'DStarDefault', crouch: 'DStarG', jump: 'DStarS' }, filter: 'rainbow', meters: 7750 },
            'angelical_shiny': { type: 'animated', images: { default: 'AStarDefault', crouch: 'AStarG', jump: 'AStarS' }, filter: 'rainbow', meters: 8600 },
            'pink_virtude': { type: 'animated', images: { default: 'VStarDefault', crouch: 'VStarG', jump: 'VStarS' }, filter: 'hue-rotate(320deg) saturate(1.4) brightness(1.1)', code: 'DEBUG' },
            'tristar': { type: 'static', image: 'Tristar', filter: 'none', code: 'PATCHEDBUG' },
            'leal': { type: 'colored', images: { default: 'starDefault', crouch: 'starCrouch', jump: 'starJump' }, filter: 'hue-rotate(-15deg) saturate(1.6)', code: 'WD-001' },
            'galaxia': { type: 'colored', images: { default: 'starDefault', crouch: 'starCrouch', jump: 'starJump' }, filter: 'hue-rotate(140deg) brightness(0.8) saturate(1.2)', code: 'MK-002' },
            'rey': { type: 'colored', images: { default: 'starDefault', crouch: 'starCrouch', jump: 'starJump' }, filter: 'hue-rotate(-50deg) saturate(1.7)', code: 'D3-003' },
            'pinchos': { type: 'colored', images: { default: 'starDefault', crouch: 'starCrouch', jump: 'starJump' }, filter: 'hue-rotate(-25deg) brightness(0.9) saturate(1.4)', code: 'BW-004' },
            'tinta': { type: 'colored', images: { default: 'starDefault', crouch: 'starCrouch', jump: 'starJump' }, filter: 'rainbow', code: 'IC-005' },
            // Colaboración Glob Defenders: se desbloquea al vincular la cuenta de GlD
            'gld_link': { type: 'animated', images: { default: 'GlobDefault', crouch: 'GlobG', jump: 'GlobS' }, filter: 'none', code: 'GLD' },
            'globstar': { type: 'animated', images: { default: 'GlobStarDefault', crouch: 'GlobStarG', jump: 'GlobStarS' }, filter: 'none', code: 'GLD-BOTH' },
            'possesed_globstar': { type: 'animated', images: { default: 'PGlobStarDefault', crouch: 'PGlobStarG', jump: 'PGlobStarS' }, filter: 'none', meters: 5400, requires: 'gld' },
            'angel_globstar': { type: 'animated', images: { default: 'AGlobStarDefault', crouch: 'AGlobStarG', jump: 'AGlobStarS' }, filter: 'none', meters: 5700, requires: 'gld' }
        };

        function getSkinImage(skinId, state) {
            const config = skinConfig[skinId] || skinConfig['default'];
            if (config.type === 'static') return images[config.image];
            if (config.type === 'animated' || config.type === 'colored') {
                if (state === 'crouch') return images[config.images.crouch];
                if (state === 'jump') return images[config.images.jump];
                return images[config.images.default];
            }
            return images.starDefault;
        }

        const validCodes = {
            'WD-001': 'leal', 'MK-002': 'galaxia', 'D3-003': 'rey', 'BW-004': 'pinchos',
            'IC-005': 'tinta', 'PATCHEDBUG': 'tristar', 'KIRBYTE_B1.ST4RJUMP.DEBUGM0D3': 'debug'
        };

        let rainbowTime = 0;
        let chargeBlinkPhase = 0; // fase del parpadeo al cargar supersalto

        function getRainbowFilter() {
            rainbowTime = (rainbowTime + 2) % 360;
            return `hue-rotate(${rainbowTime}deg) saturate(1.5) brightness(1.2)`;
        }

        function updateRainbowSkin() {
            if (rainbowSkin) {
                rainbowHue = (rainbowHue + 2) % 360;
                const img = rainbowSkin.querySelector('.skin-preview-img');
                if (img) img.style.filter = `hue-rotate(${rainbowHue}deg) saturate(1.5) brightness(1.2)`;
            }
            if (currentSkin === 'tinta' || currentSkin === 'powered_rainbow' || currentSkin === 'virtual_rainbow' || 
                currentSkin === 'rainbow_matter' || currentSkin === 'angelical_shiny') updateSkinPreview();
        }

        function setupTouchControls() {
            if (!isTouchDevice) return;
            leftButton.addEventListener('touchstart', (e) => { e.preventDefault(); touchLeft = true; updatePlayerMovement(); });
            leftButton.addEventListener('touchend', (e) => { e.preventDefault(); touchLeft = false; updatePlayerMovement(); });
            rightButton.addEventListener('touchstart', (e) => { e.preventDefault(); touchRight = true; updatePlayerMovement(); });
            rightButton.addEventListener('touchend', (e) => { e.preventDefault(); touchRight = false; updatePlayerMovement(); });
            crouchButton.addEventListener('touchstart', (e) => { e.preventDefault(); touchCrouch = true; startCrouching(); });
            crouchButton.addEventListener('touchend', (e) => { e.preventDefault(); touchCrouch = false; stopCrouching(); });
        }

        function setupKeyboardControls() {
            document.addEventListener('keydown', (e) => {
                keys[e.key] = true;
                if (e.key === ' ' || e.key === 'ArrowDown') startCrouching();
                updatePlayerMovement();
            });
            document.addEventListener('keyup', (e) => {
                keys[e.key] = false;
                if (e.key === ' ' || e.key === 'ArrowDown') stopCrouching();
                updatePlayerMovement();
            });
        }

        function updatePlayerMovement() {
            if (player.isCrouching) { player.vx = 0; return; }
            if ((keys['ArrowLeft'] || keys['a'] || touchLeft) && !(keys['ArrowRight'] || keys['d'] || touchRight)) player.vx = -PLAYER_SPEED;
            else if ((keys['ArrowRight'] || keys['d'] || touchRight) && !(keys['ArrowLeft'] || keys['a'] || touchLeft)) player.vx = PLAYER_SPEED;
            else player.vx = 0;
        }

        function startCrouching() {
            if (player.isOnPlatform && !player.isCrouching) {
                player.isCrouching = true;
                player.state = 'crouch';
                player.jumpCharge = 0;
                player.vx = 0;
            }
        }

        function stopCrouching() {
            if (player.isCrouching) {
                player.isCrouching = false;
                player.state = 'jump';
                const jumpForce = BASE_JUMP_FORCE * (1 + player.jumpCharge / player.maxJumpCharge * 0.5);
                player.vy = jumpForce;
                player.jumpCharge = 0;
                updatePlayerMovement();
            }
        }

        function changeLanguage() {
            currentLanguage = currentLanguage === 'en' ? 'es' : 'en';
            document.querySelectorAll('[data-en]').forEach(el => {
                el.textContent = el.getAttribute(`data-${currentLanguage}`);
            });
            if (debugMessage) debugMessage.textContent = debugMessage.getAttribute(`data-${currentLanguage}`);
            langBtn.textContent = currentLanguage === 'en' ? 'ES' : 'EN';
            updateDifficultyIndicator();
        }

        function setupMenuNavigation() {
            const navButtons = document.querySelectorAll('.nav-btn');
            const menuSections = document.querySelectorAll('.menu-section');
            const backButtons = document.querySelectorAll('.back-btn');
            navButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const target = btn.getAttribute('data-section');
                    navButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    menuSections.forEach(s => s.classList.add('hidden'));
                    document.getElementById(`${target}-section`).classList.remove('hidden');
                    if (target === 'skins') { updateSkinPreview(); updateProgressBar(); }
                });
            });
            backButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    navButtons.forEach(b => b.classList.remove('active'));
                    document.querySelector('[data-section="play"]').classList.add('active');
                    menuSections.forEach(s => s.classList.add('hidden'));
                    document.getElementById('play-section').classList.remove('hidden');
                });
            });
        }
        
        function setupSkinSelection() {
            const skinCards = document.querySelectorAll('.skin-card');
            skinCards.forEach(card => {
                card.addEventListener('click', () => {
                    if (card.classList.contains('locked')) return;
                    skinCards.forEach(c => c.classList.remove('active'));
                    card.classList.add('active');
                    currentSkin = card.getAttribute('data-skin');
                    hasPickedSkin = true; // el jugador ha elegido a propósito: no auto-equipar más
                    updateSkinPreview();
                    saveGameData();
                });
            });
        }
        
        function updateSkinPreview() {
            previewCtx.clearRect(0, 0, skinPreview.width, skinPreview.height);
            if (imagesLoaded) {
                const config = skinConfig[currentSkin] || skinConfig['default'];
                const imgToUse = getSkinImage(currentSkin, player.state);
                if (imgToUse && imgToUse.complete) {
                    let filter = config.filter;
                    if (currentSkin === 'tinta' || currentSkin === 'powered_rainbow' || currentSkin === 'virtual_rainbow' || 
                        currentSkin === 'rainbow_matter' || currentSkin === 'angelical_shiny') filter = getRainbowFilter();
                    else if (filter === 'rainbow') filter = getRainbowFilter();
                    previewCtx.save();
                    if (filter && filter !== 'none') previewCtx.filter = filter;
                    const imgW = imgToUse.naturalWidth || imgToUse.width;
                    const imgH = imgToUse.naturalHeight || imgToUse.height;
                    const aspect = imgW / imgH;
                    let dw = 80, dh = 80;
                    if (aspect > 1) dh = 80 / aspect;
                    else dw = 80 * aspect;
                    previewCtx.drawImage(imgToUse, 10 + (80 - dw) / 2, 10 + (80 - dh) / 2, dw, dh);
                    previewCtx.restore();
                }
            } else {
                previewCtx.fillStyle = '#ffd700';
                previewCtx.beginPath();
                previewCtx.arc(50, 50, 40, 0, Math.PI * 2);
                previewCtx.fill();
                previewCtx.fillStyle = '#ff6b00';
                previewCtx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const angle = (i * 72 - 90) * Math.PI / 180;
                    const x = 50 + Math.cos(angle) * 30;
                    const y = 50 + Math.sin(angle) * 30;
                    if (i === 0) previewCtx.moveTo(x, y);
                    else previewCtx.lineTo(x, y);
                }
                previewCtx.closePath();
                previewCtx.fill();
            }
        }
        
        function updateProgressBar() {
            const skinCards = document.querySelectorAll('.skin-card[data-meters]');
            let nextSkin = null, minMeters = Infinity;
            skinCards.forEach(card => {
                if (card.classList.contains('locked')) {
                    const meters = parseInt(card.getAttribute('data-meters'));
                    if (meters < minMeters) { minMeters = meters; nextSkin = card; }
                }
            });
            // La barra usa maxMetersReached (el récord), la MISMA métrica con la que se
            // desbloquean las skins en checkSkinUnlocks. Antes usaba totalMeters (acumulado
            // de todas las partidas), por eso la barra se "atascaba" o no cuadraba.
            const progressMeters = Math.max(maxMetersReached || 0, totalMeters || 0);
            if (nextSkin) {
                const skinName = nextSkin.querySelector('.skin-name').textContent;
                const reqMeters = parseInt(nextSkin.getAttribute('data-meters'));
                currentMeters.textContent = progressMeters;
                nextUnlock.textContent = reqMeters;
                nextSkinInfo.textContent = currentLanguage === 'en' ? `Next skin: ${skinName} - ${reqMeters}m` : `Próxima skin: ${skinName} - ${reqMeters}m`;
                progressFill.style.width = `${Math.min((progressMeters / reqMeters) * 100, 100)}%`;
            } else {
                currentMeters.textContent = progressMeters;
                nextUnlock.textContent = progressMeters;
                nextSkinInfo.textContent = currentLanguage === 'en' ? 'All skins unlocked!' : '¡Todas las skins desbloqueadas!';
                progressFill.style.width = '100%';
            }
            if (debugMode) updateDebugInfo();
        }
        
        function setupCodeSystem() {
            enterCodeBtn.addEventListener('click', enterCode);
            codeInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') enterCode(); });
        }
        
        function enterCode() {
            const code = codeInput.value.trim().toUpperCase();
            if (validCodes[code]) {
                const result = validCodes[code];
                if (result === 'debug') {
                    activateDebugMode();
                    alert(currentLanguage === 'en' ? '🔧 DEBUG MODE ACTIVATED! (V2.5.1)' : '🔧 ¡MODO DEBUG ACTIVADO! (V2.5.1)');
                } else {
                    const skin = result;
                    if (!unlockedSkins.includes(skin)) {
                        unlockedSkins.push(skin);
                        unlockSkin(skin);
                        alert(currentLanguage === 'en' ? `Valid code! You unlocked: ${getSkinName(skin)}` : `¡Código válido! Has desbloqueado: ${getSkinName(skin)}`);
                        updateProgressBar();
                        saveGameData();
                    } else {
                        alert(currentLanguage === 'en' ? 'You already have this skin.' : 'Ya tienes esta skin.');
                    }
                }
            } else if (code === 'GLD-UNLINK' || code === 'GLD-DESVINCULAR') {
                codeInput.value = '';
                unlinkGlobDefenders();
                return;
            } else if (GLD_USERNAME_PATTERN.test(codeInput.value.trim())) {
                // No es un código: puede ser un usuario de Glob Defenders
                const gldUser = codeInput.value.trim();
                codeInput.value = '';
                askLinkGlobDefenders(gldUser);
                return;
            } else {
                alert(currentLanguage === 'en' ? 'Invalid code.' : 'Código inválido.');
            }
            codeInput.value = '';
        }

        // ===== Colaboración Glob Defenders x Star Jump =====
        const GLD_USERNAME_PATTERN = /^[A-Za-z0-9_.-]{3,24}$/;
        const GLD_REWARD_SKIN = 'gld_link';
        let gldLink = null; // { username, linkedAt, bestMeters }
        let gldClient = null;

        function gldText(en, es) { return currentLanguage === 'en' ? en : es; }

        function getGldClient() {
            if (gldClient) return gldClient;
            const cfg = window.GLD_SUPABASE;
            if (!window.supabase || !cfg || !cfg.url || !cfg.publishableKey) return null;
            // La sesión de GlD se guarda en este navegador (clave propia de Star Jump)
            // para poder sincronizar el progreso en la nube sin pedir la contraseña cada vez.
            // Nunca se guarda la contraseña, solo el token de sesión que da Supabase.
            gldClient = window.supabase.createClient(cfg.url, cfg.publishableKey, {
                auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, storageKey: 'starJumpGldAuth' }
            });
            return gldClient;
        }

        // ----- Guardado en la nube (tabla star_jump_progress de GlD) -----
        const GLD_CLOUD_SAVE_DELAY = 4000;
        let gldCloudTimer = null;
        let gldCloudUserId = null; // id de la cuenta GlD con sesión activa

        function getCloudSnapshot() {
            return {
                version: 1,
                highScore: Math.floor(highScore || 0),
                totalMeters: Math.floor(totalMeters || 0),
                maxMetersReached: Math.floor(maxMetersReached || 0),
                unlockedSkins: [...new Set(unlockedSkins)].filter(s => skinConfig[s]),
                currentSkin
            };
        }

        // Une progreso local y de la nube sin perder nada: máximo de metros y unión de skins
        function mergeCloudProgress(cloud) {
            if (!cloud || typeof cloud !== 'object') return false;
            const num = v => (Number.isFinite(v) && v >= 0 ? Math.floor(v) : 0);
            const before = JSON.stringify(getCloudSnapshot());
            highScore = Math.max(highScore || 0, num(cloud.highScore));
            totalMeters = Math.max(totalMeters || 0, num(cloud.totalMeters));
            maxMetersReached = Math.max(maxMetersReached || 0, num(cloud.maxMetersReached), highScore, totalMeters);
            if (Array.isArray(cloud.unlockedSkins)) {
                cloud.unlockedSkins.forEach(s => {
                    if (typeof s === 'string' && skinConfig[s] && !unlockedSkins.includes(s)) { unlockedSkins.push(s); unlockSkin(s); }
                });
            }
            if (currentSkin === 'default' && typeof cloud.currentSkin === 'string' && unlockedSkins.includes(cloud.currentSkin)) {
                selectSkin(cloud.currentSkin);
            }
            unlockSkinsUpToMeters(maxMetersReached);
            updateProgressBar();
            return before !== JSON.stringify(getCloudSnapshot());
        }

        async function pushCloudProgress() {
            const client = getGldClient();
            if (!client || !gldCloudUserId) return;
            const { error } = await client.from('star_jump_progress').upsert({
                user_id: gldCloudUserId, progress: getCloudSnapshot(), updated_at: new Date().toISOString()
            });
            if (error) console.warn('No se pudo guardar el progreso de Star Jump en la nube:', error.message);
        }

        function scheduleCloudSave() {
            if (!gldCloudUserId) return;
            clearTimeout(gldCloudTimer);
            gldCloudTimer = setTimeout(pushCloudProgress, GLD_CLOUD_SAVE_DELAY);
        }

        // Descarga el progreso de la nube, lo une con el local y sube el resultado
        async function syncCloudProgress() {
            const client = getGldClient();
            if (!client || !gldCloudUserId) return false;
            const { data, error } = await client.from('star_jump_progress')
                .select('progress').eq('user_id', gldCloudUserId).maybeSingle();
            if (error) { console.warn('No se pudo leer el progreso de Star Jump en la nube:', error.message); return false; }
            const changed = mergeCloudProgress(data && data.progress);
            saveGameData();
            await pushCloudProgress();
            return changed;
        }

        // Al abrir el juego: si hay sesión de GlD guardada, sincroniza en segundo plano
        async function restoreGldSession() {
            if (!gldLink) return;
            const client = getGldClient();
            if (!client) return;
            try {
                const { data } = await client.auth.getSession();
                const user = data && data.session && data.session.user;
                if (!user) return;
                gldCloudUserId = user.id;
                await syncCloudProgress();
            } catch (e) {
                console.warn('No se pudo restaurar la sesión de Glob Defenders:', e);
            }
        }

        async function unlinkGlobDefenders() {
            if (!gldLink) { alert(gldText('This Star Jump is not linked to any GlD account.', 'Este Star Jump no está vinculado a ninguna cuenta de GlD.')); return; }
            if (!confirm(gldText(
                `Unlink ${gldLink.username}? Your progress stays on this device and in the cloud.`,
                `¿Desvincular ${gldLink.username}? Tu progreso se queda en este dispositivo y en la nube.`))) return;
            await pushCloudProgress().catch(() => {});
            const client = getGldClient();
            if (client) { try { await client.auth.signOut({ scope: 'local' }); } catch (_) {} }
            gldLink = null; gldCloudUserId = null; clearTimeout(gldCloudTimer);
            saveGameData();
            alert(gldText('Glob Defenders account unlinked.', 'Cuenta de Glob Defenders desvinculada.'));
        }

        function askLinkGlobDefenders(username) {
            if (gldLink && gldLink.username.toLowerCase() === username.toLowerCase()) {
                if (!confirm(gldText(
                    `This Star Jump is already linked to ${gldLink.username}. Sign in again to sync your progress?`,
                    `Este Star Jump ya está vinculado a ${gldLink.username}. ¿Quieres volver a iniciar sesión para sincronizar tu progreso?`))) return;
            } else if (gldLink && !confirm(gldText(
                `This Star Jump is linked to ${gldLink.username}. Switch to "${username}"?`,
                `Este Star Jump está vinculado a ${gldLink.username}. ¿Cambiar a "${username}"?`))) {
                return;
            } else if (!gldLink && !confirm(gldText(
                `Do you want to link your Glob Defenders account "${username}" to Star Jump?\n\nYou'll get rewards in both games.`,
                `¿Quieres vincular tu cuenta de Glob Defenders "${username}" a Star Jump?\n\nObtendrás recompensas en los dos juegos.`))) return;
            openGldModal(username);
        }

        function openGldModal(username) {
            const modal = document.getElementById('gldLinkModal');
            document.getElementById('gldLinkUser').textContent = username;
            document.getElementById('gldLinkPassword').value = '';
            document.getElementById('gldLinkStatus').textContent = '';
            document.getElementById('gldLinkConfirm').disabled = false;
            modal.dataset.username = username;
            modal.querySelectorAll('[data-en]').forEach(el => { el.textContent = el.getAttribute(`data-${currentLanguage}`); });
            document.getElementById('gldLinkPassword').placeholder = gldText('GlD password', 'Contraseña de GlD');
            modal.style.display = 'flex';
            document.getElementById('gldLinkPassword').focus();
        }

        function closeGldModal() {
            const modal = document.getElementById('gldLinkModal');
            modal.style.display = 'none';
            document.getElementById('gldLinkPassword').value = '';
        }

        async function confirmGldLink() {
            const modal = document.getElementById('gldLinkModal');
            const username = modal.dataset.username || '';
            const passwordInput = document.getElementById('gldLinkPassword');
            const status = document.getElementById('gldLinkStatus');
            const button = document.getElementById('gldLinkConfirm');
            const password = passwordInput.value;
            if (!password) { status.textContent = gldText('Enter your password.', 'Escribe tu contraseña.'); return; }

            const client = getGldClient();
            if (!client) {
                status.textContent = gldText('Could not connect to Glob Defenders. Check your internet connection.',
                                             'No se pudo conectar con Glob Defenders. Comprueba tu conexión a internet.');
                return;
            }

            button.disabled = true;
            status.textContent = gldText('Linking...', 'Vinculando...');
            try {
                // Mismo formato de cuenta que usa Glob Defenders
                const email = `${username.toLowerCase()}@accounts.glob-defenders.invalid`;
                const { data: login, error: loginError } = await client.auth.signInWithPassword({ email, password });
                passwordInput.value = '';
                if (loginError || !login || !login.user) {
                    status.textContent = gldText('Wrong username or password.', 'Usuario o contraseña incorrectos.');
                    button.disabled = false;
                    return;
                }

                const best = Math.floor(Math.max(maxMetersReached || 0, highScore || 0));
                const { data, error } = await client.rpc('link_star_jump_account', { sj_best_meters: best });
                if (error || !data || (data.result !== 'linked' && data.result !== 'updated')) {
                    throw error || new Error('Respuesta inesperada al vincular');
                }

                gldLink = { username, linkedAt: data.linkedAt, bestMeters: data.bestMeters };
                gldCloudUserId = login.user.id;
                const isNewSkin = !unlockedSkins.includes(GLD_REWARD_SKIN);
                if (isNewSkin) { unlockedSkins.push(GLD_REWARD_SKIN); unlockSkin(GLD_REWARD_SKIN); }
                status.textContent = gldText('Syncing your progress...', 'Sincronizando tu progreso...');
                const cloudChanged = await syncCloudProgress();
                updateProgressBar();
                saveGameData();
                closeGldModal();
                alert(gldText(
                    `Account linked with ${username}!` + (isNewSkin ? `\n\nStar Jump: you unlocked ${getSkinName(GLD_REWARD_SKIN)}.` : '') +
                    (cloudChanged ? `\nYour cloud progress was restored.` : '') +
                    `\nYour meters and skins are now saved in your GlD account.` +
                    `\nGlob Defenders: sign in to get the Star Leap badge.`,
                    `¡Cuenta vinculada con ${username}!` + (isNewSkin ? `\n\nStar Jump: has desbloqueado ${getSkinName(GLD_REWARD_SKIN)}.` : '') +
                    (cloudChanged ? `\nSe ha recuperado tu progreso de la nube.` : '') +
                    `\nTus metros y skins se guardan ahora en tu cuenta de GlD.` +
                    `\nGlob Defenders: inicia sesión para recibir el emblema Salto Estelar.`));
            } catch (e) {
                console.error('Error al vincular con Glob Defenders:', e);
                status.textContent = gldText('The account could not be linked right now. Try again later.',
                                             'No se pudo vincular la cuenta ahora mismo. Inténtalo más tarde.');
                button.disabled = false;
                // Si la vinculación falla, no dejar una sesión a medias
                if (!gldCloudUserId) { try { await client.auth.signOut({ scope: 'local' }); } catch (_) {} }
            }
        }

        function setupGldLink() {
            document.getElementById('gldLinkConfirm').addEventListener('click', confirmGldLink);
            document.getElementById('gldLinkCancel').addEventListener('click', closeGldModal);
            document.getElementById('gldLinkPassword').addEventListener('keydown', (e) => {
                e.stopPropagation(); // que las teclas no muevan a la estrella
                if (e.key === 'Enter') confirmGldLink();
                if (e.key === 'Escape') closeGldModal();
            });
            document.getElementById('gldLinkPassword').addEventListener('keyup', (e) => e.stopPropagation());
        }
        
        function getSkinName(skinId) {
            const card = document.querySelector(`.skin-card[data-skin="${skinId}"]`);
            return card ? card.querySelector('.skin-name').textContent : skinId;
        }
        
        function unlockSkin(skinId) {
            const card = document.querySelector(`.skin-card[data-skin="${skinId}"]`);
            if (card) {
                card.classList.remove('locked');
                const overlay = card.querySelector('.locked-overlay');
                if (overlay) overlay.style.display = 'none';
                // Auto-equipar una skin nueva solo si el jugador aún no ha elegido ninguna
                // (sigue con la default). En cuanto elige una a propósito, no se le vuelve
                // a cambiar sola. Funciona con cualquier skin.
                if (!hasPickedSkin && currentSkin === 'default' && skinId !== 'default') {
                    selectSkin(skinId);
                }
            }
        }
        
        function selectSkin(skinId) {
            const card = document.querySelector(`.skin-card[data-skin="${skinId}"]`);
            if (card && !card.classList.contains('locked')) {
                document.querySelectorAll('.skin-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                currentSkin = skinId;
                updateSkinPreview();
            }
        }

        function checkSkinUnlocks() {
            maxMetersReached = Math.max(maxMetersReached, score, totalMeters);
            const skinCards = document.querySelectorAll('.skin-card[data-meters]');
            let unlocked = false;
            skinCards.forEach(card => {
                if (card.classList.contains('locked') && cardRequirementMet(card)) {
                    const req = parseInt(card.getAttribute('data-meters'));
                    if (maxMetersReached >= req) {
                        const skinId = card.getAttribute('data-skin');
                        if (!unlockedSkins.includes(skinId)) {
                            unlockedSkins.push(skinId);
                            unlockSkin(skinId);
                            unlocked = true;
                        }
                    }
                }
            });
            if (score > highScore) highScore = score;
            if (unlocked) { updateProgressBar(); saveGameData(); }
        }

        function calculateCosmicDustSpeed() {
            let newLvl = 0;
            for (let i = difficultyLevels.length - 1; i >= 0; i--) {
                if (score >= difficultyLevels[i].threshold) { newLvl = i; break; }
            }
            if (newLvl !== currentDifficultyLevel) {
                currentDifficultyLevel = newLvl;
                const lvl = difficultyLevels[currentDifficultyLevel];
                const notif = document.createElement('div');
                notif.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.8);color:#ffd700;padding:15px 30px;border-radius:10px;font-size:24px;font-weight:bold;z-index:100;border:3px solid ' + lvl.platformColor + ';box-shadow:0 0 20px ' + lvl.platformColor;
                notif.textContent = `LEVEL ${lvl.name}`;
                document.getElementById('gameContainer').appendChild(notif);
                setTimeout(() => notif.remove(), 2000);
            }
            const lvl = difficultyLevels[currentDifficultyLevel];
            cosmicDustSpeed = BASE_COSMIC_DUST_SPEED * lvl.speedMultiplier;
            updateDifficultyIndicator();
            return cosmicDustSpeed;
        }

        function updateDifficultyIndicator() {
            const lvl = difficultyLevels[currentDifficultyLevel];
            difficultyIndicator.textContent = currentLanguage === 'en' ? `Speed: ${lvl.name} (${cosmicDustSpeed.toFixed(1)}x)` : `Velocidad: ${lvl.name} (${cosmicDustSpeed.toFixed(1)}x)`;
        }

        function generatePlatform(hf, baseY) {
            const w = Math.max(60, 140 - (hf * 40));
            const gap = 30 + (hf * 15);
            const spread = canvas.width * 0.2 + (hf * 70);
            return { x: canvas.width / 2 + (Math.random() - 0.5) * spread, y: baseY - (90 + Math.random() * gap), width: w, height: 20 };
        }

        function initGame() {
            platforms = [];
            cosmicDustSpeed = 1.0;
            currentDifficultyLevel = 0;
            keys = {}; touchLeft = false; touchRight = false; touchCrouch = false;
            platforms.push({ x: canvas.width / 2, y: canvas.height * 0.75, width: Math.max(100, canvas.width * 0.2), height: 25 });
            let curY = canvas.height * 0.75;
            for (let i = 1; i < 20; i++) { const p = generatePlatform(0, curY); platforms.push(p); curY = p.y; }
            player.x = canvas.width / 2;
            player.y = canvas.height * 0.67;
            player.vx = 0; player.vy = 0;
            player.isOnPlatform = true;
            player.isCrouching = false;
            player.jumpCharge = 0;
            player.state = 'default';
            cosmicDustY = canvas.height;
            score = 0;
            cameraY = 0;
            hud.textContent = "0 m";
            updateDifficultyIndicator();
            if (isTouchDevice) { touchControls.style.display = 'flex'; crouchButton.style.display = 'flex'; touchIndicator.style.display = 'block'; }
        }

        function update(dt) {
            if (!gameRunning) return;
            const speed = calculateCosmicDustSpeed();
            if (player.isCrouching && player.isOnPlatform) player.jumpCharge = Math.min(player.jumpCharge + 1, player.maxJumpCharge);
            player.state = !player.isOnPlatform ? 'jump' : (player.isCrouching ? 'crouch' : 'default');
            player.vy += GRAVITY;
            player.y += player.vy;
            player.x += player.vx;
            player.x = Math.max(player.width/2, Math.min(canvas.width - player.width/2, player.x));
            player.isOnPlatform = false;
            for (let p of platforms) {
                if (player.vy > 0 && player.y + player.height/2 > p.y - p.height/2 && player.y + player.height/2 < p.y + 5 &&
                    player.x > p.x - p.width/2 && player.x < p.x + p.width/2) {
                    player.vy = 0;
                    player.y = p.y - p.height/2 - player.height/2;
                    player.isOnPlatform = true;
                    if (player.state === 'jump') player.state = 'default';
                    break;
                }
            }
            if (player.y - cameraY < canvas.height * 0.3) cameraY = player.y - canvas.height * 0.3;
            cosmicDustY -= speed;
            const lowest = Math.min(...platforms.map(p => p.y));
            if (lowest - cameraY > -150) platforms.push(generatePlatform(Math.max(0, score / 100), lowest));
            platforms = platforms.filter(p => p.y - cameraY < canvas.height + 100);
            score = Math.max(0, Math.floor(-cameraY / 10));
            hud.textContent = score + " m";
            if (!demoMode) checkSkinUnlocks(); // la demo no desbloquea nada
            if (!godMode && player.y + player.height/2 > cosmicDustY) {
                if (!demoMode) totalMeters += score; // la demo no suma metros
                gameOver();
            }
            else if (godMode && player.y + player.height/2 > cosmicDustY) cosmicDustY = player.y - player.height;
        }

        function draw() {
            ctx.fillStyle = '#0a1224';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            const lvl = difficultyLevels[currentDifficultyLevel];
            platforms.forEach(p => {
                const sy = p.y - cameraY;
                if (sy > -50 && sy < canvas.height + 50) {
                    if (imagesLoaded && images.platform.complete) ctx.drawImage(images.platform, p.x - p.width/2, sy - p.height/2, p.width, p.height);
                    else { ctx.fillStyle = lvl.platformColor; ctx.fillRect(p.x - p.width/2, sy - p.height/2, p.width, p.height); }
                }
            });
            const dustY = cosmicDustY - cameraY;
            if (dustY < canvas.height) {
                const grad = ctx.createLinearGradient(0, dustY, 0, canvas.height);
                grad.addColorStop(0, 'rgba(139,69,19,0.8)');
                grad.addColorStop(1, 'rgba(101,67,33,0.9)');
                ctx.fillStyle = grad;
                ctx.fillRect(0, dustY, canvas.width, canvas.height - dustY);
                ctx.strokeStyle = 'rgba(205,127,50,0.6)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                for (let x = 0; x < canvas.width; x += 15) {
                    const wave = Math.sin(x * 0.05 + Date.now() * 0.005) * 5;
                    if (x === 0) ctx.moveTo(x, dustY + wave);
                    else ctx.lineTo(x, dustY + wave);
                }
                ctx.stroke();
            }
            const py = player.y - cameraY;
            if (imagesLoaded) {
                const cfg = skinConfig[currentSkin] || skinConfig['default'];
                const img = getSkinImage(currentSkin, player.state);
                if (img && img.complete) {
                    let filter = cfg.filter;
                    if (currentSkin === 'tinta' || currentSkin === 'powered_rainbow' || currentSkin === 'virtual_rainbow' || 
                        currentSkin === 'rainbow_matter' || currentSkin === 'angelical_shiny') filter = getRainbowFilter();
                    else if (filter === 'rainbow') filter = getRainbowFilter();

                    // Parpadeo de carga de supersalto: al agacharse cargando, el
                    // personaje parpadea; cuanto mas cargado, mas rapido y mas colorido.
                    let chargeAlpha = 1;
                    if (player.isCrouching && player.jumpCharge > 0) {
                        const ratio = Math.min(1, player.jumpCharge / player.maxJumpCharge);
                        chargeBlinkPhase += 0.12 + ratio * 0.9; // velocidad crece con la carga
                        // parpadea entre opacidad alta y baja (mas marcado al cargar mas)
                        const blink = (Math.sin(chargeBlinkPhase) + 1) / 2; // 0..1
                        chargeAlpha = 1 - (0.15 + ratio * 0.55) * blink;
                        // tono de color que cicla cada vez mas rapido con la carga
                        const hue = (chargeBlinkPhase * (40 + ratio * 140)) % 360;
                        const sat = 1 + ratio * 1.8;
                        const bri = 1 + ratio * 0.6 * blink;
                        const colorFilter = `hue-rotate(${hue.toFixed(0)}deg) saturate(${sat.toFixed(2)}) brightness(${bri.toFixed(2)})`;
                        filter = (filter && filter !== 'none') ? `${filter} ${colorFilter}` : colorFilter;
                    }

                    ctx.save();
                    ctx.globalAlpha = chargeAlpha;
                    if (filter && filter !== 'none') ctx.filter = filter;
                    const iw = img.naturalWidth || img.width;
                    const ih = img.naturalHeight || img.height;
                    const asp = iw / ih;
                    let dw = player.width, dh = player.height;
                    if (asp > 1) dh = player.width / asp;
                    else dw = player.height * asp;
                    ctx.drawImage(img, player.x - dw/2, py - dh/2, dw, dh);
                    ctx.restore();
                }
            } else {
                ctx.fillStyle = player.state === 'crouch' ? '#ff6b00' : (player.state === 'jump' ? '#ff0000' : '#ffd700');
                ctx.beginPath();
                ctx.arc(player.x, py, player.width/2, 0, Math.PI * 2);
                ctx.fill();
            }
            if (godMode && gameRunning) {
                ctx.fillStyle = 'rgba(255,0,255,0.3)';
                ctx.font = 'bold 20px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('⚡ GOD MODE ⚡', canvas.width / 2, 50);
            }
        }

        function gameOver() {
            gameRunning = false;
            // En demo no se guarda progreso ni se muestra game over: reinicia la demo.
            if (demoMode) {
                setTimeout(() => { if (demoMode) startDemo(); }, 1200);
                return;
            }
            finalScore.textContent = score + " m";
            gameOverScreen.classList.remove('hidden');
            updateProgressBar();
            saveGameData();
            touchControls.style.display = 'none';
            crouchButton.style.display = 'none';
            touchIndicator.style.display = 'none';
        }

        // ===== DEMO / ATTRACT MODE =====
        // El bot decide el movimiento y el salto cada frame. Busca la plataforma
        // alcanzable mas cercana por encima, se alinea y salta cargando segun la
        // distancia. Al pasar demoTargetMeters se "rinde" y se deja morir.
        function demoBotThink() {
            if (!demoMode || !gameRunning) return;

            // Rendirse a los metros objetivo: deja de moverse y no salta mas.
            if (score >= demoTargetMeters) {
                keys = {};
                if (!player.isCrouching) player.vx = 0;
                return;
            }

            // Elegir plataforma objetivo: la mas baja que esté por encima del jugador
            // (la siguiente a la que subir), dentro de un rango de salto razonable.
            let target = null;
            let bestY = -Infinity;
            for (const p of platforms) {
                if (p.y < player.y - 10) { // por encima
                    if (p.y > bestY) { bestY = p.y; target = p; }
                }
            }
            if (!target) { keys = {}; player.vx = 0; return; }

            const dx = target.x - player.x;

            if (player.isOnPlatform) {
                // Alinear horizontalmente con el objetivo; cuando está cerca, cargar y saltar.
                if (Math.abs(dx) > target.width * 0.35) {
                    // moverse hacia el objetivo (no se puede mover agachado)
                    if (player.isCrouching) stopCrouching();
                    keys = {};
                    if (dx < 0) keys['ArrowLeft'] = true; else keys['ArrowRight'] = true;
                    updatePlayerMovement();
                } else {
                    // alineado: cargar salto. Cuanto mas lejos/alto, mas carga.
                    keys = {};
                    player.vx = 0;
                    if (!player.isCrouching) startCrouching();
                    const dyGap = player.y - target.y; // positivo = objetivo mas arriba
                    const needed = Math.min(player.maxJumpCharge, 18 + dyGap * 0.35);
                    if (player.jumpCharge >= needed) stopCrouching(); // soltar -> salta
                }
            } else {
                // En el aire: dejar algo de deriva hacia el objetivo para corregir.
                keys = {};
                if (dx < -6) keys['ArrowLeft'] = true;
                else if (dx > 6) keys['ArrowRight'] = true;
                updatePlayerMovement();
            }
        }

        function startDemo() {
            cancelDemoTimer();
            if (gameRunning) return;
            demoMode = true;
            demoTargetMeters = 300 + Math.floor(Math.random() * 300); // 300-600 m
            prevSkinBeforeDemo = currentSkin;
            currentSkin = 'default'; // la demo siempre usa la skin default
            startScreen.classList.add('hidden');
            gameOverScreen.classList.add('hidden');
            difficultyIndicator.style.display = 'block';
            demoOverlay.style.display = 'flex';
            gameRunning = true;
            lastTime = 0;
            initGame();
            // en demo no mostramos controles tactiles
            touchControls.style.display = 'none';
            crouchButton.style.display = 'none';
            touchIndicator.style.display = 'none';
            requestAnimationFrame(gameLoop);
        }

        function exitDemo() {
            if (!demoMode) return;
            demoMode = false;
            gameRunning = false;
            keys = {};
            demoOverlay.style.display = 'none';
            if (prevSkinBeforeDemo) { currentSkin = prevSkinBeforeDemo; prevSkinBeforeDemo = null; }
            goToMenu();
            scheduleDemo(); // reinicia el contador de inactividad
        }

        function scheduleDemo() {
            cancelDemoTimer();
            // Solo programa la demo si estamos en el menú (startScreen visible)
            if (startScreen.classList.contains('hidden')) return;
            demoIdleTimer = setTimeout(startDemo, DEMO_IDLE_MS);
        }

        function cancelDemoTimer() {
            if (demoIdleTimer) { clearTimeout(demoIdleTimer); demoIdleTimer = null; }
        }

        // Cualquier interacción del usuario: si la demo está activa, volver al menú;
        // si estamos en el menú, reiniciar el contador de inactividad.
        function onUserActivity() {
            if (demoMode) { exitDemo(); return; }
            if (!gameRunning && !startScreen.classList.contains('hidden')) scheduleDemo();
        }

        function gameLoop(ts) {
            if (!lastTime) lastTime = ts;
            const dt = (ts - lastTime) / 16;
            lastTime = ts;
            if (demoMode) demoBotThink();
            update(dt);
            draw();
            if (gameRunning) requestAnimationFrame(gameLoop);
        }

        function startGame() {
            cancelDemoTimer();       // partida normal: no lanzar demo
            demoMode = false;
            demoOverlay.style.display = 'none';
            gameRunning = true;
            lastTime = 0;
            initGame();
            startScreen.classList.add('hidden');
            gameOverScreen.classList.add('hidden');
            difficultyIndicator.style.display = 'block';
            if (isTouchDevice) { touchControls.style.display = 'flex'; crouchButton.style.display = 'flex'; touchIndicator.style.display = 'block'; }
            requestAnimationFrame(gameLoop);
        }

        function goToMenu() {
            gameRunning = false;
            gameOverScreen.classList.add('hidden');
            startScreen.classList.remove('hidden');
            difficultyIndicator.style.display = 'none';
            updateProgressBar();
            touchControls.style.display = 'none';
            crouchButton.style.display = 'none';
            touchIndicator.style.display = 'none';
            scheduleDemo(); // de vuelta en el menú: reinicia el contador de inactividad
        }

        function saveGameData() {
            const data = { highScore, totalMeters, maxMetersReached, unlockedSkins, currentSkin, currentLanguage, gldLink, hasPickedSkin };
            try { localStorage.setItem('starJumpSave', JSON.stringify(data)); } catch(e) { console.error(e); }
            scheduleCloudSave(); // si hay cuenta de GlD vinculada, también a la nube
        }

        function loadGameData() {
            try {
                const saved = localStorage.getItem('starJumpSave');
                if (saved) {
                    const data = JSON.parse(saved);
                    highScore = data.highScore || 0;
                    totalMeters = data.totalMeters || 0;
                    maxMetersReached = data.maxMetersReached || Math.max(totalMeters, highScore);
                    unlockedSkins = data.unlockedSkins || ['default'];
                    currentSkin = data.currentSkin || 'default';
                    currentLanguage = data.currentLanguage || 'en';
                    gldLink = data.gldLink && typeof data.gldLink.username === 'string' ? data.gldLink : null;
                    // Si el guardado marca que ya eligió, o la skin guardada no es default,
                    // consideramos que el jugador ya ha elegido: no auto-equipar al desbloquear.
                    hasPickedSkin = data.hasPickedSkin === true || (currentSkin && currentSkin !== 'default');
                    unlockedSkins.forEach(s => unlockSkin(s));
                    selectSkin(currentSkin);
                    updateProgressBar();
                    if (currentLanguage === 'es') changeLanguage();
                    unlockSkinsUpToMeters(maxMetersReached);
                } else resetGameData();
            } catch(e) { resetGameData(); }
        }

        // Skins por metros que además piden cuenta de Glob Defenders vinculada
        function cardRequirementMet(card) {
            return card.getAttribute('data-requires') !== 'gld' || Boolean(gldLink);
        }

        function unlockSkinsUpToMeters(meters) {
            const cards = document.querySelectorAll('.skin-card[data-meters]');
            let unlocked = false;
            cards.forEach(card => {
                if (card.classList.contains('locked') && cardRequirementMet(card)) {
                    const req = parseInt(card.getAttribute('data-meters'));
                    if (meters >= req) {
                        const id = card.getAttribute('data-skin');
                        if (!unlockedSkins.includes(id)) { unlockedSkins.push(id); unlockSkin(id); unlocked = true; }
                    }
                }
            });
            if (unlocked) { updateProgressBar(); saveGameData(); }
        }

        function resetGameData() {
            highScore = 0; totalMeters = 0; maxMetersReached = 0; unlockedSkins = ['default']; currentSkin = 'default'; hasPickedSkin = false;
            // Resetear desvincula en este dispositivo (sin tocar el progreso guardado en la nube)
            if (gldLink || gldCloudUserId) {
                gldLink = null; gldCloudUserId = null; clearTimeout(gldCloudTimer);
                const client = getGldClient();
                if (client) client.auth.signOut({ scope: 'local' }).catch(() => {});
            }
            document.querySelectorAll('.skin-card').forEach(card => {
                if (card.getAttribute('data-skin') !== 'default') {
                    card.classList.add('locked');
                    card.classList.remove('active');
                    card.querySelector('.locked-overlay').style.display = 'flex';
                } else {
                    card.classList.add('active');
                    card.classList.remove('locked');
                    const overlay = card.querySelector('.locked-overlay');
                    if (overlay) overlay.style.display = 'none';
                }
            });
            selectSkin('default');
            updateProgressBar();
            updateSkinPreview();
            saveGameData();
            alert(currentLanguage === 'en' ? 'Game data reset!' : '¡Datos reseteados!');
        }

        function activateDebugMode() {
            debugMode = true;
            debugIndicator.style.display = 'block';
            const debugSkins = ['pink_virtude'];
            debugSkins.forEach(s => { if (!unlockedSkins.includes(s)) { unlockedSkins.push(s); unlockSkin(s); } });
            debugPanel.style.display = 'block';
            updateDebugInfo();
            saveGameData();
        }
        
        function updateDebugInfo() {
            if (debugMeters) debugMeters.textContent = totalMeters;
            if (debugSkinsCount) debugSkinsCount.textContent = unlockedSkins.length;
            if (godModeStatus) godModeStatus.textContent = currentLanguage === 'en' ? `God Mode: ${godMode ? 'ON' : 'OFF'}` : `Modo Dios: ${godMode ? 'ON' : 'OFF'}`;
        }
        
        function addDebugMeters() {
            totalMeters += 1000;
            maxMetersReached = Math.max(maxMetersReached, totalMeters);
            updateProgressBar();
            updateDebugInfo();
            saveGameData();
            unlockSkinsUpToMeters(totalMeters);
            alert(currentLanguage === 'en' ? `✨ Added 1000m! Total: ${totalMeters}m` : `✨ ¡Añadidos 1000m! Total: ${totalMeters}m`);
        }
        
        function unlockAllSkins() {
            const all = [
                'verde','rosa','naranja','rojo','amarillo','azul','marron','cian','pastel',
                'bronce','plata','oro','vacio','negativo','angelical','demoniaco','squid',
                'power','power_invertido','power_dorado','power_rojo',
                'virtual','virtual_rojo','purple_virtual','virtual_azul',
                'possesed','possesed_invertido','possesed_rosa','possesed_verde',
                'astral','astral_azul','astral_rojo','astral_invertido',
                'squid_rojo','squid_azul','squid_verde','squid_invertido',
                'powered_rainbow','virtual_rainbow','rainbow_matter','angelical_shiny',
                'leal','galaxia','rey','pinchos','tinta','tristar','pink_virtude',
                'gld_link','globstar','possesed_globstar','angel_globstar'
            ];
            all.forEach(s => { if (!unlockedSkins.includes(s)) { unlockedSkins.push(s); unlockSkin(s); } });
            totalMeters = 10000;
            maxMetersReached = 10000;
            updateProgressBar();
            updateDebugInfo();
            saveGameData();
            alert(currentLanguage === 'en' ? '🔓 All skins unlocked! (V2.5.1)' : '🔓 ¡Todas las skins desbloqueadas! (V2.5.1)');
        }
        
        function toggleGodMode() {
            godMode = !godMode;
            updateDebugInfo();
            alert(currentLanguage === 'en' ? (godMode ? '⚡ God Mode ON!' : '⚡ God Mode OFF') : (godMode ? '⚡ ¡Modo Dios ON!' : '⚡ Modo Dios OFF'));
        }
        
        function disableGodMode() {
            godMode = false;
            updateDebugInfo();
            alert(currentLanguage === 'en' ? '⚡ God Mode disabled' : '⚡ Modo Dios desactivado');
        }

        document.addEventListener('DOMContentLoaded', () => {
            createStars();
            startBtn.addEventListener('click', startGame);
            restartBtn.addEventListener('click', startGame);
            menuBtn.addEventListener('click', goToMenu);
            langBtn.addEventListener('click', changeLanguage);
            resetBtn.addEventListener('click', () => {
                if (confirm(currentLanguage === 'en' ? 'Reset all data? Cannot undo.' : '¿Resetear todos los datos? No se puede deshacer.')) resetGameData();
            });
            if (debugAddMeters) debugAddMeters.addEventListener('click', addDebugMeters);
            if (debugUnlockAll) debugUnlockAll.addEventListener('click', unlockAllSkins);
            if (debugGodMode) debugGodMode.addEventListener('click', toggleGodMode);
            if (debugDisableGodMode) debugDisableGodMode.addEventListener('click', disableGodMode);
            if (debugClose) debugClose.addEventListener('click', () => { debugPanel.style.display = 'none'; });
            setupMenuNavigation();
            setupSkinSelection();
            setupCodeSystem();
            setupGldLink();
            setupTouchControls();
            setupKeyboardControls();
            updateSkinPreview();
            updateProgressBar();
            setInterval(updateRainbowSkin, 50);
            resizeCanvas();
            initGame();
            draw();
            difficultyIndicator.style.display = 'none';
            loadGameData();
            changeLanguage();
            restoreGldSession();
            window.addEventListener('beforeunload', saveGameData);
            // Al cambiar de pestaña o cerrar en móvil, sube ya el progreso pendiente
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'hidden' && gldCloudUserId) { clearTimeout(gldCloudTimer); pushCloudProgress(); }
                // Si la pestaña se oculta, no dejar una demo corriendo en segundo plano
                if (document.visibilityState === 'hidden' && demoMode) exitDemo();
            });
            setInterval(() => { if (gameRunning) saveGameData(); }, 30000);

            // ----- Demo / attract mode: actividad del usuario -----
            // En captura, para interceptar antes que los botones del menú cuando hay demo.
            ['pointerdown', 'keydown', 'touchstart'].forEach(ev => {
                document.addEventListener(ev, (e) => {
                    if (demoMode) {
                        // salir de la demo y NO dejar que el evento active nada más
                        e.preventDefault();
                        e.stopPropagation();
                        exitDemo();
                    } else {
                        onUserActivity();
                    }
                }, true);
            });
            // Arrancar el contador de inactividad al cargar (estamos en el menú)
            scheduleDemo();
        });
    