# Система коммитов

- Формат: `-SUFFIX NAME.MINI_DESC-FILE`

- Примеры:
```
-ref test
-save test
-fix test
-ref-save test.test-test.js
-fix-ref test.desc-ready.listener.ts
-prod.1 preparing to prod
```

| Суффикс  | Описание                           |
| -------- | ---------------------------------- |
| -alpha   | Альфа версия                       |
| -beta    | Бета версия                        |
| -rel     | Релиз                              |
| -build   | Сборка                             |
| -docs    | Обновление документации            |
| -fix     | Исправление ошибок                 |
| -hot     | Горячее обновление                 |
| -new     | Добавление нового функционала      |
| -other   | Другое                             |
| -prod    | Подготовка к релизу                |
| -ref     | Рефакторинг кода                   |
| -save    | Сохранение изменение               |
| -sec     | Безопасность                       |
| -style   | Обновление стиля кода              |
| -test    | Тестирование, добавление тестов    |
| -ver     | Обновление версии                  |
| -log     | Обновление логов                   |