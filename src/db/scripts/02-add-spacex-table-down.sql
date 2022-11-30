BEGIN;
DROP TABLE IF EXISTS spacex.starlinks;
DROP SCHEMA IF EXISTS spacex;

DELETE FROM public.migrations WHERE migration_name = '02-add-spacex-table';
COMMIT;