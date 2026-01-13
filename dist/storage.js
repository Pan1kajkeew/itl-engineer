const DB = {
  visits: JSON.parse(localStorage.getItem('visits') || '[]')
};

function saveDB() {
  localStorage.setItem('visits', JSON.stringify(DB.visits));
}
