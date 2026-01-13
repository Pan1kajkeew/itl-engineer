let STORES = [];

async function loadStores() {
  try {
    const res = await fetch('data/stores.catalog.json');
    const json = await res.json();
    STORES = json.stores || [];
    console.log(`Адресов загружено: ${STORES.length}`);
  } catch (e) {
    alert('Ошибка загрузки адресной программы');
  }
}

function searchAddress(query) {
  if (!query || query.length < 3) return [];
  const q = query.toLowerCase();
  return STORES
    .filter(s => s.address.toLowerCase().includes(q))
    .slice(0, 25);
}

function renderAddressList(list) {
  const box = document.getElementById('address-list');
  box.innerHTML = list.map(s => `
    <div class="addr-item" onclick="selectStore('${s.id}')">
      <div class="addr-main">${s.address}</div>
      <div class="addr-sub">${s.zone} • ${s.network}</div>
    </div>
  `).join('');
}

function selectStore(id) {
  const store = STORES.find(s => s.id === id);
  if (!store) return;

  // Инициализируем currentVisit если его нет
  if (!DB.currentVisit) DB.currentVisit = {};
  DB.currentVisit.store = store;

  document.getElementById('address').value = store.address;
  document.getElementById('zone').innerText = store.zone;
  document.getElementById('network').innerText = store.network;

  document.getElementById('address-list').innerHTML = '';
}

loadStores();
