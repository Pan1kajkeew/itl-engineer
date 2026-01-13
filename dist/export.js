function exportTelegram(idx) {
  const v = DB.visits[idx];

  let text = `🟦 ITL Engineer\n`;
  text += `📍 ${v.store.address}\n`;
  text += `🏷 ${v.store.zone} • ${v.store.network}\n\n`;

  const problems = v.checklist.filter(i => !i.ok || i.qty > 0);

  if (problems.length === 0) {
    text += '✔ Нарушений не выявлено';
  } else {
    problems.forEach((p, i) => {
      text += `${i + 1}. ${p.id}\n`;
      if (p.qty > 0) text += `   Привезти: ${p.qty}\n`;
      if (p.date) text += `   Дата: ${p.date}\n`;
      if (p.comment) text += `   Комментарий: ${p.comment}\n`;
      text += `\n`;
    });
  }

  navigator.share({ text });
}
