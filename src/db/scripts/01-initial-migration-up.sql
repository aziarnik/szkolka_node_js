BEGIN;

DO
$do$
BEGIN
IF NOT EXISTS (
    SELECT FROM 
        pg_tables
    WHERE 
        schemaname = 'public' AND 
        tablename  = 'migrations'
    )
	THEN 
	CREATE TABLE IF NOT EXISTS public.migrations
    (
        executedAt date NOT NULL,
        id serial NOT NULL,
        migrationName character varying(100) NOT NULL,
        PRIMARY KEY (id),
        CONSTRAINT "Migration_Name_Unique" UNIQUE (migrationName)
    )
	
	TABLESPACE pg_default;
	
	ALTER TABLE IF EXISTS public.migrations
        OWNER to db_admin;
		
	CREATE TABLE public.fake
    (
        id serial NOT NULL,
        fake character varying(100) NOT NULL,
        PRIMARY KEY (id)
    );
	ALTER TABLE IF EXISTS public.fakeTable
    OWNER to db_admin;
	
	INSERT INTO public.migrations (executedAt, migrationName) VALUES (CURRENT_TIMESTAMP, '01-initial-migration');
	END IF;
END
$do$;

COMMIT;