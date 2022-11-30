BEGIN;

DO
$do$
BEGIN
IF NOT EXISTS (SELECT from public.migrations WHERE migration_name = '02-add-spacex-table')
THEN

CREATE SCHEMA spacex
    AUTHORIZATION admin;

CREATE TABLE spacex.starlinks
(
    id serial NOT NULL,
    value jsonb NOT NULL,
    deleted_at date,
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS spacex.starlinks
    OWNER to admin;

INSERT INTO public.migrations (executed_at, migration_name) VALUES (CURRENT_TIMESTAMP, '02-add-spacex-table');

END IF;
    
END
$do$; 

COMMIT;