CREATE TABLE migrations (
    step_id SERIAL PRIMARY KEY,
    migration_id VARCHAR(100) NOT NULL,
    migration_status_id INTEGER REFERENCES migration_statuses,
    step_timestamp TIMESTAMP NOT NULL,
    message TEXT
)
