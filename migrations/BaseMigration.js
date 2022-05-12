import pkg from 'pg';

export default class BaseMigration {
    /**
     * Internal constructor that will set up the database connection for you.
     * @param {pkg.PoolClient} client The database connection
     */
    constructor(client) {
        this._client = client;
    }

    get client() {
        return this._client;
    }

    /**
     * Sucess is the path forward or something profound like that.
     */
    upgrade() {
        return;   
    }

    /**
     * Retreating is for losers, or maybe for smart people who know they messed up. idk lmao
     */
    downgrade() {
        return;
    }
};
