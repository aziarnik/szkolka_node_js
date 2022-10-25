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
        executed_at date NOT NULL,
        id serial NOT NULL,
        migration_name character varying(100) NOT NULL,
        PRIMARY KEY (id),
        CONSTRAINT "Migration_Name_Unique" UNIQUE (migration_name)
    );
	
	ALTER TABLE IF EXISTS public.migrations
        OWNER to admin;

    CREATE TABLE IF NOT EXISTS public.events
    (
        id serial NOT NULL,
        event_type character varying(255) NOT NULL,
        event_body json NOT NULL,
        PRIMARY KEY (id)
    );

    ALTER TABLE IF EXISTS public.events
        OWNER to admin;
    
    CREATE INDEX event_type_index
    ON public.events USING btree
    (event_type varchar_ops ASC NULLS LAST);

	END IF;
END
$do$;

COMMIT;