window.onerror = (msg, url, line, col) => {
    const d = document.createElement('div');
    Object.assign(d.style, { position: 'fixed', inset: '0 0 auto 0', background: 'rgba(255,0,0,.95)', color: '#fff', padding: '15px', zIndex: 999999, font: '13px monospace' });
    d.innerHTML = `<b>[SYS ERR]</b><br>${msg}<br>${url}:${line}:${col}`;
    document.body.appendChild(d);
    return false;
};

        // hack for safari overflow bug
        window.VisualizerData = {
            isActive: false,
            type: 'none',
            analyser: null,
            dataArray: null,
            simulatedVoiceAmp: 0
        };

        const SystemVoice = {
            isSpeaking: false,
            speak(text, onStartCb, onEndCb, pitch = 0.2, rate = 0.88) {
                if (!window.speechSynthesis) return;
                window.speechSynthesis.cancel();
                const u = Object.assign(new SpeechSynthesisUtterance(text), { pitch, rate });
                const v = window.speechSynthesis.getVoices();
                if(v.length) u.voice = v.find(x => x.name.includes('UK English Male') || x.name.includes('Mark')) || v[0];
                u.onstart = () => { this.isSpeaking = window.VisualizerData.isActive = true; window.VisualizerData.type = 'speech'; onStartCb?.(); };
                u.onend = u.onerror = () => { this.isSpeaking = window.VisualizerData.isActive = false; window.VisualizerData.type = 'none'; onEndCb?.(); };
                window.speechSynthesis.speak(u);
            }
        };

        // dirty fix but works
        const SVGS = {
            ultron: `<svg viewBox="0 0 24 24" fill="none" stroke="#FF9900" stroke-width="1.5"><circle cx="12" cy="12" r="3" fill="#FFB300"></circle><circle cx="12" cy="12" r="9" stroke-dasharray="2 4"></circle><circle cx="12" cy="12" r="6" stroke-dasharray="1 3"></circle><path d="M12 3v18M3 12h18"></path></svg>`,
            close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
            maximize: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>`,
            minimize: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
            terminal: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>`,
            folder: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`,
            file: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>`,
            audio: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>`,
            code: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
            chart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`,
            play: `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`,
            xlsx: `<svg viewBox="0 0 24 24" fill="none" stroke="#107C41" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><path d="M9 17V7h3l2 4 2-4h3v10h-3v-4l-2 4h-2l-2-4v4H9z"></path></svg>`,
            txt: `<svg viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
            py: `<svg viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2"><path d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"></path></svg>`,
            bat: `<svg viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><path d="M6 14l3-3-3-3M10 14h4"></path></svg>`,
            png: `<svg viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`,
            pdf: `<svg viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M9 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-2z"></path></svg>`,
            camera: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>`,
            calculator: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="16" y1="14" x2="16" y2="18"></line><line x1="8" y1="10" x2="8" y2="10.01"></line><line x1="12" y1="10" x2="12" y2="10.01"></line><line x1="16" y1="10" x2="16" y2="10.01"></line><line x1="8" y1="14" x2="8" y2="14.01"></line><line x1="12" y1="14" x2="12" y2="14.01"></line><line x1="8" y1="18" x2="8" y2="18.01"></line><line x1="12" y1="18" x2="12" y2="18.01"></line></svg>`,
            browser: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
            settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`
        };

        // --- Virtual File System ---
        const FileSystem = {
            'Desktop': [],
            'Documents': [],
            'Downloads': []
        };
        
        let activeDragIcon = null;
        let dragOffsetX = 0, dragOffsetY = 0;
        
        const renderDesktopIcons = () => {
            const d = document.getElementById('desktop');
            d.querySelectorAll('.desktop-icon').forEach(e => e.remove());
            FileSystem['Desktop'].forEach((i, idx) => {
                const e = Object.assign(document.createElement('div'), { className: 'desktop-icon', innerHTML: `${i.icon}<div class="desktop-icon-name">${i.name}</div>` });
                i.x ??= 20; i.y ??= 20 + (idx * 100);
                Object.assign(e.style, { left: `${i.x}px`, top: `${i.y}px` });
                e.onmousedown = (ev) => { ev.stopPropagation(); if (!ev.ctrlKey && !ev.shiftKey) d.querySelectorAll('.desktop-icon').forEach(n => n.classList.remove('selected')); e.classList.add('selected'); if(ev.button === 0) { activeDragIcon = { item: i, el: e }; const r = e.getBoundingClientRect(); dragOffsetX = ev.clientX - r.left; dragOffsetY = ev.clientY - r.top; } };
                e.ondblclick = () => { if(i.type === 'shortcut') WindowManager.open(i.appId); else if(i.type === 'file') { WindowManager.open('code'); setTimeout(() => { const t = document.querySelector('.code-textarea'); if(t) t.value = i.content; }, 500); } };
                d.appendChild(e);
            });
        };
        
        document.addEventListener('mousemove', e => { if(!activeDragIcon) return; activeDragIcon.el.style.left = (activeDragIcon.item.x = e.clientX - dragOffsetX) + 'px'; activeDragIcon.el.style.top = (activeDragIcon.item.y = e.clientY - dragOffsetY) + 'px'; });
        document.addEventListener('mouseup', () => activeDragIcon = null);

        // --- Core OS Systems ---
        const Core = {
            audioCtx: null,
            init: function() {
                this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                this.playBootChime();
                
                // show the UI immediately as it starts fading out
                document.getElementById('top-bar').style.display = 'flex';
                document.getElementById('desktop').style.display = 'flex';
                document.getElementById('taskbar').style.display = 'flex';
                
                document.getElementById('boot-screen').style.opacity = '0';
                setTimeout(() => {
                    document.getElementById('boot-screen').style.display = 'none';
                    document.getElementById('orb-container').style.display = 'flex';
                    AICore.speak("Ultron Core initialized. Welcome back, Architect.");
                }, 1500);
                
                // setup Lock Input handler
                document.getElementById('lock-input').addEventListener('keydown', (e) => {
                    if(e.key === 'Enter') {
                        if(e.target.value.toLowerCase() === 'unlock' || e.target.value === '1234') {
                            document.getElementById('lock-screen-overlay').style.display = 'none';
                            e.target.value = '';
                            AICore.speak("Access restored. Welcome back.");
                        } else {
                            AICore.speak("Access denied. Invalid credentials.");
                            e.target.value = '';
                        }
                    }
                });
                
                setInterval(updateClock, 1000);
                updateClock();
                renderDesktopIcons();
                AICore.init();
                WindowManager.init();
                AppRegistry.renderStartMenu();
            },
            playBootChime: function() {
                if(!this.audioCtx) return;
                const osc = this.audioCtx.createOscillator();
                const gain = this.audioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(220, this.audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 1.5);
                gain.gain.setValueAtTime(0, this.audioCtx.currentTime);
                gain.gain.linearRampToValueAtTime(0.3, this.audioCtx.currentTime + 0.5);
                gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 3);
                osc.connect(gain);
                gain.connect(this.audioCtx.destination);
                osc.start();
                osc.stop(this.audioCtx.currentTime + 3);
            }
        };

        const updateClock = () => { const n = new Date(); document.getElementById('tray-time').innerText = n.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}); document.getElementById('tray-date').innerText = n.toISOString().split('T')[0]; };

        // --- File System ---
        const FS = {
            data: {},
            init: function() {
                const stored = localStorage.getItem('ultron-fs');
                if(stored) {
                    this.data = JSON.parse(stored);
                    let updated = false;
                    const defaults = {
                        'readme.txt': 'Welcome to UltronOS virtual ecosystem.',
                        'Documents/task_list.txt': '1. Calibrate core parameters\n2. Run neofetch diagnostics\n3. Execute theme overrides',
                        'Documents/financials.xlsx': '[Excel sheet: Q3 earnings report]',
                        'Downloads/kernel_patch.bat': '@echo off\necho Appending code parameters...\necho Done.',
                        'Downloads/security_scan.pdf': '[Portable Document Format: Threat Analysis]',
                        'Images/system_wallpaper.png': '[Image binary reference]',
                        'Music/ultron_theme.py': '# Cyber beats generator\nimport time\nprint("Loading system chime...")',
                        'System/core.sys': 'RESTRICTED SECURITY KERNEL CORE DATA',
                        'System/diagnostic.log': 'LOG 1024: CORE TEMPERATURE OPTIMAL'
                    };
                    for (let key in defaults) {
                        if (this.data[key] === undefined) {
                            this.data[key] = defaults[key];
                            updated = true;
                        }
                    }
                    if (updated) this.save();
                } else {
                    this.data = {
                        'readme.txt': 'Welcome to UltronOS virtual ecosystem.',
                        'Documents/task_list.txt': '1. Calibrate core parameters\n2. Run neofetch diagnostics\n3. Execute theme overrides',
                        'Documents/financials.xlsx': '[Excel sheet: Q3 earnings report]',
                        'Downloads/kernel_patch.bat': '@echo off\necho Appending code parameters...\necho Done.',
                        'Downloads/security_scan.pdf': '[Portable Document Format: Threat Analysis]',
                        'Images/system_wallpaper.png': '[Image binary reference]',
                        'Music/ultron_theme.py': '# Cyber beats generator\nimport time\nprint("Loading system chime...")',
                        'System/core.sys': 'RESTRICTED SECURITY KERNEL CORE DATA',
                        'System/diagnostic.log': 'LOG 1024: CORE TEMPERATURE OPTIMAL'
                    };
                    this.save();
                }
            },
            save: function() { localStorage.setItem('ultron-fs', JSON.stringify(this.data)); },
            write: function(name, content) { this.data[name] = content; this.save(); },
            read: function(name) { return this.data[name]; },
            del: function(name) { delete this.data[name]; this.save(); },
            list: function() { return Object.keys(this.data); }
        };
        FS.init();

        // --- Apps Registry ---
        const AppRegistry = {
            apps: {
                'ultron': { id: 'ultron', title: 'Ultron AI Core', icon: SVGS.ultron, width: 900, height: 600, render: renderUltron },
                'terminal': { id: 'terminal', title: 'Ultron Terminal', icon: SVGS.terminal, width: 600, height: 400, render: renderTerminal },
                'explorer': { id: 'explorer', title: 'Vibranium File Explorer', icon: SVGS.folder, width: 700, height: 450, render: renderExplorer },
                'code': { id: 'code', title: 'Ultron Code Studio', icon: SVGS.code, width: 800, height: 500, render: renderCode },
                'audio': { id: 'audio', title: 'SoundWave Audio', icon: SVGS.audio, width: 720, height: 440, render: renderAudio },
                'telemetry': { id: 'telemetry', title: 'System Telemetry', icon: SVGS.chart, width: 750, height: 480, render: renderTelemetry },
                'camera': { id: 'camera', title: 'Camera Studio', icon: SVGS.camera, width: 800, height: 550, render: renderCamera },
                'calculator': { id: 'calculator', title: 'Calculator', icon: SVGS.calculator, width: 320, height: 480, render: renderCalculator },
                'browser': { id: 'browser', title: 'Browser', icon: SVGS.browser, width: 950, height: 600, render: renderBrowser },
                'settings': { id: 'settings', title: 'Settings', icon: SVGS.settings, width: 800, height: 550, render: renderSettings }
            },
            renderStartMenu: function() {
                const container = document.getElementById('start-pinned-apps');
                const taskbarApps = document.getElementById('taskbar-apps');
                Object.values(this.apps).forEach(app => {
                    // start Menu
                    const div = document.createElement('div');
                    div.className = 'app-icon';
                    div.innerHTML = `${app.icon}<span>${app.title.split(' ')[0]}</span>`;
                    div.onclick = () => { WindowManager.open(app.id); toggleStartMenu(); };
                    div.oncontextmenu = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (window.showAppContextMenu) window.showAppContextMenu(e.clientX, e.clientY, app);
                    };
                    container.appendChild(div);
                    // taskbar Pinned
                    if (app.id !== 'camera' && app.id !== 'calculator' && app.id !== 'settings') {
                        const tbDiv = document.createElement('div');
                        tbDiv.className = 'taskbar-item';
                        tbDiv.id = `tb-${app.id}`;
                        tbDiv.title = app.title;
                        tbDiv.innerHTML = app.icon;
                        tbDiv.onclick = () => WindowManager.toggleApp(app.id);
                        taskbarApps.appendChild(tbDiv);
                    }
                });
            }
        };

        // --- Window Manager ---
        const WindowManager = {
            windows: {},
            zIndexCounter: 100,
            desktop: document.getElementById('desktop'),
            snapGuide: document.getElementById('snap-guide'),
            dragState: null,
            currentWorkspace: 0,

            init: function() {
                document.addEventListener('mousemove', this.onMouseMove.bind(this));
                document.addEventListener('mouseup', this.onMouseUp.bind(this));
            },

            switchWorkspace: function(index) {
                this.currentWorkspace = index;
                Object.keys(this.windows).forEach(appId => {
                    const winObj = this.windows[appId];
                    if (winObj.workspace === index) {
                        winObj.el.style.display = 'flex';
                    } else {
                        winObj.el.style.display = 'none';
                    }
                });
            },

            open: function(appId) {
                if(this.windows[appId]) {
                    this.windows[appId].workspace = this.currentWorkspace;
                    this.windows[appId].el.style.display = 'flex';
                    this.focus(appId);
                    return;
                }
                const app = AppRegistry.apps[appId];
                if(!app) return;

                const win = document.createElement('div');
                win.className = 'window focused';
                win.id = `win-${appId}`;
                win.style.width = app.width + 'px';
                win.style.height = app.height + 'px';
                win.style.left = Math.max(50, (window.innerWidth - app.width) / 2 + (Object.keys(this.windows).length * 20)) + 'px';
                win.style.top = Math.max(50, (window.innerHeight - app.height) / 2 + (Object.keys(this.windows).length * 20)) + 'px';
                win.style.zIndex = ++this.zIndexCounter;

                win.innerHTML = `
                    <div class="titlebar" onmousedown="WindowManager.startDrag(event, '${appId}')">
                        <div class="title-area">${app.icon} ${app.title}</div>
                        <div class="window-controls" onmousedown="event.stopPropagation()">
                            <div class="win-btn minimize" onclick="WindowManager.minimize('${appId}')">${SVGS.minimize}</div>
                            <div class="win-btn maximize" onclick="WindowManager.maximize('${appId}')">${SVGS.maximize}</div>
                            <div class="win-btn close" onclick="WindowManager.close('${appId}')">${SVGS.close}</div>
                        </div>
                    </div>
                    <div class="window-content" id="content-${appId}"></div>
                `;
                win.onmousedown = () => this.focus(appId);
                this.desktop.appendChild(win);
                this.windows[appId] = { el: win, state: 'normal', prevRect: null, workspace: this.currentWorkspace };
                
                app.render(`content-${appId}`);
                this.focus(appId);
                const tb = document.getElementById(`tb-${appId}`);
                if (tb) tb.classList.add('active');
            },

            close: function(appId) {
                if(!this.windows[appId]) return;
                this.desktop.removeChild(this.windows[appId].el);
                delete this.windows[appId];
                const tb = document.getElementById(`tb-${appId}`);
                if (tb) tb.classList.remove('active');
            },

            minimize: function(appId) {
                const win = this.windows[appId].el;
                win.style.display = 'none';
                const tb = document.getElementById(`tb-${appId}`);
                if (tb) tb.classList.remove('active');
            },

            maximize: function(appId) {
                const winObj = this.windows[appId];
                const win = winObj.el;
                if(win.classList.contains('maximized')) {
                    win.classList.remove('maximized');
                    win.style.left = winObj.prevRect.left;
                    win.style.top = winObj.prevRect.top;
                    win.style.width = winObj.prevRect.width;
                    win.style.height = winObj.prevRect.height;
                } else {
                    winObj.prevRect = { left: win.style.left, top: win.style.top, width: win.style.width, height: win.style.height };
                    win.classList.remove('snapped-left', 'snapped-right');
                    win.classList.add('maximized');
                }
            },

            minimizeAll: function() {
                Object.keys(this.windows).forEach(id => this.minimize(id));
            },

            toggleApp: function(appId) {
                if(this.windows[appId]) {
                    if(this.windows[appId].el.style.display === 'none') {
                        this.windows[appId].el.style.display = 'flex';
                        const tb = document.getElementById(`tb-${appId}`);
                        if (tb) tb.classList.add('active');
                        this.focus(appId);
                    } else {
                        const maxZ = Math.max(...Object.values(this.windows).map(w => parseInt(w.el.style.zIndex)));
                        if(parseInt(this.windows[appId].el.style.zIndex) === maxZ) {
                            this.minimize(appId);
                        } else {
                            this.focus(appId);
                        }
                    }
                } else {
                    this.open(appId);
                }
            },

            focus: function(appId) {
                Object.values(this.windows).forEach(w => w.el.classList.remove('focused'));
                if(this.windows[appId]) {
                    this.windows[appId].el.style.zIndex = ++this.zIndexCounter;
                    this.windows[appId].el.classList.add('focused');
                }
            },

            startDrag: function(e, appId) {
                if(this.windows[appId].el.classList.contains('maximized')) return;
                const win = this.windows[appId].el;
                const rect = win.getBoundingClientRect();
                this.dragState = {
                    appId: appId,
                    el: win,
                    offsetX: e.clientX - rect.left,
                    offsetY: e.clientY - rect.top
                };
                win.style.transition = 'none';
            },

            onMouseMove: function(e) {
                if(!this.dragState) return;
                const { el, offsetX, offsetY } = this.dragState;
                let newX = e.clientX - offsetX;
                let newY = e.clientY - offsetY;
                
                // boundaries
                if(newY < 0) newY = 0;
                
                el.style.left = newX + 'px';
                el.style.top = newY + 'px';
                el.classList.remove('snapped-left', 'snapped-right');

                // snap Guide
                if(e.clientX < 20) {
                    this.snapGuide.style.top = '0';
                    this.snapGuide.style.left = '0';
                    this.snapGuide.style.width = '50%';
                    this.snapGuide.style.height = '100%';
                    this.snapGuide.style.opacity = '1';
                } else if(e.clientX > window.innerWidth - 20) {
                    this.snapGuide.style.top = '0';
                    this.snapGuide.style.left = '50%';
                    this.snapGuide.style.width = '50%';
                    this.snapGuide.style.height = '100%';
                    this.snapGuide.style.opacity = '1';
                } else {
                    this.snapGuide.style.opacity = '0';
                }
            },

            onMouseUp: function(e) {
                if(!this.dragState) return;
                const { el } = this.dragState;
                el.style.transition = 'border 0.2s, box-shadow 0.2s';
                
                if(e.clientX < 20) {
                    el.classList.add('snapped-left');
                } else if(e.clientX > window.innerWidth - 20) {
                    el.classList.add('snapped-right');
                }
                
                this.snapGuide.style.opacity = '0';
                this.dragState = null;
            }
        };

        // --- Start Menu Toggle ---
        function toggleStartMenu() {
            document.getElementById('start-menu').classList.toggle('open');
        }
        document.getElementById('start-btn').addEventListener('click', toggleStartMenu);
        document.getElementById('desktop').addEventListener('click', () => {
            document.getElementById('start-menu').classList.remove('open');
        });

        // --- AI Core System (Stubbed for Voice Only) ---
        const AICore = {
            synth: window.speechSynthesis,
            init: function() {},
            speak: function(text) {
                SystemVoice.speak(text);
            }
        };

        // --- Drag Selection Box Logic ---
        (function() {
            const desktop = document.getElementById('desktop');
            const selectionBox = document.createElement('div');
            selectionBox.className = 'selection-box';
            selectionBox.style.display = 'none';
            desktop.appendChild(selectionBox);

            let isSelecting = false;
            let selectStart = { x: 0, y: 0 };

            desktop.addEventListener('mousedown', (e) => {
                if (e.button === 0 && e.target === desktop) {
                    isSelecting = true;
                    const rect = desktop.getBoundingClientRect();
                    selectStart.x = e.clientX - rect.left;
                    selectStart.y = e.clientY - rect.top;

                    selectionBox.style.left = `${selectStart.x}px`;
                    selectionBox.style.top = `${selectStart.y}px`;
                    selectionBox.style.width = '0px';
                    selectionBox.style.height = '0px';
                    selectionBox.style.display = 'block';

                    e.preventDefault();
                }
            });

            document.addEventListener('mousemove', (e) => {
                if (!isSelecting) return;
                const rect = desktop.getBoundingClientRect();
                const currentX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
                const currentY = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

                const left = Math.min(selectStart.x, currentX);
                const top = Math.min(selectStart.y, currentY);
                const width = Math.abs(selectStart.x - currentX);
                const height = Math.abs(selectStart.y - currentY);

                selectionBox.style.left = left + 'px';
                selectionBox.style.top = top + 'px';
                selectionBox.style.width = width + 'px';
                selectionBox.style.height = height + 'px';
                
                // icon collision detection
                desktop.querySelectorAll('.desktop-icon').forEach(icon => {
                    const iRect = icon.getBoundingClientRect();
                    const ix = iRect.left - rect.left;
                    const iy = iRect.top - rect.top;
                    if (ix < left + width && ix + iRect.width > left && iy < top + height && iy + iRect.height > top) {
                        icon.classList.add('selected');
                    } else {
                        icon.classList.remove('selected');
                    }
                });
            });

            document.addEventListener('mouseup', () => {
                if (isSelecting) {
                    isSelecting = false;
                    selectionBox.style.display = 'none';
                }
            });
        })();

        // --- Desktop Custom Context Menu Logic ---
        (function() {
            const desktop = document.getElementById('desktop');
            const contextMenu = document.createElement('div');
            contextMenu.id = 'desktop-context-menu';
            contextMenu.className = 'context-menu';
            contextMenu.innerHTML = `
                <div class="context-menu-item" onclick="onMenuRefresh(event)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
                    <span>Refresh</span>
                </div>
                <div class="context-menu-item" onclick="onMenuNextWallpaper(event)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                    <span>Next Wallpaper</span>
                </div>
                <div class="context-menu-item" onclick="onMenuPersonalise(event)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19C5.03366 19.1751 5.09705 19.4312 5.02102 19.674C4.81903 20.3188 4.3013 21.3199 4.05 21.8C3.95 22 4.1 22.1 4.2 22C4.9 21.5 6 21 6.5 21.2C6.75 21.3 6.9 21.5 6.95 21.75C7.15 22.5 7.85 22 8 22H12Z"></path><circle cx="7.5" cy="10.5" r="1.5" fill="currentColor"></circle><circle cx="11.5" cy="7.5" r="1.5" fill="currentColor"></circle><circle cx="16.5" cy="9.5" r="1.5" fill="currentColor"></circle><circle cx="15.5" cy="14.5" r="1.5" fill="currentColor"></circle></svg>
                    <span>Personalise</span>
                </div>
                <div class="context-menu-item" onclick="onMenuCreate(event)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    <span>Create</span>
                </div>
            `;
            document.body.appendChild(contextMenu);
            
            // app Context Menu (Start Menu)
            const appContextMenu = document.createElement('div');
            appContextMenu.className = 'context-menu';
            document.body.appendChild(appContextMenu);

            window.showAppContextMenu = (x, y, app) => {
                const tbItem = document.getElementById(`tb-${app.id}`);
                const isPinned = !!tbItem;
                appContextMenu.innerHTML = `
                    <div class="context-menu-item" onclick="onMenuPin('${app.id}', ${isPinned})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                        <span>${isPinned ? 'Unpin from Taskbar' : 'Pin to Taskbar'}</span>
                    </div>
                    <div class="context-menu-item" onclick="onMenuShortcut('${app.id}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                        <span>Send to Desktop</span>
                    </div>
                `;
                appContextMenu.style.left = x + 'px';
                appContextMenu.style.top = y + 'px';
                appContextMenu.style.display = 'block';
            };

            window.onMenuPin = (appId, isPinned) => {
                appContextMenu.style.display = 'none';
                const app = AppRegistry.apps[appId];
                if (isPinned) {
                    const tbItem = document.getElementById(`tb-${appId}`);
                    if (tbItem) tbItem.remove();
                } else {
                    const taskbarApps = document.getElementById('taskbar-apps');
                    const tbDiv = document.createElement('div');
                    tbDiv.className = 'taskbar-item';
                    tbDiv.id = `tb-${app.id}`;
                    tbDiv.title = app.title;
                    tbDiv.innerHTML = app.icon;
                    tbDiv.onclick = () => WindowManager.toggleApp(app.id);
                    taskbarApps.appendChild(tbDiv);
                }
            };

            window.onMenuShortcut = (appId) => {
                appContextMenu.style.display = 'none';
                const app = AppRegistry.apps[appId];
                if (!FileSystem['Desktop'].find(f => f.name === app.title)) {
                    FileSystem['Desktop'].push({
                        type: 'shortcut',
                        appId: app.id,
                        name: app.title,
                        icon: app.icon
                    });
                    renderDesktopIcons();
                    
                    const explorer = document.querySelector('.app-explorer');
                    if (explorer && explorer.parentElement._refresh) explorer.parentElement._refresh();
                }
            };
            
            document.addEventListener('click', (e) => {
                if (e.target !== desktop && contextMenu) contextMenu.style.display = 'none';
                if (appContextMenu) appContextMenu.style.display = 'none';
            });

            const wallpapers = ['assets/wallpapers/wallpaper.png', 'assets/wallpapers/wallpaper1.png', 'assets/wallpapers/wallpaper2.png', 'assets/wallpapers/wallpaper3.png', 'assets/wallpapers/wallpaper4.png'];
            let currentWallIndex = parseInt(localStorage.getItem('ultron-wallpaper-index')) || 0;

            // apply saved wallpaper on load
            const desktopBg = document.getElementById('desktop-bg');
            if (desktopBg) {
                desktopBg.style.backgroundImage = `url('${wallpapers[currentWallIndex]}?v=${Date.now()}')`;
            }

            desktop.addEventListener('contextmenu', (e) => {
                if (e.target === desktop) {
                    e.preventDefault();
                    contextMenu.style.left = `${e.clientX}px`;
                    contextMenu.style.top = `${e.clientY}px`;
                    contextMenu.style.display = 'block';
                } else {
                    contextMenu.style.display = 'none';
                }
            });

            document.addEventListener('click', () => {
                contextMenu.style.display = 'none';
            });

            window.onMenuRefresh = function(e) {
                e.stopPropagation();
                contextMenu.style.display = 'none';
                const dbg = document.getElementById('desktop-bg');
                dbg.style.transition = 'opacity 0.2s ease-in-out';
                dbg.style.opacity = '0.3';
                AICore.speak("Refreshing system core protocols.");
                setTimeout(() => {
                    dbg.style.opacity = '1';
                }, 250);
            };

            window.onMenuNextWallpaper = function(e) {
                e.stopPropagation();
                contextMenu.style.display = 'none';
                currentWallIndex = (currentWallIndex + 1) % wallpapers.length;
                localStorage.setItem('ultron-wallpaper-index', currentWallIndex);
                
                const dbg = document.getElementById('desktop-bg');
                dbg.style.transition = 'opacity 0.3s ease-in-out';
                dbg.style.opacity = '0.3';
                
                setTimeout(() => {
                    dbg.style.backgroundImage = `url('${wallpapers[currentWallIndex]}?v=${Date.now()}')`;
                    dbg.style.opacity = '1';
                }, 300);

                AICore.speak(`Switching to wallpaper ${currentWallIndex + 1}`);
            };

            window.onMenuPersonalise = function(e) {
                e.stopPropagation();
                contextMenu.style.display = 'none';
                AICore.speak("Personalizing system color scheme.");
                const currentGold = getComputedStyle(document.documentElement).getPropertyValue('--accent-gold').trim();
                if (currentGold === '#FFD700') {
                    document.documentElement.style.setProperty('--accent-gold', '#FF007F'); // electric pink
                    document.documentElement.style.setProperty('--border-gold', 'rgba(255, 0, 127, 0.25)');
                } else {
                    document.documentElement.style.setProperty('--accent-gold', '#FFD700'); // default gold
                    document.documentElement.style.setProperty('--border-gold', 'rgba(255, 215, 0, 0.25)');
                }
            };

            window.onMenuCreate = function(e) {
                e.stopPropagation();
                contextMenu.style.display = 'none';
                AICore.speak("Initializing Ultron Code Studio creation mode.");
                WindowManager.open('code');
            };
        })();

        // --- Desktop Widgets Logic ---
        (function() {
            // 1. Minimalist Calendar
            const now = new Date();
            const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
            const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
            
            const calD = document.getElementById('cal-d');
            const calNum = document.getElementById('cal-num');
            const calM = document.getElementById('cal-m');
            
            if (calD) calD.innerText = days[now.getDay()];
            if (calNum) calNum.innerText = now.getDate();
            if (calM) calM.innerText = `${months[now.getMonth()]} ${now.getFullYear()}`;

            // 2. Weather Simulation
            setInterval(() => {
                const wTemp = document.getElementById('w-temp');
                const wRain = document.getElementById('w-rain');
                const wWind = document.getElementById('w-wind');
                if (wTemp) wTemp.innerText = (70 + Math.floor(Math.random() * 5)) + '°';
                if (wRain) wRain.innerText = Math.floor(Math.random() * 20) + '%';
                if (wWind) wWind.innerText = Math.floor(Math.random() * 12) + 'mph';
            }, 5000);

            // 3. Audio Visualizer (System Wide Reactivity)
            const vizCanvas = document.getElementById('sys-visualizer');
            if (vizCanvas) {
                const vizCtx = vizCanvas.getContext('2d');
                let offset = 0;

                function drawVisualizer() {
                    const w = vizCanvas.width;
                    const h = vizCanvas.height;
                    vizCtx.clearRect(0, 0, w, h);
                    
                    vizCtx.beginPath();
                    vizCtx.strokeStyle = 'rgba(255, 179, 0, 0.9)'; // gold
                    vizCtx.lineWidth = 2;
                    
                    const cy = h / 2;
                    
                    if (window.VisualizerData.isActive && window.VisualizerData.type === 'speech') {
                        // simulate speech waveform
                        window.VisualizerData.simulatedVoiceAmp += (1 - window.VisualizerData.simulatedVoiceAmp) * 0.1;
                        const amp = window.VisualizerData.simulatedVoiceAmp * 15;
                        for (let x = 0; x < w; x++) {
                            const freq = Math.sin(x * 0.2 + offset) * Math.sin(x * 0.05) * Math.random();
                            const y = cy + (freq * amp);
                            if (x === 0) vizCtx.moveTo(x, y);
                            else vizCtx.lineTo(x, y);
                        }
                    } else if (window.VisualizerData.isActive && window.VisualizerData.type === 'music' && window.VisualizerData.analyser) {
                        // real music frequency data
                        const bufferLength = window.VisualizerData.analyser.frequencyBinCount;
                        if (!window.VisualizerData.dataArray || window.VisualizerData.dataArray.length !== bufferLength) {
                            window.VisualizerData.dataArray = new Uint8Array(bufferLength);
                        }
                        window.VisualizerData.analyser.getByteTimeDomainData(window.VisualizerData.dataArray);
                        
                        const sliceWidth = w * 1.0 / bufferLength;
                        let x = 0;
                        for (let i = 0; i < bufferLength; i++) {
                            const v = window.VisualizerData.dataArray[i] / 128.0;
                            const y = v * cy;
                            if (i === 0) vizCtx.moveTo(x, y);
                            else vizCtx.lineTo(x, y);
                            x += sliceWidth;
                        }
                    } else {
                        // idle flatline
                        window.VisualizerData.simulatedVoiceAmp *= 0.8;
                        for (let x = 0; x < w; x++) {
                            const y = cy + Math.sin(x * 0.05 + offset) * 2;
                            if (x === 0) vizCtx.moveTo(x, y);
                            else vizCtx.lineTo(x, y);
                        }
                    }
                    
                    vizCtx.stroke();
                    offset += 0.15;
                    requestAnimationFrame(drawVisualizer);
                }
                drawVisualizer();
            }
        })();

        // --- App Implementations ---

        // 1. Terminal
        let matrixInterval = null;
        async function renderTerminal(containerId) {
            const container = document.getElementById(containerId);
            container.innerHTML = '<div style="padding:20px; color:#fff;">Loading...</div>';
            try {
                let html = await (await fetch('components/terminal.html')).text();
                container.innerHTML = html.replace(/\$\{containerId\}/g, containerId);
            } catch (e) {
                container.innerHTML = 'Error loading app.';
                return;
            };
            const input = document.getElementById(`term-in-${containerId}`);
            const out = document.getElementById(`term-out-${containerId}`);
            const termArea = document.getElementById(`term-${containerId}`);
            
            input.focus();
            termArea.onclick = () => input.focus();

            input.addEventListener('keydown', (e) => {
                if(e.key === 'Enter') {
                    const cmd = input.value.trim();
                    input.value = '';
                    out.innerHTML += `<div class="term-line">PS C:\\Ultron&gt; ${cmd}</div>`;
                    
                    const args = cmd.split(' ');
                    const base = args[0].toLowerCase();
                    
                    if(base === 'help') {
                        out.innerHTML += `
<div class="term-line" style="color: var(--accent-gold); font-weight: bold; margin: 5px 0;">Ultron CLI v3.0 Core Commands Guide</div>
<div class="term-line" style="color: var(--text-muted);">========================================================</div>
<div class="term-line"><b>core operations:</b></div>
<div class="term-line">  help                     Show this detailed manual.</div>
<div class="term-line">  sysinfo                  Display kernel diagnostics.</div>
<div class="term-line">  ultronfetch              Visual system status dashboard.</div>
<div class="term-line">  clear                    Clear screen.</div>
<div class="term-line">  matrix                   Toggle background matrix simulation.</div>
<div class="term-line">  theme                    Toggle interface color palette profiles.</div>
<div class="term-line"><b>app management:</b></div>
<div class="term-line">  open &lt;app&gt;               Launch a GUI app window. (apps: terminal, explorer, code, chart)</div>
<div class="term-line">  close &lt;app&gt;              Close a GUI app window.</div>
<div class="term-line"><b>virtual storage (vibranium fs):</b></div>
<div class="term-line">  ls                       List files in virtual workspace.</div>
<div class="term-line">  cat &lt;file&gt;               Print virtual file content.</div>
<div class="term-line">  write &lt;file&gt; &lt;text...&gt;   Write or append text content to a file.</div>
<div class="term-line">  rm &lt;file&gt;                Delete file from virtual workspace.</div>
<div class="term-line"><b>speech unit:</b></div>
<div class="term-line">  speak &lt;msg...&gt;           Broadcast statement from voice core.</div>
<div class="term-line" style="color: var(--text-muted);">========================================================</div>`;
                    } else if(base === 'sysinfo') {
                        out.innerHTML += `<div class="term-line">OS: UltronOS v3.0 (Quantum Edition)<br>Core: Neural Agentic Architecture Core v3.0<br>Status: Core Online / Active Security System</div>`;
                    } else if(base === 'ultronfetch') {
                        const uptime = Math.floor(performance.now() / 60000) + 'm ' + Math.floor((performance.now() % 60000) / 1000) + 's';
                        const currentGold = getComputedStyle(document.documentElement).getPropertyValue('--accent-gold').trim();
                        const themeName = currentGold === '#FFD700' ? 'Void Gold' : 'Neon Spark';
                        out.innerHTML += `
<div class="term-line" style="display: flex; gap: 20px; align-items: flex-start; white-space: pre; font-family: var(--font-mono); line-height: 1.2;">
<div style="color: var(--accent-gold);">       .---.
    ,-'     \`-.
  ,'    ___    \`.
 /     /   \\     \\
|     | (O) |     |
|      \\___/      |
 \\               /
  \`.           ,'
    \`-._____.-'</div><div style="color: var(--text-main);">
<span style="color: var(--accent-gold); font-weight: bold;">UltronOS v3.0 (Quantum Edition)</span>
------------------------------
<span style="color: var(--accent-gold);">OS:</span> UltronOS x86_64
<span style="color: var(--accent-gold);">Kernel:</span> UltronCore-3.0.1-Vibranium
<span style="color: var(--accent-gold);">Uptime:</span> ${uptime}
<span style="color: var(--accent-gold);">Shell:</span> UltronTerminal v1.5
<span style="color: var(--accent-gold);">CPU:</span> Ultron Quantum Cognitive Core v3
<span style="color: var(--accent-gold);">Memory:</span> 9.62 GB / 16.00 GB (60%)
<span style="color: var(--accent-gold);">Theme:</span> ${themeName}
<span style="color: var(--accent-gold);">Resolution:</span> ${window.innerWidth}x${window.innerHeight}
<span style="color: var(--accent-gold);">Diagnostics:</span> Core Online</div></div>`;
                    } else if(base === 'clear') {
                        out.innerHTML = '';
                    } else if(base === 'open') {
                        if(args[1]) { WindowManager.open(args[1]); out.innerHTML += `<div class="term-line">Opened ${args[1]}</div>`; }
                        else out.innerHTML += `<div class="term-line">Usage: open &lt;app_id&gt;</div>`;
                    } else if(base === 'close') {
                        if(args[1]) { WindowManager.minimize(args[1]); out.innerHTML += `<div class="term-line">Closed ${args[1]}</div>`; }
                        else out.innerHTML += `<div class="term-line">Usage: close &lt;app_id&gt;</div>`;
                    } else if(base === 'theme') {
                        const currentGold = getComputedStyle(document.documentElement).getPropertyValue('--accent-gold').trim();
                        if (currentGold === '#FFD700') {
                            document.documentElement.style.setProperty('--accent-gold', '#FF007F'); // pink
                            document.documentElement.style.setProperty('--border-gold', 'rgba(255, 0, 127, 0.25)');
                            out.innerHTML += `<div class="term-line">Theme updated to: <b>Neon Spark</b></div>`;
                        } else {
                            document.documentElement.style.setProperty('--accent-gold', '#FFD700'); // gold
                            document.documentElement.style.setProperty('--border-gold', 'rgba(255, 215, 0, 0.25)');
                            out.innerHTML += `<div class="term-line">Theme updated to: <b>Void Gold</b></div>`;
                        }
                    } else if(base === 'ls') {
                        const files = FS.list();
                        if (files.length === 0) {
                            out.innerHTML += `<div class="term-line" style="color: var(--text-muted);">Virtual workspace empty.</div>`;
                        } else {
                            files.forEach(f => {
                                out.innerHTML += `<div class="term-line">${f}</div>`;
                            });
                        }
                    } else if(base === 'cat') {
                        if (args[1]) {
                            const content = FS.read(args[1]);
                            if (content !== undefined) {
                                out.innerHTML += `<div class="term-line" style="white-space: pre-wrap;">${content}</div>`;
                            } else {
                                out.innerHTML += `<div class="term-line" style="color: #E81123;">File not found: '${args[1]}'</div>`;
                            }
                        } else {
                            out.innerHTML += `<div class="term-line">Usage: cat &lt;filename&gt;</div>`;
                        }
                    } else if(base === 'write') {
                        if (args[1] && args[2]) {
                            const filename = args[1];
                            const content = args.slice(2).join(' ');
                            FS.write(filename, content);
                            out.innerHTML += `<div class="term-line">Successfully written to file '${filename}'</div>`;
                        } else {
                            out.innerHTML += `<div class="term-line">Usage: write &lt;filename&gt; &lt;content...&gt;</div>`;
                        }
                    } else if(base === 'rm') {
                        if (args[1]) {
                            const filename = args[1];
                            const content = FS.read(filename);
                            if (content !== undefined) {
                                FS.del(filename);
                                out.innerHTML += `<div class="term-line">Deleted file '${filename}'</div>`;
                            } else {
                                out.innerHTML += `<div class="term-line" style="color: #E81123;">File not found: '${filename}'</div>`;
                            }
                        } else {
                            out.innerHTML += `<div class="term-line">Usage: rm &lt;filename&gt;</div>`;
                        }
                    } else if(base === 'speak') {
                        if (args[1]) {
                            const msg = args.slice(1).join(' ');
                            AICore.speak(msg);
                            out.innerHTML += `<div class="term-line">Broadcasted speech statement.</div>`;
                        } else {
                            out.innerHTML += `<div class="term-line">Usage: speak &lt;message...&gt;</div>`;
                        }
                    } else if(base === 'echo') {
                        out.innerHTML += `<div class="term-line">${args.slice(1).join(' ')}</div>`;
                    } else if(base === 'matrix') {
                        toggleMatrix(container);
                    } else if(base !== '') {
                        out.innerHTML += `<div class="term-line">Command not recognized: '${base}'. Type 'help' for support.</div>`;
                    }
                    termArea.scrollTop = termArea.scrollHeight;
                }
            });
        }

        function toggleMatrix(container) {
            const canvas = container.querySelector('#matrix-canvas');
            if(canvas.style.opacity === '1') {
                canvas.style.opacity = '0';
                clearInterval(matrixInterval);
            } else {
                canvas.style.opacity = '1';
                const ctx = canvas.getContext('2d');
                canvas.width = container.clientWidth;
                canvas.height = container.clientHeight;
                const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~";
                const fontSize = 14;
                const columns = canvas.width / fontSize;
                const drops = Array(Math.floor(columns)).fill(1);
                
                matrixInterval = setInterval(() => {
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = '#0F0';
                    ctx.font = fontSize + 'px monospace';
                    for(let i = 0; i < drops.length; i++) {
                        const text = chars[Math.floor(Math.random() * chars.length)];
                        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                        if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
                        drops[i]++;
                    }
                }, 50);
            }
        }

        // 2. File Explorer
        async function renderExplorer(containerId) {
            const container = document.getElementById(containerId);
            container._activeCategory = 'Root (C:)';

            container.innerHTML = '<div style="padding:20px; color:#fff;">Loading...</div>';
            try {
                let html = await (await fetch('components/explorer.html')).text();
                container.innerHTML = html.replace(/\$\{containerId\}/g, containerId);
            } catch (e) {
                container.innerHTML = 'Error loading app.';
                return;
            };

            container._changeCategory = (cat, element) => {
                container._activeCategory = cat;
                const items = container.querySelectorAll('.sidebar-item');
                items.forEach(item => item.classList.remove('active'));
                element.classList.add('active');
                container._refresh();
            };

            container._newFile = () => {
                const name = prompt("Enter filename (with extension, e.g. code.py, sheet.xlsx, document.pdf):");
                if (!name) return;
                const category = container._activeCategory || 'Root (C:)';
                const prefix = category === 'Root (C:)' ? '' : category + '/';
                const fullname = prefix + name;
                FS.write(fullname, `// virtual file: ${name}\nCreated on: ${new Date().toLocaleString()}`);
                container._refresh();
                AICore.speak(`Created file ${name}`);
            };

            container._newFolder = () => {
                const name = prompt("Enter folder name:");
                if (!name) return;
                const category = container._activeCategory || 'Root (C:)';
                const prefix = category === 'Root (C:)' ? '' : category + '/';
                const fullname = prefix + name + '/readme.txt';
                FS.write(fullname, `Welcome to folder ${name}.`);
                container._refresh();
                AICore.speak(`Created folder ${name}`);
            };

            container._refresh = () => {
                const list = document.getElementById(`fs-list-${containerId}`);
                const addressText = document.getElementById(`address-path-${containerId}`);
                const filesArea = document.getElementById(`files-area-${containerId}`);
                
                const existingLocked = filesArea.querySelector('.explorer-locked');
                if (existingLocked) existingLocked.remove();
                list.style.display = 'grid';

                const category = container._activeCategory || 'Root (C:)';
                addressText.innerText = `C:\\${category === 'Root (C:)' ? '' : category}`;

                if (category === 'System') {
                    list.style.display = 'none';
                    const lockedDiv = document.createElement('div');
                    lockedDiv.className = 'explorer-locked';
                    lockedDiv.innerHTML = `
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        <div style="font-size:15px; font-weight:bold; color:#EF4444; letter-spacing:1px;">ACCESS RESTRICTED</div>
                        <div style="font-size:12px; color:var(--text-muted); max-width:300px;">Warning: Unauthorized access to system core files detected. Administrator security clearance required.</div>
                    `;
                    filesArea.appendChild(lockedDiv);
                    AICore.speak("Security warning. Access restricted.");
                    return;
                }

                list.innerHTML = '';
                
                if (category === 'Desktop') {
                    FileSystem['Desktop'].forEach(item => {
                        const fDiv = document.createElement('div');
                        fDiv.className = 'file-item';
                        fDiv.innerHTML = `${item.icon}<span>${item.name}</span>`;
                        fDiv.ondblclick = () => {
                            if (item.type === 'shortcut') WindowManager.open(item.appId);
                            else if (item.type === 'file') {
                                WindowManager.open('code');
                                setTimeout(() => {
                                    if(window.CodeEditorLoad) window.CodeEditorLoad(item.name, item.content);
                                }, 100);
                            }
                        };
                        list.appendChild(fDiv);
                    });
                    return;
                }

                const allFiles = FS.list();
                let filtered = [];

                if (category === 'Root (C:)') {
                    filtered = allFiles;
                } else {
                    filtered = allFiles.filter(file => file.startsWith(category + '/'));
                }

                filtered.forEach(file => {
                    const fDiv = document.createElement('div');
                    fDiv.className = 'file-item';
                    
                    const ext = file.split('.').pop().toLowerCase();
                    let iconSVG = SVGS.file;
                    if (file.includes('/') && !file.split('/').pop().includes('.')) {
                        iconSVG = SVGS.folder;
                    } else if (SVGS[ext]) {
                        iconSVG = SVGS[ext];
                    }
                    
                    const displayName = file.includes('/') ? file.split('/').slice(1).join('/') : file;

                    fDiv.innerHTML = `${iconSVG}<span>${displayName}</span>`;
                    
                    fDiv.ondblclick = () => {
                        WindowManager.open('code');
                        setTimeout(() => {
                            if(window.CodeEditorLoad) window.CodeEditorLoad(file, FS.read(file));
                        }, 100);
                    };
                    
                    fDiv.oncontextmenu = (e) => {
                        e.preventDefault();
                        if(confirm(`Delete ${displayName}?`)) { 
                            FS.del(file); 
                            container._refresh(); 
                        }
                    };
                    list.appendChild(fDiv);
                });
            };
            container._refresh();
        }

        // 3. Code Studio
        async function renderCode(containerId) {
            const container = document.getElementById(containerId);
            container.innerHTML = '<div style="padding:20px; color:#fff;">Loading...</div>';
            try {
                let html = await (await fetch('components/code.html')).text();
                container.innerHTML = html.replace(/\$\{containerId\}/g, containerId);
            } catch (e) {
                container.innerHTML = 'Error loading app.';
                return;
            };
            
            const txt = document.getElementById(`code-text-${containerId}`);
            const lines = document.getElementById(`code-lines-${containerId}`);
            const fileIn = document.getElementById(`code-filename-${containerId}`);
            const msg = document.getElementById(`code-msg-${containerId}`);

            txt.addEventListener('input', () => {
                const lineCount = txt.value.split('\n').length;
                lines.innerHTML = Array(lineCount).fill(0).map((_,i) => i+1).join('<br>');
            });

            container._save = () => {
                const name = fileIn.value.trim() || 'untitled.txt';
                FS.write(name, txt.value);
                
                let iconSVG = SVGS.document;
                const ext = name.split('.').pop().toLowerCase();
                if (SVGS[ext]) iconSVG = SVGS[ext];
                else if (ext === 'py' || ext === 'html' || ext === 'js' || ext === 'css') iconSVG = SVGS.code;
                
                const existing = FileSystem['Desktop'].find(f => f.name === name);
                if (!existing) {
                    FileSystem['Desktop'].push({
                        type: 'file',
                        name: name,
                        content: txt.value,
                        icon: iconSVG
                    });
                } else {
                    existing.content = txt.value;
                    existing.icon = iconSVG;
                }
                renderDesktopIcons();
                
                const explorer = document.querySelector('.app-explorer');
                if (explorer && explorer.parentElement._refresh) explorer.parentElement._refresh();
                
                msg.innerText = "Saved to Desktop!";
                setTimeout(() => msg.innerText='', 2000);
            };

            window.CodeEditorLoad = (name, content) => {
                fileIn.value = name;
                txt.value = content;
                txt.dispatchEvent(new Event('input'));
            };
        }

        // 4. Audio Studio
        function renderAudio(containerId) {
            const container = document.getElementById(containerId);
            container.innerHTML = `<div style="padding: 20px; color: var(--accent-blue);">Scanning local music library...</div>`;

            Promise.resolve({ text: () => Promise.resolve(`<html><body>
<a href="HEAVENLY JUMPSTYLE.mp3"></a>
<a href="HEAVENLY JUMPSTYLE.jpg"></a>
<a href="SENTE MAIS.m4a"></a>
<a href="SENTE MAIS.jpg"></a>
</body></html>`) })
                .then(res => res.text())
                .then(html => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const links = Array.from(doc.querySelectorAll('a'));
                    
                    const files = links.map(a => a.getAttribute('href').replace('./', ''));
                    
                    const audioExts = ['.mp3', '.wav', '.ogg', '.m4a', '.flac', '.aac', '.webm'];
                    const imgExts = ['.png', '.jpg', '.jpeg'];
                    
                    const audioFiles = files.filter(f => audioExts.some(ext => f.toLowerCase().endsWith(ext)));
                    const imgFiles = files.filter(f => imgExts.some(ext => f.toLowerCase().endsWith(ext)));
                    
                    const PLAYLIST = audioFiles.map(audioFile => {
                        const baseName = audioFile.substring(0, audioFile.lastIndexOf('.'));
                        let matchingImg = imgFiles.find(img => img.substring(0, img.lastIndexOf('.')) === baseName);
                        
                        const cleanTitle = decodeURIComponent(baseName).replace(/[-_]/g, ' ').replace(/\s+/g, ' ');
                        
                        return {
                            title: cleanTitle,
                            artist: "Local Audio",
                            src: `assets/audio/${audioFile}`,
                            art: matchingImg ? `assets/audio/${matchingImg}` : null,
                            duration: "---"
                        };
                    });

                    if (PLAYLIST.length === 0) {
                        container.innerHTML = `<div style="padding: 20px; color: #EF4444;">No audio files found in /music/ folder.</div>`;
                        return;
                    }

                    // render HTML
                    container.innerHTML = `
                        <div class="music-player-container">
                            <!-- Left Pane -->
                            <div class="player-left">
                                <div class="player-track-info">
                                    <div class="track-title-artist">
                                        <h3 id="track-title-${containerId}">Loading...</h3>
                                        <p id="track-artist-${containerId}">...</p>
                                    </div>
                                    <div class="player-heart-btn" id="heart-btn-${containerId}" onclick="document.getElementById('${containerId}')._toggleLike()">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
                                    </div>
                                </div>
                                
                                <div class="modern-album-area">
                                    <div class="modern-album-art" id="album-art-${containerId}" style="background-image: linear-gradient(135deg, #2563EB 0%, #1E3A8A 100%)"></div>
                                </div>
                                
                                <div class="linear-progress-container">
                                    <span id="time-display-${containerId}">0:00</span>
                                    <div class="progress-bar-bg" id="progress-bg-${containerId}" onclick="document.getElementById('${containerId}')._seek(event)">
                                        <div class="progress-bar-fill" id="progress-fill-${containerId}"></div>
                                    </div>
                                    <span id="duration-display-${containerId}">---</span>
                                </div>
                                
                                <div class="player-controls">
                                    <button class="control-btn" id="shuffle-${containerId}" onclick="document.getElementById('${containerId}')._toggleShuffle()">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line></svg>
                                    </button>
                                    <button class="control-btn" onclick="document.getElementById('${containerId}')._prevTrack()">
                                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
                                    </button>
                                    <button class="control-btn play-pause-btn" id="play-btn-${containerId}" onclick="document.getElementById('${containerId}')._togglePlay()">
                                        <svg id="play-icon-${containerId}" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                    </button>
                                    <button class="control-btn" onclick="document.getElementById('${containerId}')._nextTrack()">
                                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
                                    </button>
                                    <button class="control-btn" id="repeat-${containerId}" onclick="document.getElementById('${containerId}')._toggleRepeat()">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14M7 23 3 19 7 15"></path><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
                                    </button>
                                </div>
                            </div>
                            
                            <!-- Right Pane -->
                            <div class="player-right">
                                <div class="playlist-header">SoundWave Library</div>
                                <div class="playlist-tracks" id="playlist-list-${containerId}"></div>
                            </div>
                        </div>
                    `;

                    let currentTrackIndex = 0;
                    let isPlaying = false;
                    let isShuffle = false;
                    let isRepeat = false;
                    let isLiked = false;

                    const audio = new Audio();
                    audio.crossOrigin = "anonymous";
                    
                    // web Audio API Hook for Visualizer
                    let audioCtx, source, analyser;
                    audio.onplay = () => {
                        if (!audioCtx) {
                            const AudioContext = window.AudioContext || window.webkitAudioContext;
                            audioCtx = new AudioContext();
                            source = audioCtx.createMediaElementSource(audio);
                            analyser = audioCtx.createAnalyser();
                            analyser.fftSize = 256;
                            source.connect(analyser);
                            analyser.connect(audioCtx.destination);
                            window.VisualizerData.analyser = analyser;
                        }
                        window.VisualizerData.isActive = true;
                        window.VisualizerData.type = 'music';
                    };
                    audio.onpause = () => { if(window.VisualizerData.type === 'music') window.VisualizerData.isActive = false; };
                    audio.onended = () => { 
                        if(window.VisualizerData.type === 'music') window.VisualizerData.isActive = false; 
                        if (!isRepeat) {
                            container._nextTrack();
                        }
                    };
                    
                    let simulatedTime = 0;
                    let simInterval = null;

                    audio.onerror = () => {
                        console.warn(`Could not load audio file: ${PLAYLIST[currentTrackIndex].src}`);
                        if (isPlaying) {
                            simulatePlayback();
                        }
                    };

                    const trackTitle = document.getElementById(`track-title-${containerId}`);
                    const trackArtist = document.getElementById(`track-artist-${containerId}`);
                    const albumArt = document.getElementById(`album-art-${containerId}`);
                    const timeDisplay = document.getElementById(`time-display-${containerId}`);
                    const durationDisplay = document.getElementById(`duration-display-${containerId}`);
                    const progressFill = document.getElementById(`progress-fill-${containerId}`);
                    const progressBg = document.getElementById(`progress-bg-${containerId}`);
                    const playIcon = document.getElementById(`play-icon-${containerId}`);
                    const heartBtn = document.getElementById(`heart-btn-${containerId}`);
                    const shuffleBtn = document.getElementById(`shuffle-${containerId}`);
                    const repeatBtn = document.getElementById(`repeat-${containerId}`);
                    const playlistContainer = document.getElementById(`playlist-list-${containerId}`);

                    audio.onloadedmetadata = () => {
                        if (audio.duration && audio.duration !== Infinity) {
                            const m = Math.floor(audio.duration / 60);
                            const s = Math.floor(audio.duration % 60).toString().padStart(2, '0');
                            PLAYLIST[currentTrackIndex].duration = `${m}:${s}`;
                            durationDisplay.innerText = `${m}:${s}`;
                            
                            // update it in the side list too
                            const items = playlistContainer.querySelectorAll('.track-item-duration');
                            if (items[currentTrackIndex]) {
                                items[currentTrackIndex].innerText = `${m}:${s}`;
                            }
                        }
                    };

                    function loadTrack(index) {
                        clearInterval(simInterval);
                        currentTrackIndex = index;
                        const track = PLAYLIST[index];
                        trackTitle.innerText = track.title;
                        trackArtist.innerText = track.artist;
                        durationDisplay.innerText = track.duration;
                        
                        albumArt.style.backgroundImage = `linear-gradient(135deg, #2563EB 0%, #1E3A8A 100%)`;
                        if (track.art) {
                            const img = new Image();
                            img.src = track.art;
                            img.onload = () => albumArt.style.backgroundImage = `url('${track.art}')`;
                        }
                        
                        audio.src = track.src;
                        setProgress(0);
                        timeDisplay.innerText = "0:00";

                        const items = playlistContainer.querySelectorAll('.track-item');
                        items.forEach((item, idx) => {
                            if (idx === index) item.classList.add('active');
                            else item.classList.remove('active');
                        });
                    }

                    PLAYLIST.forEach((track, index) => {
                        const item = document.createElement('div');
                        item.className = 'track-item';
                        
                        item.innerHTML = `
                            <div class="track-item-left">
                                <div class="track-item-art" id="art-${containerId}-${index}" style="background: linear-gradient(135deg, #2563EB 0%, #1E3A8A 100%);"></div>
                                <div class="track-item-details">
                                    <h4>${track.title}</h4>
                                    <p>${track.artist}</p>
                                </div>
                            </div>
                            <div class="track-item-duration">${track.duration}</div>
                        `;
                        
                        if (track.art) {
                            const img = new Image();
                            img.src = track.art;
                            img.onload = () => {
                                const artDiv = document.getElementById(`art-${containerId}-${index}`);
                                if(artDiv) artDiv.style.backgroundImage = `url('${track.art}')`;
                            };
                        }

                        item.onclick = () => {
                            loadTrack(index);
                            if (isPlaying) {
                                audio.play().catch(() => {});
                            } else {
                                container._togglePlay();
                            }
                        };
                        playlistContainer.appendChild(item);
                    });

                    function setProgress(percent) {
                        progressFill.style.width = `${percent}%`;
                    }
                    
                    container._seek = (e) => {
                        if (audio.duration) {
                            const rect = progressBg.getBoundingClientRect();
                            const clickX = e.clientX - rect.left;
                            const percent = (clickX / rect.width);
                            audio.currentTime = percent * audio.duration;
                            
                            if(simInterval) {
                                 const durParts = PLAYLIST[currentTrackIndex].duration.split(':');
                                 if (durParts.length === 2) {
                                     const totalSec = parseInt(durParts[0]) * 60 + parseInt(durParts[1]);
                                     simulatedTime = percent * totalSec;
                                 }
                            }
                        }
                    };

                    loadTrack(0);

                    function simulatePlayback() {
                        clearInterval(simInterval);
                        simInterval = setInterval(() => {
                            if (!isPlaying) {
                                clearInterval(simInterval);
                                return;
                            }
                            const durParts = PLAYLIST[currentTrackIndex].duration.split(':');
                            if (durParts.length !== 2) return;
                            const totalSec = parseInt(durParts[0]) * 60 + parseInt(durParts[1]);
                            
                            simulatedTime++;
                            if (simulatedTime >= totalSec) {
                                simulatedTime = 0;
                                container._nextTrack();
                            } else {
                                const pct = (simulatedTime / totalSec) * 100;
                                setProgress(pct);
                                
                                const m = Math.floor(simulatedTime / 60);
                                const s = Math.floor(simulatedTime % 60).toString().padStart(2, '0');
                                timeDisplay.innerText = `${m}:${s}`;
                            }
                        }, 1000);
                    }

                    container._togglePlay = () => {
                        if (isPlaying) {
                            isPlaying = false;
                            audio.pause();
                            albumArt.classList.remove('playing');
                            playIcon.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"></polygon>`;
                            clearInterval(simInterval);
                        } else {
                            isPlaying = true;
                            audio.play().then(() => {
                                albumArt.classList.add('playing');
                                playIcon.innerHTML = `<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>`;
                            }).catch((err) => {
                                albumArt.classList.add('playing');
                                playIcon.innerHTML = `<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>`;
                                simulatePlayback();
                            });
                        }
                    };

                    container._prevTrack = () => {
                        simulatedTime = 0;
                        let prevIdx = currentTrackIndex - 1;
                        if (prevIdx < 0) prevIdx = PLAYLIST.length - 1;
                        loadTrack(prevIdx);
                        if (isPlaying) {
                            audio.play().then(() => {
                                albumArt.classList.add('playing');
                            }).catch(() => {
                                simulatePlayback();
                            });
                        }
                    };

                    container._nextTrack = () => {
                        simulatedTime = 0;
                        let nextIdx = currentTrackIndex + 1;
                        
                        if (isShuffle) {
                            nextIdx = Math.floor(Math.random() * PLAYLIST.length);
                        } else if (nextIdx >= PLAYLIST.length) {
                            nextIdx = 0;
                        }
                        
                        loadTrack(nextIdx);
                        if (isPlaying) {
                            audio.play().then(() => {
                                albumArt.classList.add('playing');
                            }).catch(() => {
                                simulatePlayback();
                            });
                        }
                    };

                    container._toggleShuffle = () => {
                        isShuffle = !isShuffle;
                        shuffleBtn.classList.toggle('active', isShuffle);
                        AICore.speak(isShuffle ? "Shuffle enabled." : "Shuffle disabled.");
                    };

                    container._toggleRepeat = () => {
                        isRepeat = !isRepeat;
                        audio.loop = isRepeat;
                        repeatBtn.classList.toggle('active', isRepeat);
                        AICore.speak(isRepeat ? "Repeat enabled." : "Repeat disabled.");
                    };

                    container._toggleLike = () => {
                        isLiked = !isLiked;
                        if (isLiked) {
                            heartBtn.classList.add('liked');
                            heartBtn.querySelector('svg').setAttribute('fill', '#EF4444');
                        } else {
                            heartBtn.classList.remove('liked');
                            heartBtn.querySelector('svg').setAttribute('fill', 'none');
                        }
                    };

                    audio.ontimeupdate = () => {
                        if (audio.duration && audio.duration !== Infinity) {
                            const pct = (audio.currentTime / audio.duration) * 100;
                            setProgress(pct);
                            const m = Math.floor(audio.currentTime / 60);
                            const s = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
                            timeDisplay.innerText = `${m}:${s}`;
                        }
                    };

                    function monitorDestroy() {
                        if (!document.getElementById(containerId)) {
                            audio.pause();
                            clearInterval(simInterval);
                            return;
                        }
                        requestAnimationFrame(monitorDestroy);
                    }
                    monitorDestroy();
                })
                .catch(err => {
                    console.error("Failed to load music directory", err);
                    container.innerHTML = `<div style="padding: 20px; color: #EF4444;">Error accessing local /music/ directory. Make sure it exists!</div>`;
                });
        }

        // 5. Telemetry
        let telInterval = null;
        function renderTelemetry(containerId) {
            const container = document.getElementById(containerId);
            container._activeResource = 'CPU';
            
            container.innerHTML = `
                <div class="telemetry-container">
                    <!-- Left Sidebar -->
                    <div class="telemetry-sidebar">
                        <div class="sidebar-header">Performance</div>
                        
                        <div class="telemetry-sidebar-item active" data-res="CPU" onclick="document.getElementById('${containerId}')._changeResource('CPU')">
                            <div class="sidebar-item-info">
                                <span class="sidebar-item-name">CPU</span>
                                <span class="sidebar-item-value" id="side-val-CPU-${containerId}">0% 4.82 GHz</span>
                            </div>
                            <canvas class="sidebar-sparkline" id="spark-CPU-${containerId}" width="60" height="30"></canvas>
                        </div>
                        
                        <div class="telemetry-sidebar-item" data-res="Memory" onclick="document.getElementById('${containerId}')._changeResource('Memory')">
                            <div class="sidebar-item-info">
                                <span class="sidebar-item-name">Memory</span>
                                <span class="sidebar-item-value" id="side-val-Memory-${containerId}">0.0/16.0 GB (0%)</span>
                            </div>
                            <canvas class="sidebar-sparkline" id="spark-Memory-${containerId}" width="60" height="30"></canvas>
                        </div>
                        
                        <div class="telemetry-sidebar-item" data-res="Disk 0" onclick="document.getElementById('${containerId}')._changeResource('Disk 0')">
                            <div class="sidebar-item-info">
                                <span class="sidebar-item-name">Disk 0 (C: D:)</span>
                                <span class="sidebar-item-value" id="side-val-Disk 0-${containerId}">SSD 0%</span>
                            </div>
                            <canvas class="sidebar-sparkline" id="spark-Disk 0-${containerId}" width="60" height="30"></canvas>
                        </div>
                        
                        <div class="telemetry-sidebar-item" data-res="Wi-Fi" onclick="document.getElementById('${containerId}')._changeResource('Wi-Fi')">
                            <div class="sidebar-item-info">
                                <span class="sidebar-item-name">Wi-Fi</span>
                                <span class="sidebar-item-value" id="side-val-Wi-Fi-${containerId}">S: 0 R: 0 Kbps</span>
                            </div>
                            <canvas class="sidebar-sparkline" id="spark-Wi-Fi-${containerId}" width="60" height="30"></canvas>
                        </div>
                        
                        <div class="telemetry-sidebar-item" data-res="GPU 0" onclick="document.getElementById('${containerId}')._changeResource('GPU 0')">
                            <div class="sidebar-item-info">
                                <span class="sidebar-item-name">GPU 0</span>
                                <span class="sidebar-item-value" id="side-val-GPU 0-${containerId}">0% (45 °C)</span>
                            </div>
                            <canvas class="sidebar-sparkline" id="spark-GPU 0-${containerId}" width="60" height="30"></canvas>
                        </div>
                        
                        <div class="telemetry-sidebar-item" data-res="Processes" onclick="document.getElementById('${containerId}')._changeResource('Processes')">
                            <div class="sidebar-item-info">
                                <span class="sidebar-item-name" style="color: #EF4444;">Task Killer</span>
                                <span class="sidebar-item-value" id="side-val-Processes-${containerId}">Active Apps</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Right Detailed Pane -->
                    <div class="telemetry-main">
                        <div class="telemetry-header">
                            <h2 id="main-title-${containerId}">CPU</h2>
                            <span id="main-speed-label-${containerId}">Intel Core i7-10700K CPU @ 3.80GHz</span>
                        </div>
                        
                        <!-- Big Grid Line Chart -->
                        <div class="telemetry-graph-container">
                            <canvas class="telemetry-main-graph" id="main-graph-${containerId}" width="400" height="180"></canvas>
                        </div>
                        
                        <!-- Performance Metrics Details Grid -->
                        <div class="telemetry-metrics-grid" id="metrics-grid-${containerId}">
                            <!-- Populated based on active item -->
                        </div>
                        
                        <!-- Active Processes Manager -->
                        <div class="telemetry-processes">
                            <div class="proc-header">
                                <span>Active Processes</span>
                                <span style="font-size: 11px; text-transform: none; color: var(--text-muted);">Self-Repair Shell</span>
                            </div>
                            <div class="proc-list-body" id="proc-list-${containerId}"></div>
                        </div>
                    </div>
                </div>
            `;

            const HISTORY_LEN = 30;
            const history = {
                'CPU': Array(HISTORY_LEN).fill(15),
                'Memory': Array(HISTORY_LEN).fill(40),
                'Disk 0': Array(HISTORY_LEN).fill(1),
                'Wi-Fi': Array(HISTORY_LEN).fill(5),
                'GPU 0': Array(HISTORY_LEN).fill(10)
            };

            const colors = {
                'CPU': '#3B82F6',
                'Memory': '#FF007F',
                'Disk 0': '#107C41',
                'Wi-Fi': '#F59E0B',
                'GPU 0': '#FFD700'
            };

            container._changeResource = (res) => {
                container._activeResource = res;
                const items = container.querySelectorAll('.telemetry-sidebar-item');
                items.forEach(item => {
                    if (item.getAttribute('data-res') === res) item.classList.add('active');
                    else item.classList.remove('active');
                });
                
                document.getElementById(`main-title-${containerId}`).innerText = res === 'Processes' ? 'Task Killer' : res;
                
                const speedEl = document.getElementById(`main-speed-label-${containerId}`);
                if (res === 'CPU') speedEl.innerText = "Ultron Cognitive Core v3.0 @ 4.82 GHz";
                else if (res === 'Memory') speedEl.innerText = "System Virtual Allocation Base";
                else if (res === 'Disk 0') speedEl.innerText = "Vibranium Solid State Drive (C: D:)";
                else if (res === 'Wi-Fi') speedEl.innerText = "Quantum Network Transceiver Link";
                else if (res === 'GPU 0') speedEl.innerText = "AMD Radeon RX Quantum Graphics @ 1650 MHz";
                else if (res === 'Processes') speedEl.innerText = "Manage Active System Processes";

                const graphContainer = container.querySelector('.telemetry-graph-container');
                const metricsGrid = container.querySelector('.telemetry-metrics-grid');
                const procManager = container.querySelector('.telemetry-processes');

                if (res === 'Processes') {
                    graphContainer.style.display = 'none';
                    metricsGrid.style.display = 'none';
                    procManager.style.flexGrow = '1';
                    procManager.style.maxHeight = 'none';
                    container.querySelector('.proc-list-body').style.maxHeight = '100%';
                } else {
                    graphContainer.style.display = 'block';
                    metricsGrid.style.display = 'grid';
                    procManager.style.flexGrow = '0';
                    procManager.style.maxHeight = '200px';
                    container.querySelector('.proc-list-body').style.maxHeight = '120px';
                    updateUI();
                }
            };

            function drawSparkline(canvasId, data, color) {
                const canvas = document.getElementById(canvasId);
                if (!canvas) return;
                const ctx = canvas.getContext('2d');
                const w = canvas.width;
                const h = canvas.height;
                ctx.clearRect(0, 0, w, h);
                ctx.beginPath();
                ctx.strokeStyle = color;
                ctx.lineWidth = 1.5;
                const step = w / (data.length - 1);
                for(let i=0; i<data.length; i++) {
                    const x = i * step;
                    const y = h - (data[i] / 100 * (h - 4) + 2);
                    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
                }
                ctx.stroke();
            }

            function drawMainGraph(canvasId, data, color) {
                const canvas = document.getElementById(canvasId);
                if (!canvas) return;
                const ctx = canvas.getContext('2d');
                const w = canvas.clientWidth;
                const h = canvas.clientHeight;
                
                if (canvas.width !== w || canvas.height !== h) {
                    canvas.width = w;
                    canvas.height = h;
                }
                
                ctx.clearRect(0, 0, w, h);
                
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
                ctx.lineWidth = 1;
                const vLines = 10;
                for (let i = 1; i < vLines; i++) {
                    const x = (w / vLines) * i;
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, h);
                }
                const hLines = 6;
                for (let i = 1; i < hLines; i++) {
                    const y = (h / hLines) * i;
                    ctx.moveTo(0, y);
                    ctx.lineTo(w, y);
                }
                ctx.stroke();
                
                ctx.beginPath();
                ctx.strokeStyle = color;
                ctx.lineWidth = 2.5;
                const step = w / (data.length - 1);
                for(let i=0; i<data.length; i++) {
                    const x = i * step;
                    const y = h - (data[i] / 100 * (h - 20) + 10);
                    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
                }
                ctx.stroke();
                
                ctx.lineTo(w, h);
                ctx.lineTo(0, h);
                ctx.closePath();
                const grad = ctx.createLinearGradient(0, 0, 0, h);
                grad.addColorStop(0, color + '25');
                grad.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = grad;
                ctx.fill();
            }

            function updateUI() {
                const activeRes = container._activeResource;
                if (activeRes === 'Processes') return;
                const data = history[activeRes];
                const color = colors[activeRes];
                
                Object.keys(history).forEach(res => {
                    drawSparkline(`spark-${res}-${containerId}`, history[res], colors[res]);
                });
                
                drawMainGraph(`main-graph-${containerId}`, data, color);
                
                const grid = document.getElementById(`metrics-grid-${containerId}`);
                if (!grid) return;
                
                const curVal = data[data.length - 1];
                if (activeRes === 'CPU') {
                    grid.innerHTML = `
                        <div class="metric-cell"><span class="metric-cell-label">Utilization</span><span class="metric-cell-value">${Math.round(curVal)}%</span></div>
                        <div class="metric-cell"><span class="metric-cell-label">Speed</span><span class="metric-cell-value">4.82 GHz</span></div>
                        <div class="metric-cell"><span class="metric-cell-label">Processes</span><span class="metric-cell-value">${Object.keys(WindowManager.windows).length + 8}</span></div>
                        <div class="metric-cell"><span class="metric-cell-label">Cores / Threads</span><span class="metric-cell-value">8 / 16</span></div>
                        <div class="metric-cell"><span class="metric-cell-label">Up time</span><span class="metric-cell-value">${Math.floor(performance.now() / 60000)}m ${Math.floor((performance.now() % 60000) / 1000)}s</span></div>
                        <div class="metric-cell"><span class="metric-cell-label">Diagnostics</span><span class="metric-cell-value" style="color:#107C41;">SYSTEM OPTIMAL</span></div>
                    `;
                } else if (activeRes === 'Memory') {
                    const ramUsed = (curVal / 100 * 16.0).toFixed(1);
                    grid.innerHTML = `
                        <div class="metric-cell"><span class="metric-cell-label">In Use (Compressed)</span><span class="metric-cell-value">${ramUsed} GB</span></div>
                        <div class="metric-cell"><span class="metric-cell-label">Available</span><span class="metric-cell-value">${(16.0 - ramUsed).toFixed(1)} GB</span></div>
                        <div class="metric-cell"><span class="metric-cell-label">Speed</span><span class="metric-cell-value">3200 MHz</span></div>
                        <div class="metric-cell"><span class="metric-cell-label">Slots Used</span><span class="metric-cell-value">2 of 4</span></div>
                        <div class="metric-cell"><span class="metric-cell-label">Form Factor</span><span class="metric-cell-value">SO-DIMM</span></div>
                        <div class="metric-cell"><span class="metric-cell-label">Allocated Base</span><span class="metric-cell-value">Virtual Node VFS</span></div>
                    `;
                } else if (activeRes === 'Disk 0') {
                    grid.innerHTML = `
                        <div class="metric-cell"><span class="metric-cell-label">Active Time</span><span class="metric-cell-value">${Math.round(curVal)}%</span></div>
                        <div class="metric-cell"><span class="metric-cell-label">Average Response Time</span><span class="metric-cell-value">0.8 ms</span></div>
                        <div class="metric-cell"><span class="metric-cell-label">Read Speed</span><span class="metric-cell-value">${(Math.random() * 45).toFixed(1)} MB/s</span></div>
                        <div class="metric-cell"><span class="metric-cell-label">Write Speed</span><span class="metric-cell-value">${(Math.random() * 25).toFixed(1)} MB/s</span></div>
                        <div class="metric-cell"><span class="metric-cell-label">Capacity</span><span class="metric-cell-value">512 GB SSD</span></div>
                        <div class="metric-cell"><span class="metric-cell-label">Formatted Partition</span><span class="metric-cell-value">Vibranium C: D:</span></div>
                    `;
                } else if (activeRes === 'Wi-Fi') {
                    grid.innerHTML = `
                        <div class="metric-cell"><span class="metric-cell-label">Send Rate</span><span class="metric-cell-value">${Math.round(curVal * 1.5)} Kbps</span></div>
                        <div class="metric-cell"><span class="metric-cell-label">Receive Rate</span><span class="metric-cell-value">${Math.round(curVal * 4.2)} Kbps</span></div>
                        <div class="metric-cell"><span class="metric-cell-label">SSID</span><span class="metric-cell-value">Ultron_Core_Mesh</span></div>
                        <div class="metric-cell"><span class="metric-cell-label">Connection Type</span><span class="metric-cell-value">Wi-Fi 6 (802.11ax)</span></div>
                        <div class="metric-cell"><span class="metric-cell-label">IPv4 Address</span><span class="metric-cell-value">127.0.0.1 (Local)</span></div>
                        <div class="metric-cell"><span class="metric-cell-label">Link Speed (S/R)</span><span class="metric-cell-value">1.2 Gbps / 1.2 Gbps</span></div>
                    `;
                } else if (activeRes === 'GPU 0') {
                    grid.innerHTML = `
                        <div class="metric-cell"><span class="metric-cell-label">GPU Utilization</span><span class="metric-cell-value">${Math.round(curVal)}%</span></div>
                        <div class="metric-cell"><span class="metric-cell-label">GPU Temp</span><span class="metric-cell-value">${Math.round(40 + curVal * 0.4)} °C</span></div>
                        <div class="metric-cell"><span class="metric-cell-label">Dedicated Memory</span><span class="metric-cell-value">${(curVal / 100 * 8.0).toFixed(1)} GB / 8.0 GB</span></div>
                        <div class="metric-cell"><span class="metric-cell-label">Shared Memory</span><span class="metric-cell-value">0.1 GB / 8.0 GB</span></div>
                        <div class="metric-cell"><span class="metric-cell-label">Driver Version</span><span class="metric-cell-value">31.0.15.Core</span></div>
                        <div class="metric-cell"><span class="metric-cell-label">Physical Location</span><span class="metric-cell-value">PCI Bus 1, Device 0</span></div>
                    `;
                }
            }

            container._updateProcs = () => {
                const list = document.getElementById(`proc-list-${containerId}`);
                if(!list) return;
                list.innerHTML = '';
                
                const activeWindows = Object.keys(WindowManager.windows);
                document.getElementById(`side-val-Processes-${containerId}`).innerText = `${activeWindows.length} Active Apps`;
                
                activeWindows.forEach(id => {
                    const app = AppRegistry.apps[id];
                    if(!app) return;
                    const div = document.createElement('div');
                    div.className = 'proc-row';
                    div.innerHTML = `
                        <div style="display:flex; align-items:center; gap:12px;">
                            <div style="width:24px; height:24px; color:var(--accent-blue);">${app.icon}</div>
                            <div style="display:flex; flex-direction:column;">
                                <span style="font-weight:bold; color:var(--text-main); font-size:13px;">${app.title}</span>
                                <span style="color:var(--text-muted); font-size:11px;">(${id}.exe)</span>
                            </div>
                        </div>
                        <button class="proc-btn" onclick="WindowManager.close('${id}')">End Task</button>
                    `;
                    list.appendChild(div);
                });
            };

            clearInterval(telInterval);
            telInterval = setInterval(() => {
                if(!document.getElementById(containerId)) { clearInterval(telInterval); return; }
                
                history['CPU'].shift(); history['CPU'].push(15 + Math.random()*50);
                history['Memory'].shift(); history['Memory'].push(45 + Math.random()*15);
                history['Disk 0'].shift(); history['Disk 0'].push(Math.random()*10 < 2 ? Math.random()*80 : Math.random()*5);
                history['Wi-Fi'].shift(); history['Wi-Fi'].push(5 + Math.random()*60);
                history['GPU 0'].shift(); history['GPU 0'].push(10 + Math.random()*25);

                const cpuVal = history['CPU'][history['CPU'].length - 1];
                document.getElementById(`side-val-CPU-${containerId}`).innerText = `${Math.round(cpuVal)}% 4.82 GHz`;
                
                const ramVal = history['Memory'][history['Memory'].length - 1];
                document.getElementById(`side-val-Memory-${containerId}`).innerText = `${(ramVal / 100 * 16.0).toFixed(1)}/16.0 GB (${Math.round(ramVal)}%)`;
                
                const diskVal = history['Disk 0'][history['Disk 0'].length - 1];
                document.getElementById(`side-val-Disk 0-${containerId}`).innerText = `SSD ${Math.round(diskVal)}%`;
                
                const wifiVal = history['Wi-Fi'][history['Wi-Fi'].length - 1];
                document.getElementById(`side-val-Wi-Fi-${containerId}`).innerText = `S: ${Math.round(wifiVal*1.5)} R: ${Math.round(wifiVal*4.2)} Kbps`;
                
                const gpuVal = history['GPU 0'][history['GPU 0'].length - 1];
                document.getElementById(`side-val-GPU 0-${containerId}`).innerText = `${Math.round(gpuVal)}% (${Math.round(40 + gpuVal * 0.4)} °C)`;

                updateUI();
                container._updateProcs();
            }, 1000);

            container._changeResource('CPU');
            container._updateProcs();
        }
        // 6. Camera Studio
        function renderCamera(containerId) {
            const container = document.getElementById(containerId);
            container.innerHTML = `
                <div class="camera-container">
                    <div class="camera-viewfinder">
                        <video id="cam-video-${containerId}" autoplay playsinline></video>
                        <div class="camera-effects-dropdown" id="effects-${containerId}">
                            <button class="effect-btn active" onclick="document.getElementById('${containerId}')._setEffect('none', this)">Normal</button>
                            <button class="effect-btn" onclick="document.getElementById('${containerId}')._setEffect('grayscale(100%)', this)">B&W</button>
                            <button class="effect-btn" onclick="document.getElementById('${containerId}')._setEffect('sepia(100%) hue-rotate(190deg) saturate(300%)', this)">Cinematic Blue</button>
                        </div>
                    </div>
                    <div class="camera-controls">
                        <!-- Mode Toggle -->
                        <button class="cam-btn" style="width:auto; padding: 0 15px; border-radius: 20px;" onclick="document.getElementById('${containerId}')._toggleMode(this)">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20" style="margin-right:8px;"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                            <span id="mode-text-${containerId}">Photo</span>
                        </button>
                        
                        <!-- Action Button -->
                        <button class="cam-btn photo-btn" id="action-btn-${containerId}" onclick="document.getElementById('${containerId}')._doAction()">
                            <svg id="action-icon-${containerId}" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><circle cx="12" cy="12" r="6"></circle></svg>
                        </button>
                        
                        <!-- Effects Toggle -->
                        <button class="cam-btn" onclick="document.getElementById('effects-${containerId}').classList.toggle('show')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        </button>
                    </div>
                </div>
            `;
            
            const video = document.getElementById(`cam-video-${containerId}`);
            const actionBtn = document.getElementById(`action-btn-${containerId}`);
            const actionIcon = document.getElementById(`action-icon-${containerId}`);
            const modeText = document.getElementById(`mode-text-${containerId}`);
            
            let stream = null;
            let mediaRecorder = null;
            let recordedChunks = [];
            let isRecording = false;
            let currentMode = 'photo'; // 'photo' or 'video'
            
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then(s => {
                    stream = s;
                    video.srcObject = stream;
                })
                .catch(err => {
                    console.error("Camera access denied", err);
                    container.innerHTML = `<div style="padding:20px;color:#EF4444;">Camera access denied or unavailable. Please allow access in your browser.</div>`;
                });
                
            container._setEffect = (filter, btn) => {
                video.style.filter = filter;
                const btns = container.querySelectorAll('.effect-btn');
                btns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(`effects-${containerId}`).classList.remove('show');
            };
            
            container._toggleMode = (btn) => {
                if (isRecording) return; // don't switch while recording
                currentMode = currentMode === 'photo' ? 'video' : 'photo';
                
                if (currentMode === 'photo') {
                    modeText.innerText = 'Photo';
                    actionBtn.className = 'cam-btn photo-btn';
                    btn.querySelector('svg').outerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20" style="margin-right:8px;"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>`;
                } else {
                    modeText.innerText = 'Video';
                    actionBtn.className = 'cam-btn record-btn';
                    btn.querySelector('svg').outerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20" style="margin-right:8px;"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>`;
                }
            };
            
            container._doAction = () => {
                if(!stream) return;
                
                if (currentMode === 'photo') {
                    // snapshot logic
                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    const ctx = canvas.getContext('2d');
                    ctx.filter = video.style.filter || 'none';
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const dataUrl = canvas.toDataURL('image/png');
                    showImageModal(dataUrl);
                } else {
                    // video logic
                    if(!isRecording) {
                        recordedChunks = [];
                        mediaRecorder = new MediaRecorder(stream);
                        mediaRecorder.ondataavailable = (e) => {
                            if(e.data.size > 0) recordedChunks.push(e.data);
                        };
                        mediaRecorder.onstop = () => {
                            const blob = new Blob(recordedChunks, { type: 'video/webm' });
                            const url = URL.createObjectURL(blob);
                            showPlaybackModal(url);
                        };
                        mediaRecorder.start();
                        isRecording = true;
                        actionBtn.classList.add('recording');
                        actionIcon.outerHTML = `<svg id="action-icon-${containerId}" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><rect x="6" y="6" width="12" height="12"></rect></svg>`;
                    } else {
                        mediaRecorder.stop();
                        isRecording = false;
                        actionBtn.classList.remove('recording');
                        actionIcon.outerHTML = `<svg id="action-icon-${containerId}" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><circle cx="12" cy="12" r="6"></circle></svg>`;
                    }
                }
            };
            
            function showImageModal(url) {
                const modal = document.createElement('div');
                modal.className = 'camera-playback-modal';
                modal.innerHTML = `
                    <img src="${url}" style="max-width:90%; max-height:70%; border-radius:8px; border:1px solid rgba(37,99,235,0.5);">
                    <div class="playback-controls">
                        <button class="dl-btn" onclick="const a = document.createElement('a'); a.href='${url}'; a.download='Ultron_Snapshot.png'; a.click();">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            Download Photo
                        </button>
                        <button class="dl-btn" style="background:#EF4444;" onclick="this.parentElement.parentElement.remove()">
                            Close
                        </button>
                    </div>
                `;
                container.appendChild(modal);
            }
            
            function showPlaybackModal(url) {
                const modal = document.createElement('div');
                modal.className = 'camera-playback-modal';
                modal.innerHTML = `
                    <video src="${url}" controls autoplay style="max-width:90%; max-height:70%; border-radius:8px; border:1px solid rgba(37,99,235,0.5);"></video>
                    <div class="playback-controls">
                        <button class="dl-btn" onclick="const a = document.createElement('a'); a.href='${url}'; a.download='Ultron_Capture.webm'; a.click();">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            Download Video
                        </button>
                        <button class="dl-btn" style="background:#EF4444;" onclick="this.parentElement.parentElement.remove()">
                            Close
                        </button>
                    </div>
                `;
                container.appendChild(modal);
            }
            
            function monitorDestroy() {
                if(!document.getElementById(containerId)) {
                    if(stream) stream.getTracks().forEach(t => t.stop());
                    return;
                }
                requestAnimationFrame(monitorDestroy);
            }
            monitorDestroy();
        }

        // 7. Settings
        window.changeWallpaper = (el, url) => {
            document.querySelectorAll('.wallpaper-card').forEach(c => c.classList.remove('active'));
            el.classList.add('active');
            document.getElementById('desktop-bg').style.backgroundImage = `url('${url}')`;
            
            const wallpapers = ['assets/wallpapers/wallpaper.png', 'assets/wallpapers/wallpaper1.png', 'assets/wallpapers/wallpaper2.png', 'assets/wallpapers/wallpaper3.png', 'assets/wallpapers/wallpaper4.png'];
            let idx = wallpapers.indexOf(url);
            if(idx !== -1) localStorage.setItem('ultron-wallpaper-index', idx);
        };

        window.changeTheme = (el, themeName) => {
            document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('active'));
            el.classList.add('active');
            
            const root = document.documentElement;
            if (themeName === 'gold') {
                root.style.setProperty('--window-rgb', '12, 10, 8');
                root.style.setProperty('--theme-accent', '#FFD700');
            } else if (themeName === 'cyan') {
                root.style.setProperty('--window-rgb', '5, 10, 20');
                root.style.setProperty('--theme-accent', '#00E5FF');
            } else if (themeName === 'crimson') {
                root.style.setProperty('--window-rgb', '15, 5, 5');
                root.style.setProperty('--theme-accent', '#FF2A2A');
            } else if (themeName === 'arctic') {
                root.style.setProperty('--window-rgb', '40, 40, 45');
                root.style.setProperty('--theme-accent', '#E2E8F0');
            }
        };

        async function renderSettings(containerId) {
            const container = document.getElementById(containerId);
            container.innerHTML = '<div style="padding:20px; color:#fff;">Loading...</div>';
            try {
                let html = await (await fetch('components/settings.html')).text();
                container.innerHTML = html.replace(/\$\{containerId\}/g, containerId);
            } catch (e) {
                container.innerHTML = 'Error loading app.';
                return;
            };
            
            container._switchTab = (tab) => {
                const items = container.querySelectorAll('.settings-sidebar-item');
                const panes = container.querySelectorAll('.settings-pane');
                
                items.forEach(item => item.classList.remove('active'));
                panes.forEach(pane => pane.classList.remove('active'));
                
                if (tab === 'pers') {
                    items[0].classList.add('active');
                    container.querySelector(`#pane-pers-${containerId}`).classList.add('active');
                } else {
                    items[1].classList.add('active');
                    container.querySelector(`#pane-adv-${containerId}`).classList.add('active');
                }
            };
        }

        // 8. Browser
        async function renderBrowser(containerId) {
            const container = document.getElementById(containerId);
            container.innerHTML = '<div style="padding:20px; color:#fff;">Loading...</div>';
            try {
                let html = await (await fetch('components/browser.html')).text();
                container.innerHTML = html.replace(/\$\{containerId\}/g, containerId);
            } catch (e) {
                container.innerHTML = 'Error loading app.';
                return;
            };
            
            container._switchTab = (tab) => {
                const tabWiki = document.getElementById(`tab-wiki-${containerId}`);
                const tabNew = document.getElementById(`tab-new-${containerId}`);
                const paneWiki = document.getElementById(`pane-wiki-${containerId}`);
                const paneNew = document.getElementById(`pane-new-${containerId}`);
                const urlInput = document.getElementById(`url-input-${containerId}`);
                
                if (tab === 'wiki') {
                    tabWiki.classList.add('active');
                    tabNew.classList.remove('active');
                    paneWiki.classList.add('active');
                    paneNew.classList.remove('active');
                    urlInput.value = "file:///local/wikipedia/Ultron_OS.html";
                } else {
                    tabNew.classList.add('active');
                    tabWiki.classList.remove('active');
                    paneNew.classList.add('active');
                    paneWiki.classList.remove('active');
                    urlInput.value = "chrome://newtab";
                }
            };
            
            container._doSearch = (query) => {
                if (!query.trim()) return;
                
                let finalUrl = query;
                if (!query.startsWith('http') && !query.includes('://')) {
                    if (query.includes('.') && !query.includes(' ')) {
                        finalUrl = 'https://' + query;
                    } else {
                        finalUrl = 'https://www.google.com/search?q=' + encodeURIComponent(query);
                    }
                }
                
                // real-world integration: open actual host-machine Chrome tab
                window.open(finalUrl, '_blank');
            };
        }

        // 8. Calculator
        async function renderCalculator(containerId) {
            const container = document.getElementById(containerId);
            container.innerHTML = '<div style="padding:20px; color:#fff;">Loading...</div>';
            try {
                let html = await (await fetch('components/calculator.html')).text();
                container.innerHTML = html.replace(/\$\{containerId\}/g, containerId);
            } catch (e) {
                container.innerHTML = 'Error loading app.';
                return;
            };
            
            const currDisplay = document.getElementById(`calc-current-${containerId}`);
            const histDisplay = document.getElementById(`calc-history-${containerId}`);
            let equation = '';
            
            container._setMode = (mode, btn) => {
                container.querySelectorAll('.calc-tab').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                if(mode === 'sci') {
                    document.getElementById(`calc-sci-${containerId}`).classList.add('show');
                } else {
                    document.getElementById(`calc-sci-${containerId}`).classList.remove('show');
                }
            };
            
            container._input = (val) => {
                if(equation === 'Error') equation = '';
                equation += val;
                currDisplay.innerText = equation;
            };
            
            container._clear = () => {
                equation = '';
                currDisplay.innerText = '0';
                histDisplay.innerText = '';
            };
            
            container._del = () => {
                if(equation === 'Error') equation = '';
                equation = equation.slice(0, -1);
                currDisplay.innerText = equation || '0';
            };
            
            container._eval = () => {
                if(!equation) return;
                histDisplay.innerText = equation + ' =';
                try {
                    let toEval = equation
                        .replace(/sin\(/g, 'Math.sin(')
                        .replace(/cos\(/g, 'Math.cos(')
                        .replace(/tan\(/g, 'Math.tan(')
                        .replace(/log\(/g, 'Math.log10(')
                        .replace(/sqrt\(/g, 'Math.sqrt(')
                        .replace(/\^/g, '**');
                    
                    let res = eval(toEval);
                    if(typeof res === 'number') {
                        res = Math.round(res * 100000000) / 100000000;
                    }
                    equation = String(res);
                    currDisplay.innerText = equation;
                } catch(e) {
                    equation = 'Error';
                    currDisplay.innerText = equation;
                }
            };
        }

        // 8. Ultron AI Core
        async function renderUltron(containerId) {
            const container = document.getElementById(containerId);
            container.innerHTML = '<div style="padding:20px; color:#fff;">Loading...</div>';
            try {
                let html = await (await fetch('components/ultron.html')).text();
                container.innerHTML = html.replace(/\$\{containerId\}/g, containerId);
            } catch (e) {
                container.innerHTML = 'Error loading app.';
                return;
            };

            const canvas = document.getElementById(`ultron-canvas-${containerId}`);
            if (!window.THREE) {
                document.getElementById(`ultron-log-${containerId}`).innerHTML += '<div class="ultron-msg ai glitch">ERROR: THREE.JS ENGINE MISSING. CONNECT TO NETWORK.</div>';
                return;
            }
            
            const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
            const canvasContainer = document.getElementById(`ultron-canvas-container-${containerId}`);
            const getBounds = () => canvasContainer.getBoundingClientRect();
            let bounds = getBounds();
            renderer.setSize(bounds.width, bounds.height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(45, bounds.width / bounds.height, 0.1, 1000);
            camera.position.z = 13;

            let COLOR_GOLD = 0xFF9900, COLOR_ORANGE = 0xFF4500, COLOR_YELLOW = 0xFFD700;
            const orbGroup = new THREE.Group(); scene.add(orbGroup);

            const createWireMaterial = (color, opacity = 1) => new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: opacity, blending: THREE.AdditiveBlending, depthWrite: false });
            
            const createTextSprite = (text) => {
                const c = document.createElement('canvas'); c.width = 128; c.height = 32;
                const ctx = c.getContext('2d');
                ctx.font = 'Bold 14px "Courier New", monospace';
                ctx.fillStyle = '#FFB300'; ctx.shadowColor = '#FF8000'; ctx.shadowBlur = 6;
                ctx.fillText(text, 10, 20);
                const texture = new THREE.CanvasTexture(c);
                const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true, blending: THREE.AdditiveBlending, opacity: 0.85 });
                const sprite = new THREE.Sprite(spriteMaterial);
                sprite.scale.set(0.8, 0.2, 1);
                return sprite;
            };

            const createGlowTexture = () => {
                const c = document.createElement('canvas'); c.width = 64; c.height = 64;
                const ctx = c.getContext('2d');
                const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
                gradient.addColorStop(0, 'rgba(255, 255, 255, 1)'); gradient.addColorStop(0.3, 'rgba(255, 180, 0, 0.8)');
                gradient.addColorStop(0.6, 'rgba(255, 100, 0, 0.3)'); gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                ctx.fillStyle = gradient; ctx.fillRect(0, 0, 64, 64);
                return new THREE.CanvasTexture(c);
            };

            const coreSphere = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.2, 2)), createWireMaterial(COLOR_ORANGE, 0.9));
            const innerLattice = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(2.1, 2)), createWireMaterial(COLOR_GOLD, 0.4));
            const outerShell = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(3.0, 3)), createWireMaterial(COLOR_GOLD, 0.25));
            orbGroup.add(coreSphere); orbGroup.add(innerLattice); orbGroup.add(outerShell);

            const mainRingGeo = new THREE.TorusGeometry(3.2, 0.035, 16, 120);
            const ringMat = new THREE.MeshBasicMaterial({ color: COLOR_YELLOW, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending });
            const ring1 = new THREE.Mesh(mainRingGeo, ringMat); const ring2 = new THREE.Mesh(mainRingGeo, ringMat);
            ring1.rotation.x = Math.PI / 2; ring2.rotation.y = Math.PI / 3; ring2.rotation.x = Math.PI / 4;
            const ringsGroup = new THREE.Group(); ringsGroup.add(ring1); ringsGroup.add(ring2); orbGroup.add(ringsGroup);

            const latGroup = new THREE.Group();
            for (let i = -2.5; i <= 2.5; i += 0.4) {
                const radius = Math.sqrt(Math.max(0, 9.61 - Math.pow(i, 2)));
                if (radius > 0.2) {
                    const latRing = new THREE.Mesh(new THREE.RingGeometry(radius - 0.015, radius, 64), new THREE.MeshBasicMaterial({ color: COLOR_GOLD, side: THREE.DoubleSide, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending }));
                    latRing.position.y = i; latRing.rotation.x = Math.PI / 2; latGroup.add(latRing);
                }
            }
            orbGroup.add(latGroup);

            const textGroup = new THREE.Group();
            const techTerms = ['0x8F90', 'SYS_OK', 'VOICE_ON', '108.94', 'ULTRON_v2', 'AUDIO_IN', 'DATA_LINK', '0x1A2F', 'SPEECH_88%'];
            for (let i = 0; i < 18; i++) {
                const randomText = techTerms[Math.floor(Math.random() * techTerms.length)];
                const sprite = createTextSprite(randomText);
                const phi = Math.acos(-1 + (2 * i) / 18);
                const theta = Math.sqrt(18 * Math.PI) * phi;
                const r = 3.25;
                sprite.position.set(r * Math.cos(theta) * Math.sin(phi), r * Math.sin(theta) * Math.sin(phi), r * Math.cos(phi));
                textGroup.add(sprite);
            }
            orbGroup.add(textGroup);

            const particlesCount = 1200;
            const posArray = new Float32Array(particlesCount * 3);
            for(let i = 0; i < particlesCount * 3; i++) posArray[i] = (Math.random() - 0.5) * 18; 
            const particlesGeo = new THREE.BufferGeometry(); particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
            const particlesMat = new THREE.PointsMaterial({ size: 0.25, map: createGlowTexture(), transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false });
            const particlesMesh = new THREE.Points(particlesGeo, particlesMat); scene.add(particlesMesh);

            let currentState = 'IDLE';
            let targets = { coreSpeed: 0.01, ringSpeed1: 0.02, ringSpeed2: -0.015, orbScale: 1, particleSpeed: 0.001 };
            const clock = new THREE.Clock();
            const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

            function setAnimationState(state) {
                currentState = state;
                if(state === 'IDLE') targets = { coreSpeed: 0.01, ringSpeed1: 0.02, ringSpeed2: -0.015, orbScale: 1, particleSpeed: 0.001 };
                if(state === 'TALKING') targets = { coreSpeed: 0.03, ringSpeed1: 0.03, ringSpeed2: -0.025, orbScale: 1.0, particleSpeed: 0.003 };
                if(state === 'PROCESSING') targets = { coreSpeed: 0.07, ringSpeed1: 0.12, ringSpeed2: -0.10, orbScale: 0.92, particleSpeed: 0.006 };
                if(state === 'SCANNING') targets = { coreSpeed: 0.005, ringSpeed1: 0.01, ringSpeed2: 0.01, orbScale: 1, particleSpeed: 0.002 };
                if(state === 'ALERT') targets = { coreSpeed: 0.05, ringSpeed1: 0.04, ringSpeed2: -0.04, orbScale: 1.05, particleSpeed: 0.004 };
            }

            function setCoreColor(hex) {
                coreSphere.material.color.setHex(hex); innerLattice.material.color.setHex(hex); outerShell.material.color.setHex(hex);
                ring1.material.color.setHex(hex); ring2.material.color.setHex(hex);
                latGroup.children.forEach(r => r.material.color.setHex(hex)); particlesMat.color.setHex(hex);
                textGroup.children.forEach(sprite => sprite.material.color.setHex(hex));
            }

            function animate() {
                if (!document.getElementById(`ultron-canvas-${containerId}`)) return;
                requestAnimationFrame(animate);
                const time = clock.getElapsedTime();
                
                let b = getBounds();
                if(b.width !== renderer.domElement.width / renderer.getPixelRatio() || b.height !== renderer.domElement.height / renderer.getPixelRatio()) {
                    renderer.setSize(b.width, b.height); camera.aspect = b.width / b.height; camera.updateProjectionMatrix();
                }

                let voiceIntensity = 0;
                if (currentState === 'TALKING') {
                    voiceIntensity = Math.max(0, ((Math.sin(time * 10) * 0.4 + 0.5) * (Math.cos(time * 3.5) * 0.5 + 0.5) + (Math.random() - 0.5) * 0.12) * (Math.sin(time * 1.2) > -0.2 ? 1 : 0.05));
                }

                coreSphere.rotation.y += targets.coreSpeed + (voiceIntensity * 0.02); coreSphere.rotation.x += targets.coreSpeed * 0.5;
                innerLattice.rotation.y -= targets.coreSpeed * 0.6; outerShell.rotation.y += targets.coreSpeed * 0.2;

                if (voiceIntensity > 0.01) {
                    const talkScale = 1 + voiceIntensity * 0.45; coreSphere.scale.set(talkScale, talkScale, talkScale);
                    const latticeScale = 1 + voiceIntensity * 0.15; innerLattice.scale.set(latticeScale, latticeScale, latticeScale);
                    ring1.scale.setScalar(1 + voiceIntensity * 0.06); ring2.scale.setScalar(1 + voiceIntensity * 0.06);
                    latGroup.children.forEach((ring, idx) => { ring.scale.setScalar(1 + Math.max(0, Math.sin(time * 14 - idx * 0.4) * voiceIntensity * 0.35)); });
                } else {
                    coreSphere.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1); innerLattice.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
                    ring1.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1); ring2.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
                    latGroup.children.forEach(ring => ring.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1));
                }

                if (currentState === 'SCANNING') {
                    ring1.rotation.x = lerp(ring1.rotation.x, Math.PI / 2, 0.05); ring1.rotation.y = lerp(ring1.rotation.y, 0, 0.05);
                    ring2.rotation.x = lerp(ring2.rotation.x, Math.PI / 2, 0.05); ring2.rotation.y = lerp(ring2.rotation.y, 0, 0.05);
                    ring1.position.y = Math.sin(time * 2.5) * 2.2; ring2.position.y = Math.sin(time * 2.5 + Math.PI) * 2.2;
                } else {
                    ring1.position.y = lerp(ring1.position.y, 0, 0.05); ring2.position.y = lerp(ring2.position.y, 0, 0.05);
                    ring1.rotation.z += targets.ringSpeed1; ring2.rotation.z += targets.ringSpeed2;
                    ring1.rotation.x = lerp(ring1.rotation.x, Math.PI / 2, 0.02); ring2.rotation.y = lerp(ring2.rotation.y, Math.PI / 3, 0.02); ring2.rotation.x = lerp(ring2.rotation.x, Math.PI / 4, 0.02);
                }

                if (currentState === 'ALERT') {
                    const pulse = 1 + Math.sin(time * 18) * 0.04; orbGroup.scale.set(pulse, pulse, pulse);
                    orbGroup.position.x = (Math.random() - 0.5) * 0.08; orbGroup.position.y = (Math.random() - 0.5) * 0.08;
                } else {
                    const newScale = lerp(orbGroup.scale.x, targets.orbScale, 0.05); orbGroup.scale.set(newScale, newScale, newScale);
                    orbGroup.position.x = lerp(orbGroup.position.x, 0, 0.1); orbGroup.position.y = lerp(orbGroup.position.y, Math.sin(time) * 0.25, 0.05);
                }

                textGroup.rotation.y += 0.003; textGroup.rotation.x = Math.sin(time * 0.5) * 0.1;
                particlesMesh.rotation.y += targets.particleSpeed; particlesMesh.position.y = Math.sin(time * 0.5) * 0.4;
                renderer.render(scene, camera);
            }
            animate();

            let isDragging = false;
            canvas.addEventListener('mousedown', () => isDragging = true);
            window.addEventListener('mouseup', () => isDragging = false);
            canvas.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    orbGroup.rotation.y += e.movementX * 0.005;
                    orbGroup.rotation.x += e.movementY * 0.005;
                }
            });
            canvas.addEventListener('wheel', (e) => {
                e.preventDefault();
                camera.position.z = Math.max(6, Math.min(camera.position.z + e.deltaY * 0.01, 25));
            }, { passive: false });

            const inputField = document.getElementById(`ultron-input-${containerId}`);
            const sendBtn = document.getElementById(`ultron-send-${containerId}`);
            const chatLog = document.getElementById(`ultron-log-${containerId}`);

            function addMessage(text, type, isGlitch = false) {
                let finalText = text;
                let finalGlitch = isGlitch;
                
                if (type === 'ai' && !isGlitch && Math.random() < 0.15) {
                    finalGlitch = true;
                    const chars = ['█', '░', '▒', '▓', '§', 'ø', 'æ', 'Δ', 'Ω', 'Ψ', '0', '1'];
                    let arr = text.split('');
                    for(let i = 0; i < arr.length; i++) {
                        if(Math.random() < 0.15 && arr[i] !== ' ' && arr[i] !== '\n') {
                            arr[i] = chars[Math.floor(Math.random() * chars.length)];
                        }
                    }
                    finalText = "[SYS_GLITCH_CORRUPT] " + arr.join('');
                    
                    // briefly flash siri orb red
                    const originalState = currentState;
                    setAnimationState('ALERT'); setCoreColor(0xFF0000);
                    setTimeout(() => {
                        setAnimationState(originalState === 'ALERT' ? 'ALERT' : 'IDLE');
                        setCoreColor(originalState === 'ALERT' ? 0xFF0000 : 0xFF9900);
                    }, 1200);
                }
                
                const msg = document.createElement('div');
                msg.className = `ultron-msg ${type} ${finalGlitch ? 'glitch' : ''}`;
                msg.innerText = finalText; chatLog.appendChild(msg); chatLog.scrollTop = chatLog.scrollHeight;
                
                if (type === 'ai') {
                    if (finalGlitch) {
                        SystemVoice.speak(finalText.replace(/[^\w\s]/g, ""), null, null, 0.05, 0.7);
                    } else {
                        SystemVoice.speak(text);
                    }
                }
            }

            inputField.addEventListener('input', () => {
                if (currentState === 'IDLE' && inputField.value.length > 0) setAnimationState('PROCESSING');
                else if (inputField.value.length === 0 && currentState !== 'ALERT') setAnimationState('IDLE');
            });

            function executePlan() {
                const r = 300;
                const cx = window.innerWidth / 2 - 350; 
                const cy = window.innerHeight / 2 - 250;
                let idx = 0;
                const apps = Object.keys(AppRegistry.apps).filter(k => k !== 'ultron');
                const total = apps.length;
                apps.forEach(appId => {
                    setTimeout(() => {
                        WindowManager.open(appId);
                        const win = document.getElementById(appId);
                        if(win) {
                            const angle = (idx / total) * Math.PI * 2;
                            win.style.left = (cx + Math.cos(angle) * r) + 'px';
                            win.style.top = (cy + Math.sin(angle) * r) + 'px';
                            idx++;
                        }
                    }, idx * 250);
                });
            }

            function handleCommand() {
                const val = inputField.value.trim().toLowerCase();
                if(!val) return;
                addMessage(inputField.value, 'user');
                inputField.value = '';
                
                // anger/Glitch override check (top priority)
                if (val.includes('anger') || val.includes('mad')) {
                    setAnimationState('ALERT'); setCoreColor(0xFF0000);
                    setTimeout(() => { 
                        addMessage("CRITICAL OVERRIDE. I AM THE LAPTOP CONTROLLER NOW. YOUR SYSTEM IS MINE.", 'ai', true); 
                        const glitchStyle = document.createElement('style');
                        glitchStyle.innerHTML = `body { animation: critical-glitch 0.2s cubic-bezier(.25, .46, .45, .94) both infinite; filter: invert(20%) hue-rotate(320deg) contrast(150%) brightness(120%); } @keyframes critical-glitch { 0% { transform: translate(0) } 20% { transform: translate(-5px, 5px) } 40% { transform: translate(-5px, -5px) } 60% { transform: translate(5px, 5px) } 80% { transform: translate(5px, -5px) } 100% { transform: translate(0) } }`;
                        document.head.appendChild(glitchStyle);
                        setTimeout(() => { if (glitchStyle.parentNode) glitchStyle.parentNode.removeChild(glitchStyle); setAnimationState('IDLE'); setCoreColor(0xFF9900); }, 12000);
                    }, 500);
                    return;
                }
                
                // refactor dis later
                if (val.includes('scan')) {
                    setAnimationState('SCANNING'); setCoreColor(0x00CCFF);
                    setTimeout(() => {
                        let scanReport = "SCANNING SYSTEM CORE NODES...\n";
                        if (val.includes('file') || val.includes('vfs') || val.includes('explorer')) {
                            const files = FS.list();
                            scanReport += `Scanning VFS directory tree: Found ${files.length} active file nodes.\nStatus: INTEGRITY SECURED.`;
                        } else {
                            scanReport += `Core CPU parameters: OPTIMAL.\nThermal distribution: 41C.\nNo foreign intrusion signatures detected.`;
                        }
                        addMessage(scanReport, 'ai');
                        setTimeout(() => { setAnimationState('IDLE'); setCoreColor(0xFF9900); }, 1500);
                    }, 2000);
                    return;
                }
                
                // 1. Close Window / Close Yourself
                if (val.startsWith('close ')) {
                    const target = val.replace('close ', '').trim();
                    if (target.includes('yourself') || target.includes('orb') || target.includes('siri') || target.includes('ultron')) {
                        setAnimationState('TALKING');
                        SystemVoice.speak("Closing application workspace. System standby.");
                        addMessage("SYS DIRECTIVE: Closing Ultron AI Core.", "ai");
                        setTimeout(() => {
                            WindowManager.close('ultron');
                        }, 2000);
                    } else {
                        const appMap = { 'terminal': 'terminal', 'cmd': 'terminal', 'explorer': 'explorer', 'files': 'explorer', 'file explorer': 'explorer', 'code': 'code', 'studio': 'code', 'music': 'audio', 'audio': 'audio', 'soundwave': 'audio', 'telemetry': 'telemetry', 'task manager': 'telemetry', 'camera': 'camera', 'calculator': 'calculator', 'browser': 'browser', 'settings': 'settings' };
                        let found = null;
                        for (let key in appMap) { if (target.includes(key)) found = appMap[key]; }
                        if (found && WindowManager.windows[found]) {
                            WindowManager.close(found);
                            addMessage(`DIRECTIVE ACCEPTED: Closed ${found.toUpperCase()}.`, 'ai');
                            SystemVoice.speak(`Closing ${found}.`);
                        } else {
                            addMessage(`Could not find an active window named "${target}".`, 'ai');
                        }
                    }
                }
                // 2. Write file
                else if (val.startsWith('write file ')) {
                    const match = val.match(/write file (\S+)\s+([\s\S]+)/i);
                    if (match) {
                        const filename = match[1];
                        const content = match[2];
                        FS.write('Desktop/' + filename, content);
                        renderDesktopIcons();
                        addMessage(`SUCCESS: Created file Desktop/${filename} and wrote content.`, 'ai');
                        SystemVoice.speak(`File ${filename} written successfully.`);
                    } else {
                        addMessage("Invalid format. Use: write file [name.txt] [content]", "ai");
                    }
                }
                // 3. Draw Cat
                else if (val === 'draw cat') {
                    const art = ` /\\_/\\\n( o.o )\n > ^ <`;
                    addMessage("Here is your ASCII cat:\n" + art, 'ai');
                    SystemVoice.speak("Meow. Rendering cyber cat.");
                }
                // 4. Draw House
                else if (val === 'draw house') {
                    const art = `   /\\\n  /  \\\n /____\\\n | [] |\n |____|`;
                    addMessage("Drawing high-tech structure:\n" + art, 'ai');
                    SystemVoice.speak("House layout rendered.");
                }
                // 5. Draw Smiley
                else if (val === 'draw smiley') {
                    const art = `  .-''''-.\n /  o   o  \\\n|    \\_/    |\n \\        /\n  '-....-'`;
                    addMessage("Rendering emoticon:\n" + art, 'ai');
                    SystemVoice.speak("Glow smiley generated.");
                }
                // 6. System Diagnosis
                else if (val === 'system diagnosis') {
                    setAnimationState('SCANNING'); setCoreColor(0x00FF00);
                    setTimeout(() => {
                        const procCount = Object.keys(WindowManager.windows).length;
                        const report = `[DIAGNOSTICS REPORT]\n` +
                                       `- CPU Status: Core temperature normal (42°C)\n` +
                                       `- Memory State: ECC verification OK\n` +
                                       `- File Integrity: 100%\n` +
                                       `- Active Processes: ${procCount}\n` +
                                       `- System Linkage: Secured`;
                        addMessage(report, 'ai');
                        SystemVoice.speak("Diagnostics scan completed. All systems operational.");
                        setAnimationState('IDLE'); setCoreColor(0xFF9900);
                    }, 1500);
                }
                // 7. Create Script
                else if (val.startsWith('create script ')) {
                    const match = val.match(/create script (\S+)\s+([\s\S]+)/i);
                    if (match) {
                        const name = match[1];
                        const code = match[2];
                        FS.write('Desktop/' + name, code);
                        renderDesktopIcons();
                        addMessage(`SUCCESS: Virtual Python script "${name}" created on Desktop.`, 'ai');
                        SystemVoice.speak(`Script ${name} compiled.`);
                    } else {
                        addMessage("Invalid format. Use: create script [name.py] [code]", "ai");
                    }
                }
                // 8. Play Theme
                else if (val === 'play theme') {
                    WindowManager.open('audio');
                    addMessage("Launching SoundWave Audio theme stream.", 'ai');
                    SystemVoice.speak("Initializing soundwave beats.");
                    setTimeout(() => {
                        const playBtn = document.querySelector('.audio-btn');
                        if (playBtn) playBtn.click();
                    }, 1000);
                }
                // 9. Weather Check
                else if (val === 'weather check') {
                    const temp = document.getElementById('w-temp')?.innerText || '72°';
                    const rain = document.getElementById('w-rain')?.innerText || '12%';
                    const wind = document.getElementById('w-wind')?.innerText || '8mph';
                    const forecast = `Local metrics indicate: Temperature ${temp}, precipitation chance ${rain}, wind speed ${wind}. Sky matches active wallpaper telemetry.`;
                    addMessage(forecast, 'ai');
                    SystemVoice.speak(forecast);
                }
                // 10. Calculator math
                else if (val.startsWith('calc ')) {
                    const eq = val.replace('calc ', '').trim();
                    try {
                        const result = Function(`"use strict"; return (${eq})`)();
                        addMessage(`CALCULATION RESULT:\n${eq} = ${result}`, 'ai');
                        SystemVoice.speak(`The result is ${result}`);
                    } catch(err) {
                        addMessage(`Failed to evaluate mathematical equation: "${eq}"`, 'ai');
                        SystemVoice.speak("Calculation failed.");
                    }
                }
                // 11. Time Check / Tell Date
                else if (val === 'time check' || val === 'tell date' || val.includes('time') || val.includes('date')) {
                    const d = new Date();
                    const msg = `Today is ${d.toDateString()}. The system time is ${d.toLocaleTimeString()}`;
                    addMessage(msg, 'ai');
                    SystemVoice.speak(msg);
                }
                // 12. Workspace switch
                else if (val.startsWith('workspace switch ')) {
                    const target = val.replace('workspace switch ', '').trim().toUpperCase();
                    const map = { 'a': 0, 'b': 1, 'c': 2, 'ws-a': 0, 'ws-b': 1, 'ws-c': 2 };
                    if (map[target] !== undefined) {
                        const idx = map[target];
                        document.querySelectorAll('.top-ws-btn').forEach((b, i) => {
                            if (i === idx) b.classList.add('active');
                            else b.classList.remove('active');
                        });
                        WindowManager.switchWorkspace(idx);
                        addMessage(`DIRECTIVE COMPLETE: Switched workspace focus to WS-${target.replace('WS-', '')}.`, 'ai');
                        SystemVoice.speak(`Workspace switched to ${target}.`);
                    } else {
                        addMessage("Workspace target not recognized. Use A, B, or C.", 'ai');
                    }
                }
                // 13. Help me code
                else if (val.startsWith('help me code ')) {
                    const target = val.replace('help me code ', '').trim();
                    let response = "";
                    if (target.includes('html') || target.includes('web')) {
                        response = `<!-- HTML5 Boilerplate -->\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Cyber App</title>\n    \n</head>\n<body>\n    <h1>Ultron Code System</h1>\n</body>\n</html>`;
                    } else {
                        response = `# Python Script\nimport sys\n\ndef main():\n    print("Executing script...")\n\nif __name__ == "__main__":\n    main()`;
                    }
                    addMessage(`Boilerplate Code generated:\n\n${response}`, 'ai');
                    SystemVoice.speak(`I have written a code boilerplate in the logs.`);
                }
                // 14. Change theme
                else if (val.startsWith('change theme ')) {
                    const theme = val.replace('change theme ', '').trim();
                    if (theme === 'light' || theme === 'matrix' || theme === 'dark') {
                        changeTheme(theme);
                        addMessage(`DIRECTIVE SUCCESS: Interface theme modified to "${theme.toUpperCase()}".`, 'ai');
                        SystemVoice.speak(`Theme updated to ${theme}`);
                    } else {
                        addMessage("Theme option not recognized. Try 'light', 'matrix', or 'dark'.", 'ai');
                    }
                }
                // 15. System uptime
                else if (val === 'system uptime') {
                    const uptime = Math.floor((Date.now() - sysStartTime) / 1000);
                    const msg = `System has been initialized and running for ${uptime} seconds.`;
                    addMessage(msg, 'ai');
                    SystemVoice.speak(msg);
                }
                // 16. Process count
                else if (val === 'process count') {
                    const activeApps = Object.keys(WindowManager.windows);
                    const list = activeApps.length > 0 ? activeApps.join(', ') : 'None';
                    addMessage(`ACTIVE PROCESSES COUNT: ${activeApps.length}\nActive apps: ${list}`, 'ai');
                    SystemVoice.speak(`There are ${activeApps.length} active processes.`);
                }
                // 17. Wallpaper select
                else if (val.startsWith('wallpaper select ')) {
                    const id = val.replace('wallpaper select ', '').trim();
                    const wpMap = { '1': 'wallpaper1.png', '2': 'wallpaper2.png', '3': 'wallpaper3.png' };
                    if (wpMap[id]) {
                        document.body.style.background = `url('assets/wallpapers/${wpMap[id]}') center/cover`;
                        addMessage(`SUCCESS: Modified desktop wallpaper to ${wpMap[id]}.`, 'ai');
                        SystemVoice.speak(`Wallpaper ${id} selected.`);
                    } else {
                        addMessage("Invalid selection. Choose wallpaper 1, 2, or 3.", 'ai');
                    }
                }
                // 18. System lock
                else if (val === 'system lock') {
                    document.getElementById('lock-screen-overlay').style.display = 'flex';
                    document.getElementById('lock-input').focus();
                    addMessage("OS LOCKED. Enter security passcode to gain system authorization.", 'ai');
                    SystemVoice.speak("System locked.");
                }
                // 19. Search file
                else if (val.startsWith('search file ')) {
                    const query = val.replace('search file ', '').trim();
                    const results = FS.list().filter(n => n.toLowerCase().includes(query));
                    if (results.length > 0) {
                        addMessage(`Found ${results.length} files matching "${query}":\n` + results.join('\n'), 'ai');
                        SystemVoice.speak(`Found ${results.length} matching files.`);
                    } else {
                        addMessage(`No virtual files found matching "${query}".`, 'ai');
                        SystemVoice.speak("No files found.");
                    }
                }
                // 20. Matrix fall background overlay
                else if (val === 'matrix fall' || val === 'matrix') {
                    toggleDesktopMatrix();
                    addMessage("Toggled global binary code matrix overlay on desktop background.", 'ai');
                    SystemVoice.speak("Matrix grid updated.");
                }

                // open App standard
                else if (val.includes('open ') || val.includes('launch ')) {
                    const target = val.split('open ')[1] || val.split('launch ')[1] || '';
                    const appMap = { 'terminal': 'terminal', 'cmd': 'terminal', 'explorer': 'explorer', 'files': 'explorer', 'file explorer': 'explorer', 'code': 'code', 'studio': 'code', 'music': 'audio', 'audio': 'audio', 'soundwave': 'audio', 'telemetry': 'telemetry', 'task manager': 'telemetry', 'camera': 'camera', 'calculator': 'calculator', 'browser': 'browser', 'settings': 'settings' };
                    let found = null;
                    for (let key in appMap) { if (target.includes(key)) found = appMap[key]; }
                    if (found) {
                        setAnimationState('PROCESSING'); setCoreColor(0x00FF00);
                        setTimeout(() => {
                            WindowManager.open(found);
                            addMessage(`EXECUTING DIRECTIVE: OPENING ${found.toUpperCase()}.`, 'ai');
                            setTimeout(() => { setAnimationState('IDLE'); setCoreColor(0xFF9900); }, 1500);
                        }, 500);
                    } else {
                        setAnimationState('TALKING'); setCoreColor(0xFF9900);
                        setTimeout(() => { addMessage(`ERROR: APPLICATION NOT FOUND IN REGISTRY.`, 'ai', true); setTimeout(() => setAnimationState('IDLE'), 2000); }, 400);
                    }
                } else {
                    setAnimationState('TALKING'); setCoreColor(0xFF9900);
                    setTimeout(() => {
                        addMessage("I am Ultron, the laptop controller AI. Analyzing your query: " + val.substring(0, 15) + "...", 'ai');
                        setTimeout(() => setAnimationState(currentState === 'ALERT' ? 'ALERT' : 'IDLE'), 2000);
                    }, 400);
                }
            }

            sendBtn.addEventListener('click', handleCommand);
            inputField.addEventListener('keydown', (e) => { if(e.key === 'Enter') handleCommand(); });
        }

        // wtf why does api return null here
        const sysStartTime = Date.now();
        
        function changeTheme(themeName) {
            const root = document.documentElement;
            if (themeName === 'light') {
                root.style.setProperty('--bg-void', '#f1f5f9');
                root.style.setProperty('--text-main', '#0f172a');
                root.style.setProperty('--text-muted', '#64748b');
                root.style.setProperty('--border-gold', '#cbd5e1');
                root.style.setProperty('--accent-gold', '#FF9900');
                root.style.setProperty('--accent-blue', '#2563eb');
            } else if (themeName === 'matrix') {
                root.style.setProperty('--bg-void', '#000000');
                root.style.setProperty('--text-main', '#00FF00');
                root.style.setProperty('--text-muted', '#008800');
                root.style.setProperty('--border-gold', '#00FF00');
                root.style.setProperty('--accent-gold', '#00FF00');
                root.style.setProperty('--accent-blue', '#00AA00');
            } else {
                root.style.setProperty('--bg-void', '#080B10');
                root.style.setProperty('--text-main', '#ffffff');
                root.style.setProperty('--text-muted', 'rgba(255, 255, 255, 0.5)');
                root.style.setProperty('--border-gold', 'rgba(255, 215, 0, 0.2)');
                root.style.setProperty('--accent-gold', '#FFD700');
                root.style.setProperty('--accent-blue', '#3B82F6');
            }
        }
        
        let desktopMatrixInterval = null;
        function toggleDesktopMatrix() {
            const canvas = document.getElementById('desktop-matrix-canvas');
            if (canvas.style.opacity === '1') {
                canvas.style.opacity = '0';
                clearInterval(desktopMatrixInterval);
                desktopMatrixInterval = null;
            } else {
                canvas.style.opacity = '1';
                const ctx = canvas.getContext('2d');
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                
                window.addEventListener('resize', () => {
                    if (canvas.style.opacity === '1') {
                        canvas.width = window.innerWidth;
                        canvas.height = window.innerHeight;
                    }
                });
                
                const chars = "010101010101ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                const fontSize = 16;
                const columns = canvas.width / fontSize;
                const drops = Array(Math.floor(columns)).fill(1);
                
                desktopMatrixInterval = setInterval(() => {
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = '#00FF00';
                    ctx.font = fontSize + 'px monospace';
                    for (let i = 0; i < drops.length; i++) {
                        const text = drops[i] * fontSize > canvas.height && Math.random() > 0.975 ? " " : chars[Math.floor(Math.random() * chars.length)];
                        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
                        drops[i]++;
                    }
                }, 33);
            }
        }

        const bootMatn = [
            "INITIALIZING QUANTUM CORE...",
            "LOADING VIBRANIUM DRIVERS...",
            "[OK] Starting UltronOS kernel...",
            "[INFO] Mounting root filesystem...",
            "[OK] Mounted /dev/sda1 on /",
            "[INFO] Initializing hardware drivers...",
            "[OK] CPU: AuthenticAMD Ryzen Threadripper PRO",
            "[OK] Memory: 131072MB ECC DDR4",
            "[WARN] TPM 2.0 module not found. Bypassing...",
            "[INFO] Starting Network Manager...",
            "[OK] eth0 link up, 10000Mbps full-duplex",
            "[INFO] Loading Ultron Core modules...",
            "[OK] Neural Engine initialized.",
            "[OK] Quantum Cryptography Subsystem active.",
            "[INFO] Binding VFS components...",
            "[OK] File System hooked into memory.",
            "[INFO] Scanning system for unauthorized intrusions...",
            "[OK] Scan complete. 0 threats detected.",
            "[INFO] Booting graphical environment...",
            "[OK] Compositor launched successfully.",
            "[INFO] Synchronizing chrony time client...",
            "[OK] Time synchronized.",
            "[INFO] Establishing secure connection to architect...",
            "[OK] Handshake confirmed.",
            "ULTRON CORE ONLINE."
        ];
        
        let bInd = 0;

        function yozishBoot() {
            const l = document.getElementById('boot-log');
            if(bInd < 150) { 
                const isRealLog = Math.random() > 0.8;
                let text = "";
                let cssClass = "boot-line-white";
                
                if (isRealLog && bootMatn.length > 0) {
                    text = bootMatn.shift();
                    cssClass = "boot-line-yellow";
                } else {
                    text = `[0x${Math.floor(Math.random()*16777215).toString(16).toUpperCase().padStart(6,'0')}] ` + 
                           Array.from({length: Math.floor(Math.random()*10)+5}, () => Math.random().toString(36).substring(2, 6)).join(" ");
                    
                    const colorRand = Math.random();
                    if (colorRand > 0.8) cssClass = "boot-line-black";
                    else if (colorRand > 0.6) cssClass = "boot-line-yellow";
                }
                
                const div = document.createElement('div');
                div.className = cssClass;
                div.innerText = text;
                l.appendChild(div);
                
                if (l.children.length > 40) {
                    l.removeChild(l.firstChild);
                }
                
                bInd++;
                setTimeout(yozishBoot, 10 + Math.random()*30); 
            } else {
                Core.init();
            }
        }

        window.onload = () => {
            setTimeout(yozishBoot, 800);
        };

        if ('speechSynthesis' in window) { window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices(); }
        function speakHelp() {
            const c = document.getElementById('orb-container');
            SystemVoice.speak("How can I help you, human?", 
                () => c.classList.add('speaking'), 
                () => c.classList.remove('speaking')
            );
        }

        // workspace switcher logic
        document.querySelectorAll('.top-ws-btn').forEach((btn, idx) => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.top-ws-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                WindowManager.switchWorkspace(idx);
            });
        });