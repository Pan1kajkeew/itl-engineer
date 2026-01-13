# ITL Engineer

Инструмент для инженеров ITL.

## Структура проекта

```
itl-engineer/
├─ .github/
│  └─ workflows/
│     └─ android.yml              # CI/CD для сборки Android
├─ android/                       # Проект Android (генерируется Capacitor)
├─ dist/                          # Сборка веб-приложения
│  ├─ index.html                  # Основной UI
│  ├─ styles.css                  # Дизайн
│  ├─ app.js                      # Точка входа
│  ├─ router.js                   # Навигация
│  ├─ storage.js                  # localStorage / данные
│  ├─ checklist.js                # Чек-лист оборудования
│  ├─ audit.js                    # Аудит
│  ├─ export.js                   # Telegram-экспорт
│  └─ assets/                     # Логотипы и ресурсы
├─ data/                          # Каталоги данных (JSON)
│  ├─ equipment.catalog.json
│  ├─ stores.catalog.json
│  ├─ network.presets.json
│  └─ audit.catalog.json
├─ capacitor.config.ts            # Конфигурация Capacitor
├─ package.json                   # Зависимости и скрипты
└─ README.md                      # Документация
```
