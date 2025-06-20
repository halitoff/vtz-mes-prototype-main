// indexedDB.js
const DB_NAME = "UnitsTreeDB";
const STORE_NAME = "units";
const DB_VERSION = 1;

let db = null;

export const initDB = () =>
    new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id" });
            }
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            resolve();
        };

        request.onerror = (event) => {
            reject("Ошибка открытия IndexedDB", event);
        };
    });

export const saveToDB = (data) =>
    new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);

        store.clear(); // очищаем старые данные
        store.put({ id: "tree", data });

        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });

export const loadFromDB = () =>
    new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const request = store.get("tree");

        request.onsuccess = () => resolve(request.result?.data || null);
        request.onerror = () => resolve(null);
    });