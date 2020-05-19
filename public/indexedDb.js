let db;
const request = indexedDB.open('budget-trackerDB');

request.onupgradeneeded = function(event) {
  // create object store called 'pending' and set autoIncrement to true
  db = event.target.result
  db.createObjectStore('pending', { autoIncrement: true });
};

request.onsuccess = function(event) {
  db = event.target.result;

  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function(event) {
  // log error here
  console.log('ON ERROR', event.target.error);
};

function saveRecord(record) {
  const tx = db.transaction('pending', 'readwrite');
  const store = tx.objectStore('pending');
  store.add(record);
};

function checkDatabase() {
  const tx = db.transaction('pending');
  const store = tx.objectStore('pending');
  const getAll = store.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(() => {
          const tx = db.transaction('pending', 'readwrite');
          const store = tx.objectStore('pending');
          store.clear();
        });
    };
  };
};

  window.addEventListener('online', checkDatabase);