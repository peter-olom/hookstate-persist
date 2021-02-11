import {StateValueAtRoot, State} from '@hookstate/core';

// should be global variable
const PersistPluginId = Symbol('PersistPluginId');

export interface getItem {
	(key: string): Promise<string | null> | string;
}
export interface setItem {
	(key: string, value: string): Promise<void> | void;
}

export interface StoreEngine {
	getItem: getItem;
	setItem: setItem;
}

export interface ICreatePersistor {
	key: string;
	engine: StoreEngine;
	blacklist?: Array<string>;
	whitelist?: Array<string>;
}
function CreatePersistor({key, engine, blacklist, whitelist}: ICreatePersistor) {
	return function PersistPlugin() {
		return {
			id: PersistPluginId,
			init: (s: State<StateValueAtRoot>) => {
        const engineResponse = engine.getItem(key);
				// hyrateTime the state from async storage
				Promise.resolve(engineResponse).then((res) => {
					if (res) {
						const store = JSON.parse(res);
						s.merge(store);
					}
					s.merge({hyrateTime: Date.now()});
				});

				return {
					onSet: (data: any) => {
						// copy data.state and operate on it
						const state = {...data.state};
						if (typeof state == 'object') {
							if (blacklist) {
								// delete said keys before peristing only if object
								blacklist.forEach((item) => {
									delete state[item];
								});
							} else if (whitelist) {
								// create a blacklist and delete them
								const manualBlacklist = Object.keys(state).filter((item) => whitelist.indexOf(item) < 0);
								manualBlacklist.forEach((item) => {
									delete state[item];
								});
							}
							delete state['hydateTime'];
						}
						engine.setItem(key, JSON.stringify(state));
					},
				};
			},
		};
	};
}

function PersistorWrapper<S>(state: S) {
	if (typeof state == 'object') {
		return {
			...state,
			hyrateTime: null,
		};
	}
	throw new Error('This helper only works on object trees');
}

export default CreatePersistor;

export {PersistorWrapper};
