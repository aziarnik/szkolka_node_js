BEGIN;
DROP TABLE IF EXISTS auth.inactiverefreshtokens;
DROP TABLE IF EXISTS auth.activerefreshtokens;
DROP TABLE IF EXISTS auth.user_roles;
DROP TABLE IF EXISTS auth.users;
DROP SCHEMA IF EXISTS auth;

DELETE FROM public.migrations WHERE migrationName = '01-add-authorization-tables';
COMMIT;