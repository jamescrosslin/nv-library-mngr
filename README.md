# North Valley Library Book Manager

## Tech

NVLBM uses a number of open source projects to work properly:

- [node.js] - evented I/O for the backend
- [Express] - fast node.js network app framework by [@tjholowaychuk]
- [morgan] - simple logger for Node.js
- [Sequelize] - promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite and Microsoft SQL Server
- [SQLite3] - small, fast local database engine

## Installation

NVLBM requires [Node.js](https://nodejs.org/) v14+ to run.

Install the dependencies and devDependencies and start the server.

```sh
cd nvl-book-manager
npm i
npm run dev
```

For production environments...

```sh
npm install --production
NODE_ENV=production npm start
```

## Features

NVLBM offers full CRUD functionality (e.g., Create, Read, Update, Delete) functionality out of the gate.

### Read

At the `/books` url, NVLBM will display all book data from the linked SQLite3 database and display it in a paginated table which was formatted using the DataTables jQuery plugin.

A search bar is available on this route that will check for partial matches in the "Title", "Author", "Genre" and "Year" columns. Submitting your search will make a new request to the server and fetch fresh matches from the database. After searching, if you would prefer to return to a list of all books, simple click the `Home` button to gather a fresh list of all data in the database.

The data table includes sort functionality and a total entries display. Clicking a title of a book will lead you to an [update](#update-and-delete) page for that book.

You can click the `Create New Book` button to [Create](#create) a new entry in the book database.

### Create

Accessing the `/books/new` url will display a form for submitting a new database entry. The "Title" and "Author" fields cannot be blank, and the "Year" field must be an integer.

To leave the page without creating a book, hit the `Cancel` button to return to the main page.

### Update and Delete

If you'd like to update and existing book, you can navigate to that specific route by using the id of the book as a sub-path of `/books`, i.e. a book with an id attribute of `1` would be updated at the route `/books/1`.

To submit your update, click the `Update Book` button. When you update a book, the "Title" and "Author" fields cannot be blank, and the "Year" field must be an integer.

You may also click the `Delete` button to remove that book entirely. Be sure that you want to delete a book before you submit your delete request as this operation cannot be undone.

To leave the page without updating a book, hit the `Cancel` button to return to the main page.

## License

MIT

[//]: # "These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax"
[node.js]: https://nodejs.org
[@tjholowaychuk]: https://twitter.com/tjholowaychuk
[express]: https://expressjs.com
[morgan]: https://github.com/expressjs/morgan#readme
[sequelize]: https://sequelize.org/
[sqlite3]: https://www.sqlite.org/index.html
