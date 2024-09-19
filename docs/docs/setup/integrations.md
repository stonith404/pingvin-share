---
id: integrations
---

# Integrations

## ClamAV

ClamAV is used to scan shares for malicious files and remove them if found.

Please note that ClamAV needs a lot of [ressources](https://docs.clamav.net/manual/Installing/Docker.html#memory-ram-requirements).

### Docker

If you are already running ClamAV elsewhere, you can specify the `CLAMAV_HOST` environment variable to point to that instance.

Else you have to add the ClamAV container to the Pingvin Share Docker Compose stack:

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

### Stand-Alone

1. Install ClamAV
2. Specify the `CLAMAV_HOST` environment variable for the backend and restart the Pingvin Share backend.
