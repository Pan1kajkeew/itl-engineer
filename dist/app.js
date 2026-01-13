let screen = 'home';

function render() {
  const app = document.getElementById('app');
  if (!app) return;

  if (screen === 'home') {
    app.innerHTML = `
      <h2>Инженер ITL</h2>
      <div class="card">Создайте новый выезд или откройте историю</div>
    `;
  }

  if (screen === 'new') {
    app.innerHTML = `
      <h2>Новый выезд</h2>

      <label>Адрес магазина</label>
      <input
        id="address"
        placeholder="Начните ввод адреса"
        oninput="renderAddressList(searchAddress(this.value))"
        autocomplete="off"
      />

      <div id="address-list"></div>

      <div class="meta">
        <div>Зона: <b id="zone">—</b></div>
        <div>Сеть: <b id="network">—</b></div>
      </div>

      <button onclick="startChecklist()">Перейти к чек-листу</button>
    `;
  }

  if (screen === 'checklist') {
    renderChecklist();
  }

  if (screen === 'visits') {
    app.innerHTML = `
      <h2>История</h2>
      ${DB.visits.length > 0 
        ? DB.visits.map((v, i) => `
            <div class="card">
              <b>${v.store.address}</b><br>
              ${new Date(v.startedAt).toLocaleDateString()}
              <br>
              Статус: <b>${v.status}</b>
              <br><br>
              <button onclick="exportTelegram(${i})">Отправить в Telegram</button>
            </div>
          `).join('')
        : '<div class="card">История пуста</div>'
      }
    `;
  }

  if (screen === 'settings') {
    app.innerHTML = `
      <h2>Настройки</h2>
      <div class="card">Тема • Импорт • Экспорт</div>
    `;
  }
}

function startChecklist() {
  if (!DB.currentVisit || !DB.currentVisit.store) {
    alert('Сначала выберите магазин');
    return;
  }
  
  DB.currentVisit.startedAt = new Date().toISOString();
  DB.currentVisit.status = 'draft';
  DB.currentVisit.checklist = [];
  
  go('checklist');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  render();
});
