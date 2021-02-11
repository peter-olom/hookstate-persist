import { createState } from '@hookstate/core';
import CreatePersistor, { PersistorWrapper } from '../src/index';
import storageEngine from './storageEngine';

// create store and test plugin
const wrapped = PersistorWrapper({ user: {}, location: '' });
const store = createState(wrapped);

const persistor = CreatePersistor({
  key: 'testState',
  engine: storageEngine,
});
store.attach(persistor);

const hydrator = () => {
  return new Promise<Record<string, unknown>>((resolve, reject) => {
    setTimeout(() => {
      const state = store.get();
      if (state.hydrateTime) {
        resolve(state);
      } else {
        reject('Failed to hydrate state');
      }
    }, 1000);
  });
};

describe('The store was loaded from storage ', () => {
  it('loaded storage correctly', async () => {
    const res = await hydrator();
    expect(res).toMatchObject({
      user: { name: 'Peter Olom', languages: ['TypeScript', 'C#'] },
      location: 'Earth',
    });
  });
});

describe('The hydration time exists', () => {
  it('hydrate time check', async () => {
    const res = await hydrator();
    expect(res).toHaveProperty('hydrateTime');
  });
});

describe('The storage was updated', () => {
  it('Location updated to Mars', async () => {
    // update location
    store.location.set('Mars');
    // read storage directly
    const res = JSON.parse(storageEngine.getItem('testState'));
    expect(res.location).toBe('Mars');
  });
});
