from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('userprofile', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            state_operations=[],
            database_operations=[
                migrations.RunSQL(
                    sql="""
                    DO $$
                    BEGIN
                        IF EXISTS (
                            SELECT 1 FROM information_schema.tables
                            WHERE table_name = 'userprofile_academicprofile'
                        ) AND NOT EXISTS (
                            SELECT 1 FROM information_schema.tables
                            WHERE table_name = 'userprofile_userprofile'
                        ) THEN
                            ALTER TABLE userprofile_academicprofile RENAME TO userprofile_userprofile;
                        END IF;
                    END $$;

                    ALTER TABLE userprofile_userprofile
                        ADD COLUMN IF NOT EXISTS education_level varchar(40) NOT NULL DEFAULT '';
                    ALTER TABLE userprofile_userprofile
                        ADD COLUMN IF NOT EXISTS background varchar(40) NOT NULL DEFAULT '';
                    ALTER TABLE userprofile_userprofile
                        ADD COLUMN IF NOT EXISTS marks jsonb NOT NULL DEFAULT '{}'::jsonb;
                    ALTER TABLE userprofile_userprofile
                        ADD COLUMN IF NOT EXISTS profile_completed boolean NOT NULL DEFAULT false;
                    ALTER TABLE userprofile_userprofile
                        ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT NOW();
                    ALTER TABLE userprofile_userprofile
                        ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT NOW();

                    DO $$
                    BEGIN
                        IF EXISTS (
                            SELECT 1 FROM information_schema.columns
                            WHERE table_name = 'userprofile_userprofile' AND column_name = 'level'
                        ) THEN
                            UPDATE userprofile_userprofile
                            SET education_level = COALESCE(NULLIF(education_level, ''), level);
                        END IF;
                    END $$;

                    ALTER TABLE userprofile_userprofile DROP COLUMN IF EXISTS marksheet;
                    ALTER TABLE userprofile_userprofile DROP COLUMN IF EXISTS level;
                    """,
                    reverse_sql=migrations.RunSQL.noop,
                ),
                migrations.RunSQL(
                    sql="""
                    CREATE TABLE IF NOT EXISTS userprofile_userassessment (
                        id bigserial PRIMARY KEY,
                        answers jsonb NOT NULL DEFAULT '{}'::jsonb,
                        is_completed boolean NOT NULL DEFAULT false,
                        created_at timestamptz NOT NULL DEFAULT NOW(),
                        updated_at timestamptz NOT NULL DEFAULT NOW(),
                        user_id bigint NOT NULL UNIQUE REFERENCES users_user(id) DEFERRABLE INITIALLY DEFERRED
                    );
                    """,
                    reverse_sql=migrations.RunSQL.noop,
                ),
            ],
        ),
    ]
