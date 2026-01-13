function sendTelegram() {
  const v = DB.visits.at(-1);
  if (!v || !v.store) {
    alert('Нет данных для экспорта');
    return;
  }

  let text = `🟦 ITL Engineer\n${v.store.address}\n\n`;

  v.problems.forEach((p, i) => {
    text += `${i+1}. ${p.name}\nПривезти: ${p.qty}\nДата: ${p.date}\n\n`;
  });

  if (navigator.share) {
    navigator.share({ text }).catch(err => {
      console.error('Ошибка при попытке поделиться:', err);
    });
  } else {
    // Фолбэк, если Web Share API не поддерживается (например, в некоторых браузерах на ПК)
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    alert('Текст отчета скопирован в буфер обмена (Web Share API не поддерживается)');
  }
}
