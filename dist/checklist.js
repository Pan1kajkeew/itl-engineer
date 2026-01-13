function startChecklist() {
  const visit = { address: 'магазин', problems: [] };
  DB.visits.push(visit);
  saveDB();
  alert('Чек-лист начат');
}
