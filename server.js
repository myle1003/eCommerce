const app = require("./src/app");

const PORT = process.env.PORT || 3055;

const server = app.listen(PORT, () => {
    console.log(`WSV commerce start with ${PORT}`);
})

// phuong thuc qui trinh trong node
process.on('SIGINT', () => {
    server.close(() => console.log(`Exit Server Express`));
})