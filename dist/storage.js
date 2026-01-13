const DB = {
  visits: JSON.parse(localStorage.getItem('visits') || '[]'),
  currentVisit: {
    store: null,
    checklist: []
  }
};

function save() {
  localStorage.setItem('visits', JSON.stringify(DB.visits));
}
