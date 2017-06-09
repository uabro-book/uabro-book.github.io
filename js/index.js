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

const parse = str => {
  let html = str.replace();
  return hmtl;
};

DC.ready(() => {
  const body = document.body;
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

  load('intro').then(d => {
    console.log(d);
    body.h = d;
  })
});