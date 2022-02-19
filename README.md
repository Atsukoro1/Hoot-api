# Hoot-backend

Hoot-backend is api server for my Twitter-like web application.

## Installation

1. Make sure you have [Node.js](https://pip.pypa.io/en/stable/) (16.14.0) installed.

2. Get the connection string at [Mongo Site](https://www.mongodb.com/)

3. Fill out the .env file
```env
PORT=port_you_wish_to_use
JWT_SECRET=some_secret_text
MONGO_URI=mongo_uri
```

4. Install dependencies
```bash
npm install
```

## How to run it

```bash
npm run start:dev
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)