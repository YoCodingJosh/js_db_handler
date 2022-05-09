-- Create reference key tables

CREATE TABLE [IF NOT EXISTS] migration_statuses (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20) NOT NULL,
    description TEXT NOT NULL
);

-- Creates the migrations table

CREATE TABLE [IF NOT EXISTS] migrations (
    step SERIAL PRIMARY KEY,
    migration_id VARCHAR(100) NOT NULL,
    FOREIGN KEY(migration_status)
        REFERENCES migration_statuses(id) NOT NULL,
    step_timestamp TIMESTAMP NOT NULL,
    message TEXT
);
