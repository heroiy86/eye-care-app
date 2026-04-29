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
        // Event listeners for navigation
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const view = e.currentTarget.getAttribute('data-nav');
                this.switchView(view);
            });
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
        let html = '';
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
                    ガポールパッチでの脳トレ、遠近トレーニング、ステレオグラムで
                    現代人の酷使された目をケアしましょう。
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    <div class="p-4 bg-slate-800 rounded-lg border border-slate-700">
                        <h3 class="font-bold text-emerald-300 mb-2">ガポールパッチ</h3>
                        <p class="text-xs text-slate-400">ボケた縞模様を探すことで、脳の視覚処理能力を鍛えます。</p>
                    </div>
                    <div class="p-4 bg-slate-800 rounded-lg border border-slate-700">
                        <h3 class="font-bold text-emerald-300 mb-2">遠近トレーニング</h3>
                        <p class="text-xs text-slate-400">緑の円を目で追うことで、ピント調節を行う毛様体筋をほぐします。</p>
                    </div>
                </div>
            </div>
        `;
    }

    getGaborHTML() {
        return `
            <div class="flex flex-col items-center space-y-4">
                <h2 class="text-xl font-bold">ガポール・パッチ・トレーニング</h2>
                <p class="text-sm text-slate-400">パッチをクリックすると位置が変わります。ぼーっと眺めてください。</p>
                <canvas id="gabor-canvas" width="600" height="400" class="w-full max-w-2xl aspect-video"></canvas>
                <button id="regen-gabor" class="px-6 py-2 bg-emerald-600 rounded-full hover:bg-emerald-500 transition">再配置</button>
            </div>
        `;
    }

    getStereoHTML() {
        return `
            <div class="flex flex-col items-center space-y-4">
                <h2 class="text-xl font-bold">3Dステレオグラム</h2>
                <div class="flex items-center gap-2 text-xs text-slate-400">
                    <span>平行法・交差法のガイド:</span>
                    <div class="stereo-guide"></div>
                    <div class="stereo-guide"></div>
                </div>
                <div id="stereo-container" class="w-full max-w-2xl aspect-video bg-slate-800 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <canvas id="stereo-canvas" width="600" height="400" class="w-full h-full"></canvas>
                    <div class="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                        <p class="text-sm font-bold opacity-50">幾何学模様トレーニング</p>
                    </div>
                </div>
                <p class="text-xs text-slate-500 text-center">
                    遠くを見るように（平行法）、あるいは寄り目にするように（交差法）して、<br>
                    中央に立体的な図形が浮かび上がるのを感じてください。
                </p>
            </div>
        `;
    }

    getFocusHTML() {
        return `
            <div class="flex flex-col items-center space-y-4 h-full relative">
                <h2 class="text-xl font-bold">遠近・視点移動トレーニング</h2>
                <p class="text-sm text-slate-400">動く緑の円を、頭を動かさずに目で追ってください。</p>
                <div id="focus-area" class="w-full flex-grow bg-slate-800/50 rounded-xl border border-slate-700 relative overflow-hidden min-h-[300px]">
                    <div id="focus-dot" class="focus-target"></div>
                </div>
            </div>
        `;
    }

    getMusicHTML() {
        return `
            <div class="flex flex-col items-center space-y-8 py-10">
                <h2 class="text-xl font-bold">リラックス・オーディオ</h2>
                <div class="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center animate-pulse">
                    <span class="text-4xl">🎵</span>
                </div>
                <div class="bg-slate-800 p-6 rounded-2xl w-full max-w-md shadow-xl border border-slate-700">
                    <p class="text-center mb-4 text-emerald-400 font-medium">ヒーリング・アンビエント</p>
                    <audio id="main-audio" class="hidden" loop>
                        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg">
                    </audio>
                    <div class="flex justify-center gap-4">
                        <button id="audio-toggle" class="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-500 transition shadow-lg">
                            <span id="play-icon">▶️</span>
                        </button>
                    </div>
                    <div class="mt-6 flex flex-col gap-2">
                         <div class="h-1 bg-slate-700 rounded-full overflow-hidden">
                            <div class="h-full bg-emerald-500 w-1/3"></div>
                         </div>
                         <div class="flex justify-between text-[10px] text-slate-500">
                            <span>0:00</span>
                            <span>3:45</span>
                         </div>
                    </div>
                </div>
                <p class="text-xs text-slate-500">※URLを差し替えることでお好みの音楽を再生可能です。</p>
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
        for (let i = 0; i < 3; i++) {
            this.patches.push({
                x: Math.random() * (this.canvas.width - 100) + 50,
                y: Math.random() * (this.canvas.height - 100) + 50,
                angle: Math.random() * Math.PI,
                size: 60 + Math.random() * 40
            });
        }
    }

    draw() {
        this.ctx.fillStyle = '#888';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.patches.forEach(p => this.drawGabor(p.x, p.y, p.size, p.angle));
    }

    drawGabor(x, y, size, angle) {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size/2);
        gradient.addColorStop(0, 'rgba(0,0,0,0.5)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');

        // Simple sinusoid stripes with gaussian-like falloff
        for (let i = -size/2; i < size/2; i += 4) {
            const alpha = Math.exp(-(i*i) / (2 * (size/4)*(size/4)));
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
            ctx.fillRect(i, -size/2, 2, size);
        }

        // Apply circular mask for gaussian look
        ctx.globalCompositeOperation = 'destination-in';
        ctx.beginPath();
        ctx.arc(0, 0, size/2, 0, Math.PI * 2);
        ctx.fill();

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
        this.draw();
    }

    draw() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, w, h);

        // Draw abstract pattern (Placeholder for Stereogram)
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;

        for (let i = 0; i < w; i += 20) {
            for (let j = 0; j < h; j += 20) {
                const shift = Math.sin(i * 0.05) * 5;
                ctx.beginPath();
                ctx.arc(i + shift, j, 2, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
    }
}

// --- Focus Module ---
class FocusModule {
    constructor() {
        this.dot = document.getElementById('focus-dot');
        this.area = document.getElementById('focus-area');
        this.positions = [
            { top: '50%', left: '50%' }, // Center
            { top: '10%', left: '10%' }, // Top Left
            { top: '10%', left: '90%' }, // Top Right
            { top: '90%', left: '90%' }, // Bottom Right
            { top: '90%', left: '10%' }, // Bottom Left
        ];
        this.currentIndex = 0;
        this.timer = null;

        this.init();
    }

    init() {
        this.move();
        this.timer = setInterval(() => this.move(), 3000);
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
// Simple global handler for music page logic (since it's small)
document.addEventListener('click', (e) => {
    if (e.target.closest('#audio-toggle')) {
        const audio = document.getElementById('main-audio');
        const icon = document.getElementById('play-icon');
        if (audio.paused) {
            audio.play();
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
