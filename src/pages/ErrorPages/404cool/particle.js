/**
 * Modified version of Ottis' Canvas Particles demo
 * via https://github.com/ottis/canvas-particles
 */

/* 
    2个地方修改
    1. 75、76行，修改分辨率
    2. 82行，修改字体大小
*/

// particle.js
export class particle {
    constructor(cfg, ctx) {
        this.ctx = ctx;

        this.x = cfg.x || 0;
        this.y = cfg.y || 0;

        this.vx = cfg.vx || 1;
        this.vy = cfg.vy || 1;

        this.radius = cfg.radius || 1;
        this.color = cfg.color || '#1d1d1d';
    }
    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        this.ctx.fill();
    }
}
  
  // particle-system.js
export class particleSystem {
    constructor(cfg) {
        this.initCFG(cfg);

        this.canvas = document.getElementById(this.canvas_id);
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.initMessage();

        // create the particles, add base 2 number, higher = less particles
        for (var i = 0; i < this.area.length; i += 256) {
            this.particles.push(
                new particle(
                    {
                        x: this.area[i][0],
                        y: this.area[i][1],
                        vx: Math.floor(Math.random() * 2 - 1),
                        vy: Math.floor(Math.random() * 2 - 1),
                    },
                    this.ctx
                )
            );
        }
    }
    initCFG(cfg) {
        cfg = cfg || {};

        this.fps = cfg.fps || 24;
        this.now;
        this.dist;
        this.then = Date.now();
        this.interval = 1000 / this.fps;
        this.delta;
        this.canvas_id = cfg.canvas_id || 'canvas';
        this.min_dist = cfg.min_dist || 20;
        this.particles = [];
        // this.width = cfg.width || window.innerWidth;
        // this.height = cfg.height || window.innerHeight;
        this.width = 2160/2
        this.height = 420
    }
    initMessage() {
        // this is the unicode hex of a heart
        this.str = '404';
        this.fontStr = '420px Arial Black, sans-serif';

        this.ctx.beginPath();
        this.ctx.font = this.fontStr;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText(this.str, this.width / 2, this.height / 2);
        this.ctx.closePath();

        this.mask = this.ctx.getImageData(0, 0, this.width, this.height);
        this.area = [];

        // save all white pixels, these will be used as the bounds for the particles
        for (var i = 0; i < this.mask.data.length; i += 4) {
            if (this.mask.data[i] == 255 &&
                this.mask.data[i + 1] == 255 &&
                this.mask.data[i + 2] == 255 &&
                this.mask.data[i + 3] == 255) {
                this.area.push([
                    this.toPosX(i, this.mask.width),
                    this.toPosY(i, this.mask.width),
                ]);
            }
        }

        this.repaint();
    }
    update() {
        for (var i = 0; i < this.particles.length; i++) {
            // reverse direction if moving onto a black pixel
            if (this.isBlackPixelX(this.particles[i])) {
                this.particles[i].vx *= -1;
            }

            if (this.isBlackPixelY(this.particles[i])) {
                this.particles[i].vy *= -1;
            }

            this.particles[i].x += this.particles[i].vx;
            this.particles[i].y += this.particles[i].vy;

            for (var j = 0; j < this.particles.length; j++) {
                if (this.areClose(this.particles[i], this.particles[j])) {
                    this.drawConnectionLine(this.particles[i], this.particles[j]);
                }
            }
        }
    }
    drawConnectionLine(p1, p2) {
        // Draw the line between particles, opacity based on distance
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'rgba(22,119,255,' +
            (1 -
                Math.sqrt(this.getDistX(p1, p2) + this.getDistY(p1, p2)) /
                this.min_dist) +
            ')';
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();
        this.ctx.closePath();
    }
    start(e) {
        cancelAnimationFrame(window.particleAnimation);
        window.particleAnimation = requestAnimFrame(delegate(this, this.start));

        this.now = Date.now();
        this.delta = this.now - this.then;

        // control the fps
        if (this.delta > this.interval) {
            this.then = this.now - (this.delta % this.interval);
            this.draw();
        }
    }
    draw() {
        // clear screen, remove for cool effect ;)
        this.repaint();

        for (var k = 0, m = this.particles.length; k < m; k++) {
            this.particles[k].draw();
        }

        this.update();
    }
    //
    // Helper Methods
    //
    isBlackPixelY(p) {
        return (
            this.mask.data[this.posToArea(p.x, p.y + p.vy, this.mask.width)] != 255
        );
    }
    isBlackPixelX(p) {
        return (
            this.mask.data[this.posToArea(p.x + p.vx, p.y, this.mask.width)] != 255
        );
    }
    areClose(p1, p2) {
        return (
            Math.sqrt(this.getDistX(p1, p2) + this.getDistY(p1, p2)) < this.min_dist
        );
    }
    getDistX(p1, p2) {
        return Math.pow(p1.x - p2.x, 2);
    }
    getDistY(p1, p2) {
        return Math.pow(p1.y - p2.y, 2);
    }
    posToArea(x, y, w) {
        return (this.mask.width * y + x) * 4;
    }
    toPosX(i, w) {
        return (i % (4 * w)) / 4;
    }
    toPosY(i, w) {
        return Math.floor(i / (4 * w));
    }
    repaint() {
        // clear the screen
        this.ctx.fillStyle = '#F5F5F5';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
}
  
window.delegate = function(ctx, func) {
    return function() {
        return func.apply(ctx, arguments);
    };
};

window.requestAnimFrame = (function() {
    return (
        window.requestAnimationFrame
    );
})();