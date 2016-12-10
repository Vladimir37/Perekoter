# Perekoter
Инструмент для автоматических Перекотов.

Perekoter предназначен для автоматического создания новых тредов на имиджборде 2ch.hk вместо уже достигших максимального количества постов. Это работает так - с указанной вами периодичностью Perekoter отправляет запрос на 2ch, где проверяет количество постов в треде. Если количество постов превышает заданный вами бамплимит (максимальное количество постов), то совершается Перекот - создание нового треда. Стартовое изображение и шапку (стартовый текст) вы также задаёте сами. Сразу после создания нового треда в старый тред отправляется пост с уведомлением о новом треде и ссылкой на него.
2ch API актуально на декабрь 2016 года.

## Достоинства
- **Быстрая работа** - серверная часть Perekoter'а написана на Golang, а клиентская - на React. Благодаря этому вам не придётся переживать из-за тормозов или задержек.
- **Нетребовательность** - вы можете скачать уже скомпилированную версию Perekoter'a. Нативный код не требует дополнительных приложений или библиотек и работает из коробки. Клиентский JS код уже минифицирован и собран в один файл с обеспечением кроссбраузерности.
- **Удобство** - вам не нужно вручную редактировать десятки конфигов. Вам нужно указать только порт, всё остальное можно изменить через интерфейс.
- **Наглядность** - любой сторонний пользователь, зашедший на ваш Perekoter, увидит список всех активных перекатываемых тредов, а также полную информацию по каждому треду - шапка, название, изображение, ссылка на текущий тред и другое.
- **Гибкость** - через удобный веб-интерфейс вы можете настроить практически всё. Для примера: вы можете указать как "сырой" текст шапки, так и ссылку на него. Во втором случае при каждом Перекоте шапка будет запрашиваться заново, что позволит вынести её на сторонний ресурс - например, GitHub.
- **API** - полноценное API позволяет вам создавать любые интерфейсы к Perekoter'у. Вы можете сделать мобильное, десктопное, консольное или любое другое приложение в том случае, если вас не устраивает поставляемый по-умолчанию веб-интерфейс.
- **Простота** - справиться с базовыми возможностями Perekoter'a может даже человек, никогда не занимавшийся программированием.

## Запуск
### Скомпилированный Perekoter
Самым простым способом установки является скачивание и запуск уже скомпилированных бинарников. Сначала вам нужно скачать ветку `bin` этого репозитория. Для этого выполните следующую команду:

```
git clone -b bin https://github.com/Vladimir37/Perekoter
```

После чего перейдите в появившийся каталог и выполните это:

```
./Perekoter
```

При необходимости дайте права на запуск Perekoter'у. Вот так:

```
sudo chmod +x Perekoter
```

Однако учтите, что если вы выйдите из приложения, то Perekoter будет остановлен. Для его постоянной работы нужно запустить его в фоне. Вы можете использовать Supervisor или иные специализированные приложения управления процессами. Самым простым способом можно назвать `nohup`. Запуск Perekoter'а в фоне с ним выглядит вот так:

```
nohup ./Perekoter &
```

Обратите внимание, что в этом варианте поставки нет исходников, так что вы не сможете редактировать ни серверную, ни клиентскую часть. Перед запуском вы можете указать нужный порт в `Perekoter/config.json`.

### Самостоятельная компиляция
#### Сборка сервера
Также вы можете скачать исходники Perekoter'а и самостоятельно собрать его. Для этого вам понадобится Golang и некоторые зависимости. Установите Golang из пакетного менеджера вашего дистрибутива, после чего установите зависимости последовательным выполнением этих команд:

```
go get github.com/gin-gonic/gin
go get github.com/jinzhu/gorm
go get github.com/jinzhu/gorm/dialects/sqlite
go get github.com/aubm/interval
go get github.com/parnurzeal/gorequest
go get github.com/StefanSchroeder/Golang-Roman
```

Обратите внимание, что исходники Perekoter'а должны находится в `$GOPATH/src`. Для сборки выполните эту команду из корневого каталога Perekoter'а :

```
go build Perekoter.go
```

#### Сборка клиента
Клиентская часть расположена по адресу `Perekoter/client/front`. Все последующие команды нужно выполнять оттуда. Сначала установите все зависимости этой командой:

```
npm i
```

Если у вас не установлен Gulp, его следует установить глобально этой командой:

```
npm install -g gulp
```

Вы можете производить сборку скриптов и стилей в двух режимах - Development и Production. Второй режим включает в себя сжатие и минификацию. Для сборки нужно выполнить команду вида:

```
gulp [target]-[mode]
```

где `target` - это цель, а `mode` - режим. Цель может быть такой:

- **scripts** - скрипты (множество .jsx в один .js)
- **styles** - стили (множество .less в один .css)
- **all** - скрипты и стили вместе.

А режим одним из двух:

- **dev** - Development
- **prod** - Production

Таким образом, команда `gulp scripts-dev` соберёт все скрипты в Development режиме, а `gulp all-prod` - скрипты и стили в Production режиме. Все собранные файлы хранятся в `Perekoter/client/front/files/builds`. Скрипты сохраняются в `scripts.js` (или `scripts.min.js` в Production режиме), а стили - в `styles.css` (или `styles.min.css` в Production режиме).

## Управление
Сразу после запуска необходимо изменить логин, пароль и секретный ключ. Логин и пароль можно изменить тут: **Управление -> Настройки -> Изменить юзера**. Для изменения секретного ключа выберите **Изменить данные** на этой же странице. Учтите, что после каждого этого изменения будет произведён выход из аккаунта, так что вам придётся заходить заново. Перед созданием перекатываемых тредов вам необходимо вначале создать доску, на которой находятся эти треды. Перейти к созданию и редактированию различных сущностей вы можете выбрав **Управление** в верхней панели или перейдя по адресу `/control`.
