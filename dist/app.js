function render() {
  const app = document.getElementById('app');

  if (screen === 'home') {
    app.innerHTML = `
      <h2>Инженер ITL</h2>
      <div class="card">Создайте новый выезд или откройте историю</div>
    `;
  }

  if (screen === 'new') {
    app.innerHTML = `
      <h2>Новый выезд</h2>
      <input placeholder="Адрес магазина">
      <button onclick="startChecklist()">Далее</button>
    `;
  }

  if (screen === 'visits') {
    app.innerHTML = `
      <h2>История</h2>
      ${DB.visits.map(v => `<div class="card">${v.address}</div>`).join('')}
    `;
  }

  if (screen === 'settings') {
    app.innerHTML = `
      <h2>Настройки</h2>
      <div class="card">Тема • Импорт • Экспорт</div>
    `;
  }
}

render();
