# Hookstate Persist

Simple and configurable peristence plugin for [Hookstate state management](https://hookstate.js.org/).

> Works on React Native and Web.


## Installation

To install, run:

```bash
yarn add hookstate-persist
```

```bash
npm install hookstate-persist
```


## Usage
```Typescript
// React Native
import {createState} from '@hookstate/core';
import CreatePersistor, {PersistorWrapper} from 'hookstate-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Product} from '../utils/types';

// for map/tree like state, wrap root state with Persist wrapper
// this gives you the benefit of validating the hydrateTime value 
const wrapped = PersistorWrapper({
  cart: [] as Array<Product>,
  user: {} as User,
  location: '',
});
const store = createState(wrapped);

// create the peristor pluging
const persistor = CreatePersistor({
	key: '@myStore', // store name
	engine: AsyncStorage, // storage engine which implements getItem & setItem
});

// attach plugin and you're done
store.attach(persistor);


```


### Peristor options

```js
CreatePersistor {
  key: string, // key in storage
  engine: StoreEngine, // engine; any type of storage that implements "getItem" and "setItem" eg AsyncStorage or localStorage
  whitelist?: Array<string>, // property names of items in state you want to persist (optional)
  blacklist?: Array<string>, // property names of items in state you want excluded from storage(optional)
}

```

## API

```js
  export default store;
  CreatePersistor(config: ICreatePersistor) // creates the peristence plugin
  PersistorWrapper(state: State<S>) // Wrapps the root state. Do not use if root state is not map/tree like
```

## Contiributions
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

 [MIT](https://choosealicense.com/licenses/mit/)
