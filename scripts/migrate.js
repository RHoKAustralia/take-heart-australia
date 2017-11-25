const Postgrator = require('postgrator');

const postgrator = new Postgrator({
 // Directory containing migration files
 migrationDirectory: __dirname + '/../migrations',
 // Driver: must be pg, mysql, or mssql
 driver: 'pg',
 // Database connection config
 host: '127.0.0.1',
 port: 5432,
 database: 'databasename',
 username: 'username',
 password: 'password',
 // Schema table name. Optional. Default is schemaversion
 schemaTable: 'schemaversion'
});

// Migrate to max version (optionally can provide 'max')
postgrator.migrate();