let EQUIPMENT = [];

async function loadEquipment() {
  const res = await fetch('data/equipment.catalog.json');
  const json = await res.json();

  EQUIPMENT = json.categories.map(cat => ({
    category: cat.name,
    items: cat.items.map(i => ({
      id: i.id,
      name: i.name
    }))
  }));
}

function renderChecklist() {
  const app = document.getElementById('app');

  app.innerHTML = `
    <h2>Чек-лист оборудования</h2>

    ${EQUIPMENT.map(cat => `
      <h3>${cat.category}</h3>
      <table class="checklist">
        <thead>
          <tr>
            <th>Оборудование</th>
            <th>ОК</th>
            <th>Привезти</th>
            <th>Дата</th>
            <th>Комментарий</th>
          </tr>
        </thead>
        <tbody>
          ${cat.items.map(e => renderRow(e)).join('')}
        </tbody>
      </table>
    `).join('')}

    <button onclick="finishVisit()">Завершить выезд</button>
  `;
}

function renderRow(e) {
  const item = getItem(e.id);
  const error = validateItem(item);

  return `
    <tr class="${error ? 'row-error' : ''}">
      <td>${e.name}</td>
      <td><input type="checkbox" ${item.ok ? 'checked' : ''}
        onchange="toggleOk('${e.id}', this.checked)"></td>
      <td><input type="number" min="0" value="${item.qty || ''}"
        onchange="setQty('${e.id}', this.value)"></td>
      <td><input type="date" value="${item.date || ''}"
        onchange="setDate('${e.id}', this.value)"></td>
      <td><input type="text" value="${item.comment || ''}"
        onchange="setComment('${e.id}', this.value)"></td>
    </tr>
  `;
}

function getItem(id) {
  let item = DB.currentVisit.checklist.find(i => i.id === id);
  if (!item) {
    item = { id, ok: false, qty: 0, date: '', comment: '' };
    DB.currentVisit.checklist.push(item);
  }
  return item;
}

function toggleOk(id, val) {
  getItem(id).ok = val;
}

function setQty(id, val) {
  getItem(id).qty = Number(val || 0);
}

function setDate(id, val) {
  getItem(id).date = val;
}

function setComment(id, val) {
  getItem(id).comment = val;
}

function validateItem(item) {
  if (item.qty > 0 && !item.date) return true;
  if (item.date && item.qty <= 0) return true;
  return false;
}

function finishVisit() {
  const errors = DB.currentVisit.checklist.filter(validateItem);

  if (errors.length > 0) {
    alert('Нельзя завершить выезд:\nесть позиции с количеством без даты или датой без количества.');
    renderChecklist();
    return;
  }

  DB.currentVisit.status = 'done';
  DB.currentVisit.finishedAt = new Date().toISOString();

  DB.visits.push(DB.currentVisit);

  DB.currentVisit = {
    store: null,
    checklist: [],
    status: 'draft',
    startedAt: new Date().toISOString()
  };

  save();
  alert('Выезд завершён');
  go('visits');
}
