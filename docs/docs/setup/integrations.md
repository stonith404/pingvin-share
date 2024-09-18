---
id: integrations
---

# Integrations

#### ClamAV

> **_NOTE:_** Currently ClamAV is only available in the Docker installation.

ClamAV is used to scan shares for malicious files and remove them if found.

1. Add the ClamAV container to the Docker Compose stack and start the container.

```diff
services:
  pingvin-share:
    image: stonith404/pingvin-share
    ...
+   depends_on:
+     clamav:
+       condition: service_healthy

+  clamav:
+    restart: unless-stopped
+    image: clamav/clamav

```

2. Docker will wait for ClamAV to start before starting Pingvin Share. This may take a minute or two.
3. The Pingvin Share logs should now log "ClamAV is active"

Please note that ClamAV needs a lot of [ressources](https://docs.clamav.net/manual/Installing/Docker.html#memory-ram-requirements).
