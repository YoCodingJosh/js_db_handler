import pkg from 'pg';

/**
 * Base migration that other migrations should inherit from.
 * @author Josh Kennedy
 */
export default class BaseMigration {
    /**
     * Internal constructor that will set up the database connection for you.
     * @param {pkg.PoolClient} client The database connection
     */
    constructor(client) {
        this.client = client;
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
