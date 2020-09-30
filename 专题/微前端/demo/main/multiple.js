import { loadMicroApp } from 'qiankun';

const app1 = loadMicroApp(
  { name: 'react16', entry: '//localhost:7102', container: '#react16' },
  {
    sandbox: {
      // strictStyleIsolation: true,
    },
  },
);

const app2 = loadMicroApp(
  { name: 'vue', entry: '//localhost:7101', container: '#vue' },
  {
    sandbox: {
      // strictStyleIsolation: true,
    },
  },
);
