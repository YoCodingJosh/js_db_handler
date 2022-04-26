work in progress

ideas:
* dev.js will...
    * set up local postgres (through docker)
    * make migrations
    * run migrations locally
    * generate test data
    * reset local database
* main.js will be the driver that will run through the migrations
    * it will use a doubly-linked list of hashes to run the migrations (kinda like SQLAlchemy)
    * first migration will be id/hash of 0
    * there will be a couple of tables in postgres that keeps track of the migrations
        * `migration_status` will be a single row/column that says `not run`/`running`/`completed`
        * `migrations` will be a list of the migration hashes with timestamp of run with a status of completed or failed
    * main.js will be oriented toward production usage, but will export functionality so dev.js can use it (ie: run migrations locally, etc.)
