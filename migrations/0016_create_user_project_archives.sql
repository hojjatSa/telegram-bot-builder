-- Личный архив проектов: каждый пользователь скрывает проект только у себя

CREATE TABLE IF NOT EXISTS user_project_archives (
  user_id BIGINT NOT NULL REFERENCES telegram_users(id) ON DELETE CASCADE,
  project_id INTEGER NOT NULL REFERENCES bot_projects(id) ON DELETE CASCADE,
  archived_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, project_id)
);

CREATE INDEX IF NOT EXISTS idx_user_project_archives_user
  ON user_project_archives(user_id);

CREATE INDEX IF NOT EXISTS idx_user_project_archives_project
  ON user_project_archives(project_id);
