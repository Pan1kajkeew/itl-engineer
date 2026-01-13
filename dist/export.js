function exportTelegram(idx) {
  const v = DB.visits[idx];
  if (!v) return;

  let text = `🟦 ITL Engineer\n`;
  text += `📍 ${v.store.address}\n`;
  text += `🏷 ${v.store.zone} • ${v.store.network}\n\n`;

  const problems = v.checklist.filter(i => !i.ok || i.qty > 0);

  if (problems.length === 0) {
    text += '✔ Нарушений не выявлено';
  } else {
    problems.forEach((p, i) => {
      // Find equipment name from EQUIPMENT global if available, or use ID
      let name = p.id;
      EQUIPMENT.forEach(cat => {
        const found = cat.items.find(item => item.id === p.id);
        if (found) name = found.name;
      });

      text += `${i + 1}. ${name}\n`;
      if (p.qty > 0) text += `   Привезти: ${p.qty}\n`;
      if (p.date) text += `   Дата: ${p.date}\n`;
      if (p.comment) text += `   Комментарий: ${p.comment}\n`;
      text += `\n`;
    });
  }

  if (navigator.share) {
    navigator.share({ text }).catch(err => {
      console.error('Ошибка при попытке поделиться:', err);
    });
  } else {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    alert('Текст отчета скопирован в буфер обмена');
  }
}
