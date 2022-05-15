CREATE TABLE migration_statuses (
    migration_status_id SERIAL PRIMARY KEY,
    status VARCHAR(20) NOT NULL,
    description TEXT NOT NULL
)
