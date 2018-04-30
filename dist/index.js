"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define("main/chapter-list", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.chapterList = [
        {
            title: 'UABRO - age of consciousness',
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
});
define("main/book", ["require", "exports", "main/chapter-list"], function (require, exports, chapter_list_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Book {
        constructor() {
            this.chaptersList = chapter_list_1.chapterList;
            console.log(this, 'created');
        }
        loadChapter(name) {
            return __awaiter(this, void 0, void 0, function* () {
                const xhr = new XMLHttpRequest();
                const q = new Promise();
                xhr.open('GET', '/chapters/' + name + '.html');
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            gmtr.emit('loaded', { name: name, loaded: 1, total: 1 });
                            q.resolve(xhr.responseText);
                        }
                        else {
                            q.reject('Could not load data.');
                        }
                    }
                };
                xhr.onprogress = e => {
                    gmtr.emit('loaded', { name: name, loaded: e.loaded, total: e.total });
                };
                xhr.send();
                return q;
            });
        }
    }
    exports.Book = Book;
});
define("index", ["require", "exports", "main/book"], function (require, exports, book_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    new book_1.Book();
});
var Helper;
(function (Helper) {
    Helper.fitCanvasResolution = (canvas, ctx, width, height) => {
        const devicePixelRatio = window.devicePixelRatio || 1, backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio || 1, ratio = devicePixelRatio / backingStoreRatio;
        if (devicePixelRatio !== backingStoreRatio) {
            const oldWidth = width;
            const oldHeight = height;
            canvas.width = oldWidth * ratio;
            canvas.height = oldHeight * ratio;
            canvas.style.width = oldWidth + 'px';
            canvas.style.height = oldHeight + 'px';
            ctx.scale(ratio, ratio);
        }
        else {
            canvas.width = width;
            canvas.height = height;
        }
    };
})(Helper || (Helper = {}));
