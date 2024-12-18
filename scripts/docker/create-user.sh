# If we aren't running as root, just exec the CMD
[ "$(id -u)" -ne 0 ] && exec "$@"

echo "Creating user and group..."

PUID=${PUID:-1000}
PGID=${PGID:-1000}

# Check if the group with PGID exists; if not, create it
if ! getent group pingvin-share-group > /dev/null 2>&1; then
    addgroup -g "$PGID" pingvin-share-group
fi

# Check if a user with PUID exists; if not, create it
if ! id -u pingvin-share > /dev/null 2>&1; then
    if ! getent passwd "$PUID" > /dev/null 2>&1; then
        adduser -u "$PUID" -G pingvin-share-group pingvin-share > /dev/null 2>&1
    else
        # If a user with the PUID already exists, use that user
        existing_user=$(getent passwd "$PUID" | cut -d: -f1)
        echo "Using existing user: $existing_user"
    fi
fi

# Change ownership of the data directory
mkdir -p /opt/app/backend/data
find /opt/app/backend/data \( ! -group "${PGID}" -o ! -user "${PUID}" \) -exec chown "${PUID}:${PGID}" {} +

# Switch to the non-root user
exec su-exec "$PUID:$PGID" "$@"