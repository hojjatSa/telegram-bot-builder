# user_project_archives

## user_project_archives

Личный архив проектов: каждый пользователь может скрыть проект только у себя.

### Columns

| Name | Type | Default | Nullable | Children | Parents | Comment |
|------|------|---------|----------|----------|---------|---------|
| user_id | bigint | - | NO | - | [telegram_users.id](./telegram_users.md) | Идентификатор пользователя (ссылка на telegram_users.id) |
| project_id | integer | - | NO | - | [bot_projects.id](./bot_projects.md) | Идентификатор проекта (ссылка на bot_projects.id) |
| archived_at | timestamp | `now()` | NO | - | - | Дата архивации проекта для пользователя |

### Constraints

| Name | Type | Definition |
|------|------|------------|
| pk_user_id_project_id | PRIMARY KEY | (user_id, project_id) |
| fk_user_id_telegram_users | FOREIGN KEY | (user_id) → telegram_users(id) |
| fk_project_id_bot_projects | FOREIGN KEY | (project_id) → bot_projects(id) |

### Relations

| Parent | Child | Type |
|--------|-------|------|
| [telegram_users.id](./telegram_users.md) | **[user_project_archives.user_id](./user_project_archives.md)** | Many to One |
| [bot_projects.id](./bot_projects.md) | **[user_project_archives.project_id](./user_project_archives.md)** | Many to One |
