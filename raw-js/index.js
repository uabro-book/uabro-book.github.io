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
      title: 'True or simulation',
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
    let allChaptersLoaded = false;

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
          chapterList.forEach(c => ram[c.page].into(view));
          controls.show();
          const top = localStorage.getItem('top');
          go(localStorage.getItem('chapter') || chapterList[0]);
          if (typeof top === 'string') window.scrollTo(0, top);
          const h = controls.offsetHeight;
          prevTop = top - h;
          controls.css({top: prevTop});

          calcBounds();
        }, delay);
      });
    }

    const bounds = [];

    function calcBounds() {
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
});