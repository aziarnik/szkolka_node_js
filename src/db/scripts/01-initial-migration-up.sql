BEGIN;

DO
$do$
BEGIN
IF NOT EXISTS (
    SELECT FROM 
        pg_tables
    WHERE 
        schemaname = 'public' AND 
        tablename  = 'Migrations'
    )
	THEN 
	CREATE TABLE IF NOT EXISTS public."Migrations"
    (
        "ExecutedAt" date NOT NULL,
        "Id" serial NOT NULL,
        "Name" character varying(100) NOT NULL,
        PRIMARY KEY ("Id"),
        CONSTRAINT "Migration_Name_Unique" UNIQUE ("Name")
    )
	
	TABLESPACE pg_default;
	
	ALTER TABLE IF EXISTS public."Migrations"
        OWNER to db_admin;
		
	CREATE TABLE public."FakeTable"
    (
        "Id" serial NOT NULL,
        "Fake" character varying(100) NOT NULL,
        PRIMARY KEY ("Id")
    );
	ALTER TABLE IF EXISTS public."FakeTable"
    OWNER to db_admin;
	
	INSERT INTO public."Migrations" ("ExecutedAt", "Name") VALUES (CURRENT_TIMESTAMP, '01-initial-migration');
	END IF;
END
$do$;

COMMIT;