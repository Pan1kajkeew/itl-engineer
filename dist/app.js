let screen = 'home';

function render() {
  const app = document.getElementById('app');
  if (!app) return;

  // Update nav active state
  document.querySelectorAll('nav button').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('onclick').includes(`'${screen}'`)) {
      btn.classList.add('active');
    }
  });

  if (screen === 'home') {
    app.innerHTML = `
      <div class="welcome-section" style="margin-bottom: 30px;">
        <h2 style="margin-bottom: 5px;">Добрый день, Инженер</h2>
        <p style="color: var(--text-muted); margin: 0;">Готовы к новому выезду?</p>
      </div>
      
      <div class="card" style="text-align: center; padding: 40px 20px; border: none; background: linear-gradient(135deg, #0b3c5d 0%, #1d5a85 100%); color: white;">
        <div style="font-size: 48px; margin-bottom: 20px;">📋</div>
        <h3 style="margin-top: 0; color: white; font-size: 20px;">Новый выезд</h3>
        <p style="opacity: 0.8; margin-bottom: 24px;">Начните проверку оборудования</p>
        <button class="btn-primary" style="background: white; color: var(--primary); box-shadow: 0 4px 15px rgba(0,0,0,0.2);" onclick="go('new')">Начать сейчас</button>
      </div>

      <div class="card" style="display: flex; align-items: center; gap: 15px; cursor: pointer; margin-top: 20px;" onclick="go('visits')">
        <div style="font-size: 24px; background: #f1f5f9; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; border-radius: 12px;">🕒</div>
        <div style="flex: 1;">
          <div style="font-weight: 700;">История</div>
          <div style="font-size: 12px; color: var(--text-muted);">Просмотр и экспорт отчетов</div>
        </div>
        <div style="color: var(--text-muted); font-weight: bold;">→</div>
      </div>
    `;
  }

  if (screen === 'new') {
    app.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
        <button onclick="go('home')" style="background: none; border: none; padding: 0; font-size: 24px; color: var(--primary); cursor: pointer;">←</button>
        <h2 style="margin: 0;">Новый выезд</h2>
      </div>

      <div class="card">
        <div class="input-group">
          <label>Адрес магазина</label>
          <input
            id="address"
            type="text"
            placeholder="Начните ввод адреса..."
            oninput="handleAddressInput(this.value)"
            autocomplete="off"
          />
        </div>

        <div id="address-list"></div>

        <div class="meta">
          <div class="meta-row">
            <span class="meta-label">Зона:</span>
            <span class="meta-value" id="zone">—</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Сеть:</span>
            <span class="meta-value" id="network">—</span>
          </div>
        </div>

        <button class="btn-primary" id="start-btn" onclick="startChecklist()" style="opacity: 0.5;" disabled>Перейти к чек-листу</button>
      </div>
    `;
  }

  if (screen === 'checklist') {
    renderChecklist();
  }

  if (screen === 'visits') {
    app.innerHTML = `
      <h2>История выездов</h2>
      ${DB.visits.length > 0 
        ? DB.visits.slice().reverse().map((v, i) => {
            const originalIdx = DB.visits.length - 1 - i;
            return `
            <div class="card history-card">
              <div class="history-header">
                <div class="history-info">
                  <div class="addr-main" style="font-size: 15px;">${v.store.address}</div>
                  <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">
                    ${new Date(v.startedAt).toLocaleDateString()} • ${v.store.network}
                  </div>
                </div>
                <span class="badge badge-${v.status}">${v.status === 'done' ? 'Завершен' : 'Черновик'}</span>
              </div>
              <button class="btn-outline" onclick="exportTelegram(${originalIdx})">
                📤 Отправить в Telegram
              </button>
            </div>
          `}).join('')
        : '<div class="card" style="text-align: center; color: var(--text-muted); padding: 40px;">История пока пуста</div>'
      }
    `;
  }

  if (screen === 'settings') {
    app.innerHTML = `
      <h2>Настройки</h2>
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <span>Темная тема</span>
          <div style="color: var(--text-muted); font-size: 12px;">Скоро</div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>Версия приложения</span>
          <span style="font-weight: 700; color: var(--primary);">1.1 PROD</span>
        </div>
      </div>
      <button class="btn-outline" style="color: #ef4444; border-color: #ef4444;" onclick="if(confirm('Очистить все данные?')) { localStorage.clear(); location.reload(); }">
        🗑 Очистить базу данных
      </button>
    `;
  }
}

function handleAddressInput(val) {
  const list = searchAddress(val);
  renderAddressList(list);
  
  if (val.length < 3) {
    document.getElementById('zone').innerText = '—';
    document.getElementById('network').innerText = '—';
    const btn = document.getElementById('start-btn');
    if (btn) {
      btn.style.opacity = '0.5';
      btn.disabled = true;
    }
  }
}

// Global function for address selection
window.selectStore = function(id) {
  const store = STORES.find(s => s.id === id);
  if (!store) return;

  DB.currentVisit.store = store;

  document.getElementById('address').value = store.address;
  document.getElementById('zone').innerText = store.zone;
  document.getElementById('network').innerText = store.network;
  document.getElementById('address-list').innerHTML = '';
  
  const btn = document.getElementById('start-btn');
  if (btn) {
    btn.style.opacity = '1';
    btn.disabled = false;
  }
};

async function startChecklist() {
  if (!DB.currentVisit || !DB.currentVisit.store) {
    alert('Сначала выберите магазин');
    return;
  }
  
  await loadEquipment();
  
  DB.currentVisit.startedAt = new Date().toISOString();
  DB.currentVisit.status = 'draft';
  DB.currentVisit.checklist = [];
  
  go('checklist');
}

document.addEventListener('DOMContentLoaded', () => {
  render();
});
