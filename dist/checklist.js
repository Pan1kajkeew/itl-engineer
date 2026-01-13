let EQUIPMENT = [];

async function loadEquipment() {
  try {
    const res = await fetch('data/equipment.catalog.json');
    const json = await res.json();

    EQUIPMENT = json.categories.map(cat => ({
      category: cat.name,
      items: cat.items.map(i => ({
        id: i.id,
        name: i.name
      }))
    }));
  } catch (e) {
    console.error('Error loading equipment:', e);
  }
}

function renderChecklist() {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <h2>Чек-лист оборудования</h2>

    ${EQUIPMENT.map(cat => `
      <h3>${cat.category}</h3>
      <table class="checklist" style="width:100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background: #eee;">
            <th style="border: 1px solid #ddd; padding: 8px;">Оборудование</th>
            <th style="border: 1px solid #ddd; padding: 8px;">ОК</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Привезти</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Дата</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Комментарий</th>
          </tr>
        </thead>
        <tbody>
          ${cat.items.map(e => renderRow(e)).join('')}
        </tbody>
      </table>
    `).join('')}

    <button onclick="finishVisit()" style="width: 100%; padding: 15px; background: #0b3c5d; color: white; border: none; border-radius: 8px; font-size: 16px;">Завершить выезд</button>
  `;
}

function renderRow(e) {
  const item = getItem(e.id);
  const error = validateItem(item);

  return `
    <tr class="${error ? 'row-error' : ''}" style="border: 1px solid #ddd;">
      <td style="padding: 8px; border: 1px solid #ddd;">${e.name}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: center;"><input type="checkbox" ${item.ok ? 'checked' : ''}
        onchange="toggleOk('${e.id}', this.checked)"></td>
      <td style="padding: 8px; border: 1px solid #ddd;"><input type="number" min="0" style="width: 50px;" value="${item.qty || ''}"
        onchange="setQty('${e.id}', this.value)"></td>
      <td style="padding: 8px; border: 1px solid #ddd;"><input type="date" value="${item.date || ''}"
        onchange="setDate('${e.id}', this.value)"></td>
      <td style="padding: 8px; border: 1px solid #ddd;"><input type="text" style="width: 100%;" value="${item.comment || ''}"
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
  save();
}

function setQty(id, val) {
  getItem(id).qty = Number(val || 0);
  save();
}

function setDate(id, val) {
  getItem(id).date = val;
  save();
}

function setComment(id, val) {
  getItem(id).comment = val;
  save();
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

  DB.visits.push(JSON.parse(JSON.stringify(DB.currentVisit)));

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

loadEquipment();
