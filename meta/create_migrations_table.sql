CREATE TABLE migrations (
    step SERIAL PRIMARY KEY,
    migration_id VARCHAR(100) NOT NULL,
    FOREIGN KEY(migration_status)
        REFERENCES migration_statuses(id) NOT NULL,
    step_timestamp TIMESTAMP NOT NULL,
    message TEXT
)
