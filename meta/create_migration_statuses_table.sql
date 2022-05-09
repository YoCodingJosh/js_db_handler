CREATE TABLE migration_statuses (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20) NOT NULL,
    description TEXT NOT NULL
)
