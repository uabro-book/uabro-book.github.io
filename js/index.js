class Q {
  then(cb) {
    this.cb = cb;
  }

  catch(err) {
    this.err = err;
  }

  resolve(data) {
    this.cb && this.cb(data);
  }

  reject(err) {
    this.err && this.err(err);
  }
}

const load = name => {
  const xhr = new XMLHttpRequest();
  const q = new Q;
  xhr.open('GET', '/chapters/' + name + '.html');
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        q.resolve(xhr.responseText);
      }
      else {
        q.reject('Could not load data.');
      }
    }
  };
  xhr.send();
  return q;
};

DC.ready(() => {
  const app = DC({class: 'body'}).into(document.body);
  const view = DC({
    class: 'view'
  }).into(app);

  const controls = DC({class: 'controls center'}).into(app);

  const chapterList = [
    {
      title: 'UABRO - age of intelligent freedom',
      page: 'cover-page'
    },
    {
      title: 'Finale of development',
      page: 'finale-of-development'
    },
    {
      title: 'Intelligent freedom',
      page: 'intelligent-freedom'
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
      title: 'Lifetime as a factor',
      page: 'lifetime-as-a-factor'
    },
    {
      title: 'Infinite beauty of consciousness',
      page: 'infinite-beauty-of-consciousness'
    },
    {
      title: 'Conclusion',
      page: 'conclusion'
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

  const prev = DC('button', {
    t: '< prev',
    events: {
      click() {
        go(chapterList.getPrev(curChapter), true);
      }
    },
    prevented: ['click']
  });

  const next = DC('button', {
    t: 'next >',
    events: {
      click() {
        go(chapterList.getNext(curChapter));
      }
    },
    prevented: ['click']
  });

  const content = DC({
    class: 'content'
  }).hide();

  chapterList.forEach(c => {
    DC('button', {
      t: c.title,
      events: {
        click() {
          go(c.page);
        }
      }
    }).into(content);
  });

  const contentB = DC('button', {
    t: 'content',
    events: {
      click() {
        content.show();
      }
    },
    prevented: ['click']
  });

  controls.list([
    prev,
    contentB,
    next,
    content
  ]);

  go(localStorage.getItem('chapter') || chapterList[0]);

  function go(page, prepend) {
    if (!page) return;
    let _page;
    if (typeof page === 'object') {
      _page = page;
      page = page.page;
    } else {
      _page = chapterList.getPage(page);
    }
    const c = ram[page] || DC({class: 'chapter'});
    if (ram[page]) {
      curChapter = page;
      return insert(ram[page], page);
    }
    load(page).then(d => {
      curChapter = page;
      c.h = d || '<div class="chapter-title">' + _page.title + '</div>';
      insert(c, page);
    })
  }

  function insert(c, page) {
    localStorage.setItem('chapter', curChapter);
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
    window.scrollTo(0, c.offsetTop - 80);
    updateControls();
  }

  function updateControls() {
    const i = chapterList.getIndex(curChapter);
    if (i < 1) {
      prev.addClass('invisible')
    } else {
      prev.removeClass('invisible')
    }
    if (i === chapterList.length - 1) {
      next.addClass('invisible')
    } else {
      next.removeClass('invisible')
    }
    content.hide()
  }
});