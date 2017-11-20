'use strict';

class Q {
    then(cb) {
        if (this.data) {
            cb(data)
        } else {
            this.cb = cb;
        }
    }

    resolve(data) {
        if (this.cb) {
            this.cb(data);
        } else {
            this.data = data;
        }
    }

    reject(err) {
        this.err && this.err(err);
    }

    static all(arr) {
        const len = arr.length;
        let ready = 0;
        const _q = new Q;
        arr.forEach(q => {
            q.then(() => {
                ready += 1;
                if (ready === len) {
                    _q.resolve();
                }
            });
        });
        return _q;
    }
}

const load = name => {
    const xhr = new XMLHttpRequest();
    const q = new Q;
    xhr.open('GET', '/chapters/' + name + '.html');
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                gmtr.emit('loaded', {name: name, loaded: 1, total: 1});
                q.resolve(xhr.responseText);
            }
            else {
                q.reject('Could not load data.');
            }
        }
    };
    xhr.onprogress = e => {
        gmtr.emit('loaded', {name: name, loaded: e.loaded, total: e.total});
    };
    xhr.send();
    return q;
};

DC.ready(() => {
    const app = DC({c: 'body'}).into(document.body);
    const view = DC({
        c: 'view'
    }).into(app);

    const shared = {};
    const controls = DC({c: 'controls center'}).into(app);

    const chapterList = [
        {
            title: 'UABRO - age of intelligent freedom',
            page: 'cover-page'
        },
        {
            title: 'Introduction',
            page: 'introduction'
        },
        {
            title: 'Intelligent freedom',
            page: 'intelligent-freedom'
        },
        {
            title: 'Finale of development',
            page: 'finale-of-development'
        },
        {
            title: 'Chaos and order',
            page: 'chaos-and-order'
        },
        {
            title: 'Four ways of behavior',
            page: 'four-ways-of-behavior'
        },
        {
            title: 'Priority project',
            page: 'priority-project'
        },
        {
            title: 'True, false and simulation',
            page: 'true-or-simulation'
        },
        {
            title: 'Ecosystem',
            page: 'ecosystem'
        },
        {
            title: 'Focus on',
            page: 'focus-on'
        },
        {
            title: 'Infinite beauty of consciousness',
            page: 'infinite-beauty-of-consciousness'
        },
        {
            title: 'Not conclusion',
            page: 'not-conclusion'
        },
        {
            title: 'Vocabulary',
            page: 'vocabulary'
        },
    ];

    chapterList.getIndex = page => {
        const len = chapterList.length;
        for (let i = 0; i < len; i += 1) {
            if (chapterList[i].page === page) return i;
        }
    };

    chapterList.getNext = page => {
        const index = chapterList.getIndex(page);
        if (index === false || index === chapterList.length - 1) return;
        return chapterList[index + 1];
    };

    chapterList.getPrev = page => {
        const index = chapterList.getIndex(page);
        if (index === false || index === 0) return;
        return chapterList[index - 1];
    };

    chapterList.getPage = page => {
        if (!page) return;
        if (typeof page === 'object') page = page.page;
        return chapterList.find(p => p.page === page);
    };

    const ram = {};

    let curChapter;
    let prevTop = false;

    const content = DC({
        c: 'content'
    });

    content.render = () => {
        if (!content.classList.contains('visible-x')) {
            content.addClass('visible-x');
            document.body.addClass('no-scroll');
            content.scrollTo(0, 0);
        } else {
            content._hide();
        }
    };

    content._hide = () => {
        content.removeClass('visible-x');
        document.body.removeClass('no-scroll');
    };

    content.chapters = [];

    {
        const wrap = DC({
            c: 'content-close-wrap'
        }).into(content);

        DC({
            c: 'content-close',
            t: 'hide',
            events: {
                click() {
                    content._hide();
                }
            }
        }).into(wrap);
    }

    chapterList.forEach(c => {
        content.chapters[c.page] = DC('button', {
            t: c.title,
            events: {
                click() {
                    go(c.page);
                    prevTop = window.pageYOffset;
                }
            }
        }).into(content);
    });

    {
        DC({
            c: 'right',
            h: '<i>by Oleksii Shnyra</i>',
        }).into(content);
    }

    content.activate = function (page) {
        if (!content.chapters[page]) return;
        if (content.curChapter) content.curChapter.removeClass('active');
        content.curChapter = content.chapters[page];
        content.curChapter.addClass('active');
        title.t = content.curChapter.t;
        content._hide();
    };

    const title = DC('button', {
        t: 'content',
        c: 'title',
        events: {
            click() {
                content.render();
            }
        },
        prevented: ['click']
    });

    controls.list([
        title,
        content
    ]);

    {
        const canvas = DC('canvas', {
            c: 'first-canvas'
        }).into(document.body);
        const ctx = canvas.getContext('2d');
        let running = false;

        const fitResolution = (canvas, ctx, width, height) => {
            const devicePixelRatio = window.devicePixelRatio || 1,
                backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
                    ctx.mozBackingStorePixelRatio ||
                    ctx.msBackingStorePixelRatio ||
                    ctx.oBackingStorePixelRatio ||
                    ctx.backingStorePixelRatio || 1,
                ratio = devicePixelRatio / backingStoreRatio;
            if (devicePixelRatio !== backingStoreRatio) {

                const oldWidth = width;
                const oldHeight = height;

                canvas.width = oldWidth * ratio;
                canvas.height = oldHeight * ratio;

                canvas.style.width = oldWidth + 'px';
                canvas.style.height = oldHeight + 'px';

                ctx.scale(ratio, ratio);

            } else {
                canvas.width = width;
                canvas.height = height;
            }
        };

        const dots = [];
        {
            const colors = [
                '#1a1a1a',
                '#c44126',
                '#cd7c00',
                '#238dcd',
                '#e4e000',
                '#e48900',
                '#e43b17',
                '#31cd19',
                '#cd3fc4',
                '#562730',
            ];
            const maxColors = colors.length - 1;

            for (let i = 0; i < 120; i += 1) {
                dots.push({
                    s: randi(10, 45) / 10,
                    x: randi(0, 100) / 100,
                    y: randi(0, 100) / 100,
                    ax: randix(-20, 20) / 21000,
                    ay: randix(-20, 20) / 21000,
                    c: colors[randi(0, maxColors)]
                });
            }
        }

        const distance = .05;

        const calcLen = (x, y, x2, y2) => Math.sqrt((x2 - x) ** 2 + (y2 - y) ** 2);
        const getAngle = (x, y, x2, y2) => Math.atan2(y2 - y, x2 - x);

        const halfPI = Math.PI / 2;

        const render = () => {
            if (!running) return;
            const ww = window.innerWidth;
            const wh = window.innerHeight;
            const _distance = distance * (ww + wh);
            const visHeight = window.innerHeight / 2;
            let py = window.pageYOffset;
            if (py <= visHeight) {
                requestAnimationFrame(render);
            } else {
                running = false;
                py = visHeight;
            }
            fitResolution(canvas, ctx, ww, wh);

            const len = dots.length - 1;
            for (let i = 0; i <= len; i += 1) {
                const d = dots[i];
                const x = d.x += d.ax;
                const y = d.y += d.ay;
                if (x > 1 || x < 0) {
                    d.ax = -d.ax;
                    d.x = x > 1 ? 1 : 0;
                }
                if (y > 1 || y < 0) {
                    d.ay = -d.ay;
                    d.y = y > 1 ? 1 : 0;
                }

                for (let j = i + 1; j <= len; j += 1) {
                    const _d = dots[j];
                    const {x, y} = d;
                    const {x: x2, y: y2} = _d;
                    const [a, b, a2, b2] = [x * ww, y * wh, x2 * ww, y2 * wh];
                    const l = calcLen(a, b, a2, b2);
                    if (l < _distance) {
                        ctx.beginPath();
                        const grd = ctx.createLinearGradient(a, b, a2, b2);
                        grd.addColorStop(0, d.c);
                        grd.addColorStop(.5, '#46171f');
                        grd.addColorStop(1, _d.c);
                        ctx.fillStyle = grd;
                        ctx.globalAlpha = (1 - l / _distance) * .85 * (1 - py / visHeight);
                        const p = getAngle(a, b, a2, b2);
                        ctx.arc(a, b, d.s, p + halfPI, p - halfPI, true);
                        ctx.arc(a2, b2, _d.s, p + halfPI, p - halfPI);
                        ctx.fill();
                    }
                }
            }
        };

        const scroll = shared.firstCanvas = () => {
            const visHeight = window.innerHeight / 2;
            const y = window.pageYOffset;
            if (y < visHeight && !running) {
                running = true;
                requestAnimationFrame(render);
            }
        };

        DC.onwindow('resize', () => fitResolution(canvas, ctx, window.innerWidth, window.innerHeight));
        DC.onwindow('scroll', scroll);
    }

    {
        let allChaptersLoaded = false;

        const bounds = [];

        const calcBounds = () => {
            bounds.length = 0;
            DC.iterObj(ram, (page, element) => {
                bounds.push({top: element.offsetTop, page: page});
            });
            bounds.sortBy('top');
            const top = window.pageYOffset;
            const len = bounds.length;
            let cur, found;
            for (let i = len - 1; i; i -= 1) {
                let p = bounds[i];
                if (p.top < top + 100) {
                    cur = p;
                    found = true;
                    break;
                }
            }
            if (!found) cur = bounds[0];
            if (!cur) return;
            if (curChapter !== cur.page) {
                saveChapter(cur.page);
            }
        };

        {
            controls.hide();
            const anim = DC({c: 'load-animation'}).into(view);
            anim.css({width: 0});
            {
                const info = {};
                const len = chapterList.length;
                gmtr.on('loaded', o => {
                    if (!info[o.name]) info[o.name] = {};
                    const i = info[o.name];
                    i.loaded = o.loaded;
                    i.total = o.total;
                    let res = 0;
                    DC.iterObj(info, (k, v) => {
                        res += v.loaded / v.total;
                    });
                    res *= 100 / len;
                    anim.css({width: res + '%'});
                });
            }

            const started = Date.now();

            Q.all(chapterList.map(c => go(c.page, true, true))).then(() => {
                allChaptersLoaded = true;
                let delay = Date.now() - started;
                delay = delay < 1256 ? 1256 - delay : 0;

                setTimeout(() => {
                    view.clear();
                    chapterList.forEach(c => {
                        const page = ram[c.page];
                        if (location.hostname === 'localhost') {
                            // page.attr({contenteditable: true});
                        }
                        page.into(view);
                    });
                    controls.show();
                    const top = localStorage.getItem('top');
                    go(localStorage.getItem('chapter') || chapterList[0]);
                    if (typeof top === 'string') window.scrollTo(0, top);
                    const h = controls.offsetHeight;
                    prevTop = top - h;
                    controls.css({top: prevTop});
                    shared.firstCanvas && shared.firstCanvas();

                    calcBounds();
                }, delay);
            });
        }

        DC.onwindow('scroll', () => {
            const top = window.pageYOffset;
            if (allChaptersLoaded) {
                localStorage.setItem('top', top);
                setTimeout(calcBounds);
            }
            if (prevTop === false) {
                prevTop = top;
            } else {
                const h = controls.offsetHeight;
                let nt = prevTop - top;
                if (top > prevTop) {
                    if (nt < -h) {
                        nt = -h;
                        prevTop = top - h;
                    }
                    controls.css({top: (nt / 3) + '%'});
                } else {
                    if (nt) {
                        prevTop = top;
                        controls.css({top: 0});
                    }
                }
            }
        });
    }

    function go(page, noscroll, noinsert) {
        if (!page) return;
        let _page;
        if (typeof page === 'object') {
            _page = page;
            page = page.page;
        } else {
            _page = chapterList.getPage(page);
        }
        const c = ram[page] || DC({c: 'chapter'});
        const q = new Q;
        if (ram[page]) {
            curChapter = page;
            if (!noinsert) insert(ram[page], page, noscroll);
            q.resolve();
        } else {
            load(page).then(d => {
                curChapter = page;
                c.h = d || '<div class="chapter-title">' + _page.title + '</div>';
                if (noinsert) {
                    ram[page] = c;
                } else {
                    insert(c, page, noscroll);
                }
                q.resolve();
            });
        }
        content.activate(curChapter);
        return q;
    }

    function insert(c, page, ignore) {
        ram[page] = c;
        let target = chapterList.getPage(chapterList.getPrev(page));
        if (target) target = ram[target.page];
        if (target) {
            c.after(target);
        } else {
            target = chapterList.getPage(chapterList.getNext(page));
            if (target) target = ram[target.page];
            if (target) {
                c.before(target);
            } else {
                c.into(view);
            }
        }
        if (!ignore) {
            saveChapter();
            window.scrollTo(0, c.offsetTop - 80);
        }
    }

    function saveChapter(chapter) {
        if (chapter && curChapter !== chapter) {
            curChapter = chapter;
            content.activate(curChapter);
        }
        localStorage.setItem('chapter', curChapter);
    }

    function randi(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function randix(min, max) {
        const n = randi(min, max);
        if (min !== max && n === 0) {
            return randix(min, max);
        }
        return n;
    }
});