const DB = {
  visits: JSON.parse(localStorage.getItem('visits') || '[]'),
  currentVisit: {
    store: null,
    checklist: [],
    status: 'draft',
    startedAt: new Date().toISOString()
  }
};

function save() {
  localStorage.setItem('visits', JSON.stringify(DB.visits));
}
