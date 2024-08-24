---
id: integrations
---

# Integrations

#### ClamAV (Docker only)

ClamAV is used to scan shares for malicious files and remove them if found.

1. Add the ClamAV container to the Docker Compose stack (see `docker-compose.yml`) and start the container.
2. Docker will wait for ClamAV to start before starting Pingvin Share. This may take a minute or two.
3. The Pingvin Share logs should now log "ClamAV is active"

Please note that ClamAV needs a lot of [ressources](https://docs.clamav.net/manual/Installing/Docker.html#memory-ram-requirements).
