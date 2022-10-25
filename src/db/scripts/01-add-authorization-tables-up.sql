BEGIN;

DO
$do$
BEGIN
IF NOT EXISTS (SELECT from public.migrations WHERE migration_name = '01-add-authorization-tables')
THEN

CREATE SCHEMA auth
    AUTHORIZATION admin;

CREATE TABLE auth.user_roles
(
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS auth.user_roles
    OWNER to admin;

INSERT INTO auth.user_roles (id, name) VALUES (1, 'User'), (2, 'Admin');

CREATE TABLE auth.users
(
    id serial NOT NULL,
    user_name character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role integer NOT NULL,
    deleted_on date NULL,
    PRIMARY KEY (id),
    CONSTRAINT "email-unique" UNIQUE (user_name)
);

ALTER TABLE IF EXISTS auth.users
    OWNER to admin;

-- password is hash generated from 'password' string
INSERT INTO auth.users (user_name, password, role, deleted_on) VALUES 
('admin@admin.pl', '$2b$11$KHikE.0YIkPQgjhdtqedEOGyjn9Wz2JPzYn7.GyGs0VOTggNOAI4q', 2, NULL),
('user@admin.pl', '$2b$11$KHikE.0YIkPQgjhdtqedEOGyjn9Wz2JPzYn7.GyGs0VOTggNOAI4q', 1, NULL), 
('deletedUser@admin.pl', '$2b$11$KHikE.0YIkPQgjhdtqedEOGyjn9Wz2JPzYn7.GyGs0VOTggNOAI4q', 1, NOW());

CREATE TABLE auth.activerefreshtokens
(
    id serial NOT NULL,
    user_id integer NOT NULL,
    value character varying(255) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT "user-activerefreshtokens-reference" FOREIGN KEY (user_id)
        REFERENCES auth.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

ALTER TABLE IF EXISTS auth.activerefreshtokens
    OWNER to admin;

CREATE TABLE auth.inactiverefreshtokens
(
    id serial NOT NULL,
    user_id integer NOT NULL,
    value character varying(255) NOT NULL,
    deleted_at date NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT "user-inactiverefreshtokens-reference" FOREIGN KEY (user_id)
        REFERENCES auth.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

ALTER TABLE IF EXISTS auth.inactiverefreshtokens
    OWNER to admin;

INSERT INTO public.migrations (executed_at, migration_name) VALUES (CURRENT_TIMESTAMP, '01-add-authorization-tables');

END IF;
    
END
$do$; 

COMMIT;