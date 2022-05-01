-- Create reference key tables

CREATE TABLE [IF NOT EXISTS] migration_statuses (
    id serial PRIMARY KEY,
    status VARCHAR(20),
    description VARCHAR(255)
);

-- Creates the migrations table

CREATE TABLE [IF NOT EXISTS] migrations (
    step serial PRIMARY KEY,
    migration_id VARCHAR(100) NOT NULL,
    FOREIGN KEY(migration_status)
        REFERENCES migration_statuses(id) NOT NULL,
    step_timestamp TIMESTAMP,
);
