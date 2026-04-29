/**
 * Eye Care & Training App - Logic
 * 
 * ContentSwitcher: Handles SPA navigation
 * Modules: Home, Gabor, Stereogram, Focus, Music
 */

class ContentSwitcher {
    constructor() {
        this.contentArea = document.getElementById('app-content');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.currentModule = null;

        this.init();
    }

    init() {
        // Event listeners for navigation (Header & Footer)
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const view = e.currentTarget.getAttribute('data-nav');
                this.switchView(view);
            });
        });

        // Event delegation for home screen cards
        this.contentArea.addEventListener('click', (e) => {
            const card = e.target.closest('[data-goto]');
            if (card) {
                const view = card.getAttribute('data-goto');
                this.switchView(view);
            }
        });

        // Default view
        this.switchView('home');
    }

    switchView(view) {
        // Cleanup previous module if needed
        if (this.currentModule && typeof this.currentModule.destroy === 'function') {
            this.currentModule.destroy();
        }

        // Update active nav state
        this.navLinks.forEach(link => {
            if (link.getAttribute('data-nav') === view) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Inject HTML and Init Module logic
        this.render(view);
    }

    render(view) {
        this.contentArea.innerHTML = ''; // Clear

        const container = document.createElement('div');
        container.className = 'fade-in h-full';

        switch (view) {
            case 'home':
                container.innerHTML = this.getHomeHTML();
                this.currentModule = null;
                break;
            case 'gabor':
                container.innerHTML = this.getGaborHTML();
                this.contentArea.appendChild(container);
                this.currentModule = new GaborModule();
                return;
            case 'stereo':
                container.innerHTML = this.getStereoHTML();
                this.contentArea.appendChild(container);
                this.currentModule = new StereoModule();
                return;
            case 'focus':
                container.innerHTML = this.getFocusHTML();
                this.contentArea.appendChild(container);
                this.currentModule = new FocusModule();
                return;
            case 'music':
                container.innerHTML = this.getMusicHTML();
                this.currentModule = null;
                break;
        }

        this.contentArea.appendChild(container);
    }

    // --- HTML Templates ---

    getHomeHTML() {
        return `
            <div class="text-center space-y-6 py-10">
                <h2 class="text-3xl font-bold text-emerald-400">目に休息を、視界にリフレッシュを。</h2>
                <p class="text-slate-400 max-w-md mx-auto">
                    デスクワークで疲れた目をいたわるセルフケアの時間です。<br>
                    リラックスして、目の緊張を優しく解きほぐしましょう。
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    <button data-goto="gabor" class="p-6 bg-slate-800 rounded-xl border border-slate-700 hover:border-emerald-500 hover:bg-slate-700 transition-all text-left group">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="font-bold text-emerald-300 text-lg">🌀 ガポールパッチ</h3>
                            <span class="group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                        <p class="text-xs text-slate-400">特殊な縞模様を眺めることで、視覚の仕組みをリフレッシュ。近視や老眼で疲れがちな目に。</p>
                    </button>
                    <button data-goto="stereo" class="p-6 bg-slate-800 rounded-xl border border-slate-700 hover:border-emerald-500 hover:bg-slate-700 transition-all text-left group">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="font-bold text-emerald-300 text-lg">🕶️ 3Dステレオグラム</h3>
                            <span class="group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                        <p class="text-xs text-slate-400">立体視を利用して目の筋肉を優しくストレッチします。ピント調節のリラックスに。</p>
                    </button>
                    <button data-goto="focus" class="p-6 bg-slate-800 rounded-xl border border-slate-700 hover:border-emerald-500 hover:bg-slate-700 transition-all text-left group">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="font-bold text-emerald-300 text-lg">🟢 遠近トレーニング</h3>
                            <span class="group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                        <p class="text-xs text-slate-400">前後に動く円を追うことで、凝り固まったピント調節筋肉を柔軟にします。</p>
                    </button>
                    <button data-goto="music" class="p-6 bg-slate-800 rounded-xl border border-slate-700 hover:border-emerald-500 hover:bg-slate-700 transition-all text-left group">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="font-bold text-emerald-300 text-lg">🎵 癒やしのBGM</h3>
                            <span class="group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                        <p class="text-xs text-slate-400">心安らぐヒーリングミュージックで、目とともに心身もリラックスさせましょう。</p>
                    </button>
                </div>
            </div>
        `;
    }

    getGaborHTML() {
        return `
            <div class="flex flex-col items-center space-y-4">
                <div class="text-center">
                    <h2 class="text-xl font-bold">ガポール・パッチ</h2>
                    <p class="text-xs text-emerald-400 font-medium mt-1">見るだけで「脳」から視力をサポートします</p>
                </div>

                <div class="relative w-full max-w-2xl">
                    <canvas id="gabor-canvas" width="600" height="400" class="w-full aspect-video border-4 border-slate-700 rounded-lg"></canvas>
                </div>

                <div class="bg-slate-800 p-4 rounded-xl max-w-md text-[11px] space-y-3 border border-slate-700">
                    <div>
                        <h4 class="text-emerald-400 font-bold mb-1">【効果について】</h4>
                        <p class="text-slate-300 leading-relaxed">
                            ガポール・パッチは、ノーベル物理学賞受賞者が考案した理論に基づく縞模様です。
                            このボケた模様を脳が「はっきり見よう」と処理することで、視覚野が刺激され、視力回復や老眼ケアの補助になるとされています。
                        </p>
                    </div>
                    <div class="space-y-2">
                        <h4 class="text-emerald-400 font-bold mb-1">【やり方】</h4>
                        <div class="flex items-start gap-2">
                            <span class="bg-emerald-600 px-1.5 py-0.5 rounded text-[9px] font-bold">1</span>
                            <p>画面に表示された<strong>縞模様（パッチ）の1つ</strong>に注目します。</p>
                        </div>
                        <div class="flex items-start gap-2">
                            <span class="bg-emerald-600 px-1.5 py-0.5 rounded text-[9px] font-bold">2</span>
                            <p>模様の「縞の向き」や「形」をなぞるように、<strong>30秒ほどじっと眺めてください。</strong></p>
                        </div>
                        <div class="flex items-start gap-2">
                            <span class="bg-emerald-600 px-1.5 py-0.5 rounded text-[9px] font-bold">3</span>
                            <p>終わったら、下のボタンで<strong>模様を更新</strong>して、別の場所のパッチで繰り返します。</p>
                        </div>
                    </div>
                </div>

                <div class="flex gap-4">
                    <button id="regen-gabor" class="px-8 py-3 bg-emerald-600 rounded-full hover:bg-emerald-500 font-bold transition shadow-lg">模様を更新する</button>
                    <button data-goto="home" class="px-8 py-3 bg-slate-700 rounded-full hover:bg-slate-600 transition font-bold">戻る</button>
                </div>
            </div>
        `;
    }

    getStereoHTML() {
        return `
            <div class="flex flex-col items-center space-y-4">
                <div class="text-center">
                    <h2 class="text-xl font-bold text-slate-100">3Dステレオグラム</h2>
                    <p class="text-[10px] text-emerald-400 font-medium mt-1">「2つの点」を「3つ」にする感覚を掴みましょう</p>
                </div>
                
                <div id="stereo-container" class="w-full max-w-2xl aspect-video bg-slate-900 rounded-2xl flex flex-col relative border-2 border-slate-700 shadow-2xl overflow-hidden">
                    <!-- 基準点をコンテナ内に配置し、距離を縮める -->
                    <div class="flex justify-center gap-16 pt-6 pb-2 bg-slate-900/80 z-10 border-b border-slate-800/30">
                        <div class="flex flex-col items-center gap-1">
                            <div class="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]"></div>
                            <span class="text-[7px] text-slate-500 uppercase tracking-tighter">Point A</span>
                        </div>
                        <div class="flex flex-col items-center gap-1">
                            <div class="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]"></div>
                            <span class="text-[7px] text-slate-500 uppercase tracking-tighter">Point B</span>
                        </div>
                    </div>

                    <!-- 下方向へのガイド矢印 -->
                    <div class="absolute top-[60px] left-1/2 -translate-x-1/2 z-10 text-emerald-500/30 animate-bounce pointer-events-none">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                    </div>

                    <canvas id="stereo-canvas" width="600" height="400" class="w-full h-full flex-grow opacity-90"></canvas>
                </div>

                <!-- STEP形式のガイドを復活 -->
                <div class="bg-slate-800 p-4 rounded-xl max-w-md text-[11px] space-y-3 border border-slate-700 shadow-lg">
                    <div class="flex items-start gap-2">
                        <span class="bg-rose-600 px-1.5 py-0.5 rounded text-[9px] font-bold text-white whitespace-nowrap">STEP 1</span>
                        <p class="text-slate-300">上の<strong>2つの赤い点</strong>をじーっと見つめます。</p>
                    </div>
                    <div class="flex items-start gap-2">
                        <span class="bg-emerald-600 px-1.5 py-0.5 rounded text-[9px] font-bold text-white whitespace-nowrap">STEP 2</span>
                        <p class="text-slate-300">視線をわざとずらし、<strong>点が「3つ」に並んで見える</strong>状態を作ります（真ん中に3つ目の点が現れます）。</p>
                    </div>
                    <div class="flex items-start gap-2">
                        <span class="bg-blue-600 px-1.5 py-0.5 rounded text-[9px] font-bold text-white whitespace-nowrap">STEP 3</span>
                        <p class="text-slate-300">そのピントを維持したまま<strong>下の画像へ視線を移す</strong>と、中央に鮮やかな図形が浮き出ます。</p>
                    </div>
                </div>

                <div class="flex gap-4">
                    <button id="next-stereo" class="px-6 py-2 bg-emerald-600 rounded-full hover:bg-emerald-500 transition font-bold shadow-lg text-xs">図形を切り替える</button>
                    <button data-goto="home" class="px-8 py-2 bg-slate-700 rounded-full hover:bg-slate-600 transition font-bold text-xs text-slate-300">戻る</button>
                </div>
            </div>
        `;
    }

    getFocusHTML() {
        return `
            <div class="flex flex-col items-center space-y-4 h-full relative">
                <div class="text-center">
                    <h2 class="text-xl font-bold">遠近・視点移動トレーニング</h2>
                    <p class="text-xs text-emerald-400 font-medium mt-1">円の動きに合わせて、ピントを意識的に合わせましょう</p>
                </div>
                
                <!-- レベル選択 -->
                <div class="flex gap-2 bg-slate-800 p-1 rounded-full border border-slate-700">
                    <button data-level="slow" class="focus-level-btn px-4 py-1 text-[10px] rounded-full transition-all text-slate-400">リラックス</button>
                    <button data-level="normal" class="focus-level-btn px-4 py-1 text-[10px] rounded-full transition-all bg-emerald-600 font-bold text-white">標準</button>
                    <button data-level="active" class="focus-level-btn px-4 py-1 text-[10px] rounded-full transition-all text-slate-400">リフレッシュ</button>
                </div>

                <div id="focus-area" class="w-full flex-grow bg-slate-800/50 rounded-xl border border-slate-700 relative overflow-hidden min-h-[350px]">
                    <div id="focus-dot" class="focus-target"></div>
                </div>

                <div class="bg-slate-800 p-3 rounded-lg w-full max-w-md text-[11px] border border-slate-700">
                    <p class="text-slate-300 text-center">
                        動きが<strong>「ランダム」</strong>になります。予測せず、円をしっかり追いましょう。<br>
                        <span class="text-emerald-400 font-bold">●</span> 大きく見える時は表面、<span class="text-emerald-400 font-bold">●</span> 小さくぼやける時は奥にピントを。
                    </p>
                </div>
                <button data-goto="home" class="px-8 py-2 bg-slate-700 rounded-full hover:bg-slate-600 transition font-bold text-xs">戻る</button>
            </div>
        `;
    }

    getMusicHTML() {
        return `
            <div class="flex flex-col items-center space-y-8 py-10">
                <h2 class="text-xl font-bold">ヒーリングBGM</h2>
                <div class="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center animate-pulse">
                    <span class="text-4xl">🎵</span>
                </div>
                <div class="bg-slate-800 p-8 rounded-3xl w-full max-w-md shadow-2xl border border-slate-700">
                    <p class="text-center mb-6 text-emerald-400 font-bold tracking-widest text-lg">RELAXING FLOW</p>
                    <audio id="main-audio" class="hidden" loop>
                        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg">
                    </audio>
                    <div class="flex justify-center gap-4">
                        <button id="audio-toggle" class="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-500 transition shadow-xl border-4 border-slate-900">
                            <span id="play-icon" class="text-2xl ml-1">▶️</span>
                        </button>
                    </div>
                </div>
                <p class="text-xs text-slate-500">※ボタンを押すと音が流れます。音量にご注意ください。</p>
            </div>
        `;
    }
}

// --- Gabor Patch Module ---
class GaborModule {
    constructor() {
        this.canvas = document.getElementById('gabor-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.patches = [];
        
        this.init();
    }

    init() {
        this.generatePatches();
        this.draw();

        this.canvas.onclick = () => {
            this.generatePatches();
            this.draw();
        };

        const btn = document.getElementById('regen-gabor');
        if (btn) btn.onclick = () => {
            this.generatePatches();
            this.draw();
        };
    }

    generatePatches() {
        this.patches = [];
        for (let i = 0; i < 4; i++) {
            this.patches.push({
                x: Math.random() * (this.canvas.width - 120) + 60,
                y: Math.random() * (this.canvas.height - 120) + 60,
                angle: Math.random() * Math.PI,
                size: 80 + Math.random() * 40
            });
        }
    }

    draw() {
        // Use a neutral gray background
        this.ctx.fillStyle = '#777'; 
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.patches.forEach(p => this.drawGabor(p.x, p.y, p.size, p.angle));
    }

    drawGabor(x, y, size, angle) {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        // Sinusoid grating with high contrast
        const numStripes = 6;
        const stripeWidth = size / (numStripes * 2);

        // Clip to circle
        ctx.beginPath();
        ctx.arc(0, 0, size/2, 0, Math.PI * 2);
        ctx.clip();

        for (let i = -numStripes; i <= numStripes; i++) {
            const posX = i * stripeWidth * 2;
            
            // Gaussian-like falloff for alpha
            const dist = Math.abs(i) / numStripes;
            const alpha = 1 - Math.pow(dist, 2);

            // Draw Dark Stripe
            ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.8})`;
            ctx.fillRect(posX, -size/2, stripeWidth, size);

            // Draw Light Stripe
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
            ctx.fillRect(posX + stripeWidth, -size/2, stripeWidth, size);
        }

        // Apply a soft blur effect by drawing a radial gradient over it
        ctx.globalCompositeOperation = 'destination-in';
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, size/2);
        grad.addColorStop(0.5, 'rgba(0,0,0,1)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(-size/2, -size/2, size, size);

        ctx.restore();
        ctx.globalCompositeOperation = 'source-over';
    }
}

// --- Stereo Module ---
class StereoModule {
    constructor() {
        this.canvas = document.getElementById('stereo-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.patternIndex = 0;
        
        this.init();
    }

    init() {
        this.draw();
        const btn = document.getElementById('next-stereo');
        if (btn) btn.onclick = () => {
            this.patternIndex = (this.patternIndex + 1) % 3;
            this.draw();
        };
    }

    draw() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Background
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, w, h);

        // Pattern logic: Use repetitive textures to help 3D perception
        const colors = ['#10b981', '#3b82f6', '#8b5cf6'];
        const mainColor = colors[this.patternIndex];

        if (this.patternIndex === 0) {
            this.drawComplexGrid(mainColor);
            this.drawDepthShape('circle', mainColor);
        } else if (this.patternIndex === 1) {
            this.drawNoisePattern(mainColor);
            this.drawDepthShape('square', mainColor);
        } else {
            this.drawStarPattern(mainColor);
            this.drawDepthShape('diamond', mainColor);
        }
    }

    drawComplexGrid(color) {
        const ctx = this.ctx;
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.2;
        for (let x = 0; x < this.canvas.width; x += 15) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x + 20, this.canvas.height);
            ctx.stroke();
        }
        ctx.globalAlpha = 1.0;
    }

    drawNoisePattern(color) {
        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = 0.15;
        for (let i = 0; i < 8000; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            this.ctx.fillRect(x, y, 1.5, 1.5);
        }
        this.ctx.globalAlpha = 1.0;
    }

    drawStarPattern(color) {
        const ctx = this.ctx;
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.2;
        for (let i = 0; i < 400; i++) {
            const x = (i * 47) % this.canvas.width;
            const y = (i * 31) % this.canvas.height;
            ctx.beginPath();
            ctx.arc(x, y, 1, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1.0;
    }

    drawDepthShape(type, color) {
        const ctx = this.ctx;
        ctx.save();
        
        // Subtle gradient to blend with repetitive patterns
        const grad = ctx.createLinearGradient(200, 100, 400, 300);
        grad.addColorStop(0, color);
        grad.addColorStop(0.5, 'rgba(255,255,255,0.1)'); 
        grad.addColorStop(1, color);

        ctx.fillStyle = grad;
        ctx.globalAlpha = 0.35; 
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;

        ctx.beginPath();
        if (type === 'circle') {
            ctx.arc(300, 200, 85, 0, Math.PI * 2);
        } else if (type === 'square') {
            ctx.rect(215, 115, 170, 170);
        } else {
            // Diamond
            ctx.moveTo(300, 105);
            ctx.lineTo(440, 200);
            ctx.lineTo(300, 295);
            ctx.lineTo(160, 200);
            ctx.closePath();
        }
        ctx.fill();
        
        // Very subtle inner stroke to help the brain lock the depth
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        ctx.restore();
    }
}

// --- Focus Module ---
class FocusModule {
    constructor() {
        this.dot = document.getElementById('focus-dot');
        this.area = document.getElementById('focus-area');
        this.levelButtons = document.querySelectorAll('.focus-level-btn');
        
        // Configuration for different levels
        this.levels = {
            slow: { interval: 4000, transition: '3.5s' },
            normal: { interval: 3000, transition: '2.5s' },
            active: { interval: 2000, transition: '1.5s' }
        };
        this.currentLevel = 'normal';
        this.lastIndex = -1;
        
        // Possible states for random selection
        this.states = [
            { top: '50%', left: '50%', scale: 2.5, blur: '0px', opacity: 1 },    // Near Center
            { top: '50%', left: '50%', scale: 0.4, blur: '2px', opacity: 0.6 },  // Far Center
            { top: '15%', left: '15%', scale: 2.0, blur: '0px', opacity: 1 },    // Near Top Left
            { top: '15%', left: '85%', scale: 0.5, blur: '2px', opacity: 0.6 },  // Far Top Right
            { top: '85%', left: '85%', scale: 2.0, blur: '0px', opacity: 1 },    // Near Bottom Right
            { top: '85%', left: '15%', scale: 0.5, blur: '2px', opacity: 0.6 },  // Far Bottom Left
            { top: '15%', left: '50%', scale: 1.2, blur: '0px', opacity: 0.9 },  // Mid Top
            { top: '85%', left: '50%', scale: 1.2, blur: '0px', opacity: 0.9 },  // Mid Bottom
            { top: '50%', left: '15%', scale: 1.2, blur: '0px', opacity: 0.9 },  // Mid Left
            { top: '50%', left: '85%', scale: 1.2, blur: '0px', opacity: 0.9 },  // Mid Right
        ];
        
        this.timer = null;
        this.init();
    }

    init() {
        // Event listeners for level selection
        this.levelButtons.forEach(btn => {
            btn.onclick = (e) => {
                this.setLevel(e.target.getAttribute('data-level'));
            };
        });

        this.updateAnimation();
        this.startTimer();
    }

    setLevel(level) {
        this.currentLevel = level;
        
        // Update UI
        this.levelButtons.forEach(btn => {
            if (btn.getAttribute('data-level') === level) {
                btn.classList.add('bg-emerald-600', 'font-bold', 'text-white');
                btn.classList.remove('text-slate-400');
            } else {
                btn.classList.remove('bg-emerald-600', 'font-bold', 'text-white');
                btn.classList.add('text-slate-400');
            }
        });

        this.updateAnimation();
        this.startTimer(); // Restart with new interval
    }

    updateAnimation() {
        if (this.dot) {
            this.dot.style.transition = `all ${this.levels[this.currentLevel].transition} ease-in-out`;
        }
    }

    startTimer() {
        if (this.timer) clearInterval(this.timer);
        this.move();
        this.timer = setInterval(() => this.move(), this.levels[this.currentLevel].interval);
    }

    move() {
        if (!this.dot) return;
        
        // Pick a random state different from current
        let nextIndex;
        do {
            nextIndex = Math.floor(Math.random() * this.states.length);
        } while (nextIndex === this.lastIndex);
        
        this.lastIndex = nextIndex;
        const state = this.states[nextIndex];
        
        this.dot.style.top = state.top;
        this.dot.style.left = state.left;
        this.dot.style.transform = `translate(-50%, -50%) scale(${state.scale})`;
        this.dot.style.filter = `blur(${state.blur})`;
        this.dot.style.opacity = state.opacity;
    }

    destroy() {
        if (this.timer) clearInterval(this.timer);
    }
}

// --- Audio Initialization ---
document.addEventListener('click', (e) => {
    if (e.target.closest('#audio-toggle')) {
        const audio = document.getElementById('main-audio');
        const icon = document.getElementById('play-icon');
        if (!audio) return;
        if (audio.paused) {
            audio.play().catch(err => console.log("Play failed", err));
            icon.textContent = '⏸️';
        } else {
            audio.pause();
            icon.textContent = '▶️';
        }
    }
});

// Bootstrap
window.addEventListener('DOMContentLoaded', () => {
    new ContentSwitcher();
});
