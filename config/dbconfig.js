module.exports = {
    HOST: "host",
    USER: "user",
    PASSWORD: "password",
    DB: "db",
    dialect: "mssql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};
