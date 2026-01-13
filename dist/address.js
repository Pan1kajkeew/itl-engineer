let storesData = [];

async function loadStores() {
  try {
    const response = await fetch('../data/stores.catalog.json');
    const data = await response.json();
    storesData = data.stores;
  } catch (e) {
    console.error('Ошибка загрузки адресной программы', e);
  }
}

function searchAddress(query) {
  if (!query) return [];
  const q = query.toLowerCase();
  return storesData.filter(s => 
    s.address.toLowerCase().includes(q) || 
    s.brand.toLowerCase().includes(q)
  ).slice(0, 5);
}

function handleAddressInput(input) {
  const results = searchAddress(input.value);
  let list = document.getElementById('address-results');
  
  if (!list) {
    list = document.createElement('div');
    list.id = 'address-results';
    list.className = 'address-suggestions';
    input.parentNode.appendChild(list);
  }

  list.innerHTML = results.map(s => `
    <div class="suggestion-item" onclick="selectAddress('${s.address}', '${s.brand}')">
      <strong>${s.brand}</strong><br>
      <small>${s.address}</small>
    </div>
  `).join('');
}

function selectAddress(addr, brand) {
  const input = document.querySelector('input[placeholder="Адрес магазина"]');
  if (input) {
    input.value = `${brand}: ${addr}`;
    document.getElementById('address-results').innerHTML = '';
  }
}

loadStores();
