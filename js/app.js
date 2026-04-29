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
                <h2 class="text-3xl font-bold text-emerald-400">目に休息を、脳に刺激を。</h2>
                <p class="text-slate-400 max-w-md mx-auto">
                    デスクワークで疲れた目をリフレッシュしましょう。<br>
                    以下のメニューからトレーニングを選択してください。
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    <button data-goto="gabor" class="p-6 bg-slate-800 rounded-xl border border-slate-700 hover:border-emerald-500 hover:bg-slate-700 transition-all text-left group">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="font-bold text-emerald-300 text-lg">🌀 ガポールパッチ</h3>
                            <span class="group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                        <p class="text-xs text-slate-400">ボケた縞模様を探すことで、脳の視覚処理能力を鍛えます。近視や老眼のケアに。</p>
                    </button>
                    <button data-goto="focus" class="p-6 bg-slate-800 rounded-xl border border-slate-700 hover:border-emerald-500 hover:bg-slate-700 transition-all text-left group">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="font-bold text-emerald-300 text-lg">🟢 遠近トレーニング</h3>
                            <span class="group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                        <p class="text-xs text-slate-400">動く円を目で追うことで、ピント調節を行う毛様体筋をほぐします。</p>
                    </button>
                    <button data-goto="stereo" class="p-6 bg-slate-800 rounded-xl border border-slate-700 hover:border-emerald-500 hover:bg-slate-700 transition-all text-left group">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="font-bold text-emerald-300 text-lg">🕶️ 3Dステレオグラム</h3>
                            <span class="group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                        <p class="text-xs text-slate-400">立体視を利用して目の筋肉をストレッチします。リラックス効果も。</p>
                    </button>
                    <button data-goto="music" class="p-6 bg-slate-800 rounded-xl border border-slate-700 hover:border-emerald-500 hover:bg-slate-700 transition-all text-left group">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="font-bold text-emerald-300 text-lg">🎵 癒やしのBGM</h3>
                            <span class="group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                        <p class="text-xs text-slate-400">トレーニング中や休憩中に最適なヒーリングミュージックを再生します。</p>
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
                    <p class="text-xs text-slate-400 mt-1">縞模様をじっと見つめてください。クリックで模様が変わります。</p>
                </div>
                <div class="relative w-full max-w-2xl">
                    <canvas id="gabor-canvas" width="600" height="400" class="w-full aspect-video border-4 border-slate-700"></canvas>
                    <div class="absolute bottom-2 right-2 px-2 py-1 bg-black/50 text-[10px] rounded pointer-events-none">Canvas Area</div>
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
                    <h2 class="text-xl font-bold">3Dステレオグラム</h2>
                    <p class="text-xs text-emerald-400 font-medium mt-1">図形が浮かび上がって見えたら成功です！</p>
                </div>
                
                <div class="flex items-center gap-4 text-[10px] bg-slate-800 px-4 py-2 rounded-full border border-slate-700">
                    <span class="text-slate-400 italic">見方のガイド:</span>
                    <div class="flex items-center gap-1"><div class="stereo-guide"></div><span class="text-slate-300">平行法（遠くを見る）</span></div>
                    <div class="flex items-center gap-1"><div class="stereo-guide" style="background-color:#3b82f6"></div><span class="text-slate-300">交差法（寄り目にする）</span></div>
                </div>

                <div id="stereo-container" class="w-full max-w-2xl aspect-video bg-slate-900 rounded-lg flex items-center justify-center relative border-2 border-slate-800">
                    <canvas id="stereo-canvas" width="600" height="400" class="w-full h-full opacity-80"></canvas>
                </div>

                <div class="bg-slate-800 p-4 rounded-lg max-w-md text-[11px] space-y-2 border border-slate-700">
                    <p><strong>平行法:</strong> 画面の奥をぼーっと見るようにすると、2つの点が3つに見えてきます。真ん中の点が重なった時、図形が浮き出ます。</p>
                    <p><strong>交差法:</strong> 寄り目にして画面の手前に焦点を合わせます。同様に3つに見えるように調節してください。</p>
                </div>

                <div class="flex gap-4">
                    <button id="next-stereo" class="px-6 py-2 bg-emerald-600 rounded-full hover:bg-emerald-500 transition font-bold shadow-md">別の図形に変える</button>
                </div>
            </div>
        `;
    }

    getFocusHTML() {
        return `
            <div class="flex flex-col items-center space-y-4 h-full relative">
                <h2 class="text-xl font-bold">遠近・視点移動</h2>
                <p class="text-sm text-slate-400">頭を動かさず、緑の円だけを視線で追ってください。</p>
                <div id="focus-area" class="w-full flex-grow bg-slate-800/50 rounded-xl border border-slate-700 relative overflow-hidden min-h-[300px]">
                    <div id="focus-dot" class="focus-target"></div>
                </div>
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

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, w, h);

        // Generate dynamic patterns
        if (this.patternIndex === 0) {
            this.drawNoisePattern('#334155');
            this.drawDepthShape('circle');
        } else if (this.patternIndex === 1) {
            this.drawGridPattern('#1e293b');
            this.drawDepthShape('square');
        } else {
            this.drawAbstractPattern();
        }
    }

    drawNoisePattern(color) {
        this.ctx.fillStyle = color;
        for (let i = 0; i < 5000; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            this.ctx.fillRect(x, y, 1, 1);
        }
    }

    drawGridPattern(color) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 0.5;
        for (let x = 0; x < this.canvas.width; x += 10) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
    }

    drawAbstractPattern() {
        this.ctx.strokeStyle = '#2d3748';
        for (let i = 0; i < 100; i++) {
            this.ctx.beginPath();
            this.ctx.arc(Math.random() * 600, Math.random() * 400, Math.random() * 20, 0, Math.PI * 2);
            this.ctx.stroke();
        }
    }

    drawDepthShape(type) {
        // Visual indicator that something is there
        this.ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
        this.ctx.beginPath();
        if (type === 'circle') {
            this.ctx.arc(300, 200, 80, 0, Math.PI * 2);
        } else {
            this.ctx.rect(220, 120, 160, 160);
        }
        this.ctx.fill();
        
        this.ctx.fillStyle = 'rgba(255,255,255,0.1)';
        this.ctx.font = '12px sans-serif';
        this.ctx.fillText('Depth Layer Active', 250, 320);
    }
}

// --- Focus Module ---
class FocusModule {
    constructor() {
        this.dot = document.getElementById('focus-dot');
        this.area = document.getElementById('focus-area');
        this.positions = [
            { top: '50%', left: '50%' },
            { top: '15%', left: '15%' },
            { top: '15%', left: '85%' },
            { top: '85%', left: '85%' },
            { top: '85%', left: '15%' },
            { top: '50%', left: '50%' },
        ];
        this.currentIndex = 0;
        this.timer = null;

        this.init();
    }

    init() {
        this.move();
        this.timer = setInterval(() => this.move(), 2500);
    }

    move() {
        if (!this.dot) return;
        const pos = this.positions[this.currentIndex];
        this.dot.style.top = pos.top;
        this.dot.style.left = pos.left;
        this.dot.style.transform = 'translate(-50%, -50%)';

        this.currentIndex = (this.currentIndex + 1) % this.positions.length;
    }

    destroy() {
        clearInterval(this.timer);
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
