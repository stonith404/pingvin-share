-- This is an empty migration.
INSERT INTO Config ("category", "name" , "locked", "obscured", "order", "secret", "type", "defaultValue", "value", "updatedAt")
VALUES ('share', 'autoOpenShareModal', false, false, 6, false, 'boolean', "true", NULL, CURRENT_TIMESTAMP);
