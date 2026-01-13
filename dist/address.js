let STORES = [];

async function loadStores() {
  const res = await fetch('../data/stores.catalog.json');
  const json = await res.json();
  STORES = json.stores;
}

function searchAddress(query) {
  if (!query) return [];
  return STORES.filter(s =>
    s.address.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 20);
}

function renderAddressList(list) {
  const box = document.getElementById('address-list');
  box.innerHTML = list.map(s =>
    `<div class="addr-item" onclick="selectStore('${s.id}')">
      ${s.address}<br><small>${s.zone} • ${s.network}</small>
    </div>`
  ).join('');
}

function selectStore(id) {
  const s = STORES.find(x => x.id === id);
  DB.currentVisit.store = s;
  document.getElementById('address').value = s.address;
  document.getElementById('zone').innerText = s.zone;
  document.getElementById('network').innerText = s.network;
  document.getElementById('address-list').innerHTML = '';
}

loadStores();
