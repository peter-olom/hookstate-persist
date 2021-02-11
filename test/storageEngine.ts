const storage: Record<string, any> = {
  testState:
    '{"user":{"name":"Peter Olom","languages":["TypeScript","C#"]},"location":"Earth"}',
};
const storageEngine = {
  storage: storage,
  getItem: function(key: string) {
    return this.storage[key];
  },
  setItem: function(key: string, val: string) {
    this.storage[key] = val;
  },
};

export default storageEngine;
