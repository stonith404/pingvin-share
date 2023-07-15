export const german = {
  // Navbar
  "navbar.upload": "Hochladen",
  "navbar.signin": "Anmelden",
  "navbar.home": "Startseite",
  "navbar.signup": "Registrieren",

  "navbar.links.shares": "Meine Freigaben",
  "navbar.links.reverse": "Umgekehrte Freigaben",

  "navbar.avatar.account": "Mein Konto",
  "navbar.avatar.admin": "Verwaltung",
  "navbar.avatar.signout": "Abmelden",
  // END Navbar

  // /
  "home.title": "Eine <h> selbst gehostete </h> Plattform zur Dateifreigabe.",
  "home.title.a": "Eine",
  "home.title.b": "selbst gehostete",
  "home.title.c": "Plattform zur Dateifreigabe.",

  "home.description":
    "Möchten Sie Ihre persönlichen Dateien wirklich in die Hände Dritter wie WeTransfer geben?",
  "home.bullet.a.name": "Selbst gehostet",
  "home.bullet.a.description":
    "Hosten Sie Pingvin Share auf Ihrer eigenen Maschine.",
  "home.bullet.b.name": "Datenschutz",
  "home.bullet.b.description":
    "Ihre Dateien sind Ihre Dateien und sollten niemals in die Hände Dritter gelangen.",
  "home.bullet.c.name": "Keine lästige Dateigrößenbeschränkung",
  "home.bullet.c.description":
    "Laden Sie so große Dateien hoch, wie Sie möchten. Nur Ihre Festplatte ist Ihre Begrenzung.",

  "home.button.start": "Loslegen",
  "home.button.source": "Quellcode",
  // END /

  // /account
  "account.title": "Mein Konto",

  "account.card.info.title": "Kontoinformationen",
  "account.card.info.username": "Benutzername",
  "account.card.info.email": "E-Mail",

  "account.card.password.title": "Passwort",
  "account.card.password.old": "Altes Passwort",
  "account.card.password.new": "Neues Passwort",
  "account.notify.password.success": "Passwort erfolgreich geändert",

  // TODO: Add translations for disable totp
  "account.card.security.title": "Sicherheit",
  "account.card.security.totp.enable.description":
    "Geben Sie Ihr aktuelles Passwort ein, um TOTP zu aktivieren",
  "account.card.security.totp.button.start": "Start",
  "account.modal.totp.title": "TOTP aktivieren",
  "account.modal.totp.step1": "Schritt 1: Fügen Sie Ihren Authenticator hinzu",
  "account.modal.totp.step2": "Schritt 2: Überprüfen Sie Ihren Code",
  "common.text.or": "ODER",
  "account.modal.totp.enterManually": "Manuell eingeben",
  "account.modal.totp.code": "Code",
  "account.modal.totp.clickToCopy": "Klicken zum Kopieren",
  "account.modal.totp.verify": "Überprüfen",
  "account.notify.totp.disable": "TOTP erfolgreich deaktiviert",

  "account.card.color.title": "Farbschema",

  // ThemeSwitcher.tsx
  "account.theme.dark": "Dunkel",
  "account.theme.light": "Hell",
  "account.theme.system": "System",

  "account.button.delete": "Konto löschen",
  // END /account

  // /account/shares
  "account.shares.title": "Meine Freigaben",
  "account.shares.title.empty": "Hier ist es leer 👀",
  "account.shares.description.empty": "Sie haben keine Freigaben.",
  "account.shares.button.create": "Erstellen",

  "account.shares.table.id": "ID",
  "account.shares.table.name": "Name",
  "account.shares.table.description": "Beschreibung",
  "account.shares.table.visitors": "Besucher",
  "account.shares.table.expiresAt": "Läuft ab",
  "account.shares.table.createdAt": "Erstellt am",
  "account.shares.table.size": "Größe",
  "account.shares.delete.confirm":
    "Möchten Sie diese Freigabe wirklich löschen?",

  // END /account/shares

  // /account/reverseShares
  "account.reverseShares.title": "Umgekehrte Freigaben",
  "account.reverseShares.description":
    "Eine umgekehrte Freigabe ermöglicht es Ihnen, eine eindeutige URL zu generieren, über die externe Benutzer eine Freigabe erstellen können.",

  "account.reverseShares.title.empty": "Hier ist es leer 👀",
  "account.reverseShares.description.empty":
    "Sie haben keine umgekehrten Freigaben.",

  // showCreateReverseShareModal.tsx
  "account.reverseShares.modal.expiration.label": "Ablaufzeit",
  "account.reverseShares.modal.expiration.minute-singular": "Minute",
  "account.reverseShares.modal.expiration.minute-plural": "Minuten",
  "account.reverseShares.modal.expiration.hour-singular": "Stunde",
  "account.reverseShares.modal.expiration.hour-plural": "Stunden",
  "account.reverseShares.modal.expiration.day-singular": "Tag",
  "account.reverseShares.modal.expiration.day-plural": "Tage",
  "account.reverseShares.modal.expiration.week-singular": "Woche",
  "account.reverseShares.modal.expiration.week-plural": "Wochen",
  "account.reverseShares.modal.expiration.month-singular": "Monat",
  "account.reverseShares.modal.expiration.month-plural": "Monate",
  "account.reverseShares.modal.expiration.year-singular": "Jahr",
  "account.reverseShares.modal.expiration.year-plural": "Jahre",

  "account.reverseShares.modal.max-size.label": "Maximale Freigabegröße",

  "account.reverseShares.modal.send-email": "E-Mail-Benachrichtigung senden",
  "account.reverseShares.modal.send-email.description":
    "Senden Sie eine E-Mail-Benachrichtigung, wenn eine Freigabe mit diesem umgekehrten Freigabelink erstellt wird.",

  "account.reverseShares.modal.max-use.label":
    "Maximale Anzahl von Verwendungen",
  "account.reverseShares.modal.max-use.description":
    "Die maximale Anzahl von Malen, die diese URL zur Erstellung einer Freigabe verwendet werden kann.",

  "account.reverseShares.table.no-shares": "Bisher keine Freigaben erstellt",
  "account.reverseShares.table.count.singular": "Freigabe",
  "account.reverseShares.table.count.plural": "Freigaben",
  "account.reverseShares.table.shares": "Freigaben",
  "account.reverseShares.table.remaining": "Verbleibende Verwendungen",
  "account.reverseShares.table.max-size": "Maximale Freigabegröße",
  "account.reverseShares.table.expires": "läuft ab am",

  "account.reverseShares.delete.confirm":
    "Möchten Sie diese umgekehrte Freigabe wirklich löschen? Wenn Sie dies tun, werden auch die zugehörigen Freigaben gelöscht.",

  // END /account/reverseShares

  // /admin
  "admin.title": "Verwaltung",
  "admin.button.users": "Benutzerverwaltung",
  "admin.button.config": "Konfiguration",
  "admin.version": "Version",
  // END /admin

  // /admin/users
  "admin.users.title": "Benutzerverwaltung",
  "admin.users.table.username": "Benutzername",
  "admin.users.table.email": "E-Mail",
  "admin.users.table.admin": "Administrator",

  "admin.users.edit.update.title": "Aktualisieren",
  "admin.users.edit.update.admin-privileges": "Administratorrechte",
  "admin.users.edit.update.change-password.title": "Passwort ändern",
  "admin.users.edit.update.change-password.field": "Neues Passwort",
  "admin.users.edit.update.change-password.button": "Neues Passwort speichern",
  "admin.users.edit.update.notify.password.success":
    "Passwort erfolgreich geändert",

  "admin.users.edit.delete.title": "Löschen",
  "admin.users.edit.delete.description":
    "Möchten Sie {username} und alle ihre Freigaben wirklich löschen?",

  // showCreateUserModal.tsx
  "admin.users.modal.create.title": "Benutzer erstellen",
  "admin.users.modal.create.username": "Benutzername",
  "admin.users.modal.create.email": "E-Mail",
  "admin.users.modal.create.password": "Passwort",
  "admin.users.modal.create.manual-password": "Passwort manuell festlegen",
  "admin.users.modal.create.manual-password.description":
    "Wenn nicht markiert, erhält der Benutzer eine E-Mail mit einem Link, um sein Passwort festzulegen.",
  "admin.users.modal.create.admin": "Administratorrechte",
  "admin.users.modal.create.admin.description":
    "Wenn markiert, hat der Benutzer Zugriff auf das Admin-Panel.",

  // END /admin/users

  // /upload
  // /upload
  "upload.title": "Hochladen",

  "upload.notify.generic-error":
    "Es ist ein Fehler aufgetreten beim Abschließen Ihrer Freigabe.",
  "upload.notify.count-failed":
    "{count} Dateien konnten nicht hochgeladen werden. Wird erneut versucht.",

  // Dropzone.tsx
  "upload.dropzone.title": "Dateien hochladen",
  "upload.dropzone.description":
    "Ziehen Sie Dateien hierher, um Ihre Freigabe zu starten. Wir akzeptieren nur Dateien, die insgesamt weniger als {maxSize} groß sind.",
  "upload.dropzone.notify.file-too-big":
    "Ihre Dateien überschreiten die maximale Freigabegröße von {maxSize}.",

  // FileList.tsx
  "upload.filelist.name": "Name",
  "upload.filelist.size": "Größe",

  // showCreateUploadModal.tsx
  "upload.modal.title": "Freigabe erstellen",
  "upload.modal.link.error.invalid":
    "Kann nur Buchstaben, Zahlen, Unterstriche und Bindestriche enthalten",
  "upload.modal.link.error.taken": "Dieser Link wird bereits verwendet",
  "upload.modal.not-signed-in": "Sie sind nicht angemeldet",
  "upload.modal.not-signed-in-description":
    "Sie können Ihre Freigabe nicht manuell löschen und die Besucherzahl anzeigen.",

  "upload.modal.expires.never": "nie",
  "upload.modal.expires.never-long": "Nie",

  "upload.modal.link.label": "Link",
  "upload.modal.link.placeholder": "meineTolleFreigabe",

  "upload.modal.expires.label": "Ablaufzeit",
  "upload.modal.expires.minute-singular": "Minute",
  "upload.modal.expires.minute-plural": "Minuten",
  "upload.modal.expires.hour-singular": "Stunde",
  "upload.modal.expires.hour-plural": "Stunden",
  "upload.modal.expires.day-singular": "Tag",
  "upload.modal.expires.day-plural": "Tage",
  "upload.modal.expires.week-singular": "Woche",
  "upload.modal.expires.week-plural": "Wochen",
  "upload.modal.expires.month-singular": "Monat",
  "upload.modal.expires.month-plural": "Monate",
  "upload.modal.expires.year-singular": "Jahr",
  "upload.modal.expires.year-plural": "Jahre",

  "upload.modal.accordion.description.title": "Beschreibung",
  "upload.modal.accordion.description.placeholder":
    "Hinweis für die Empfänger dieser Freigabe",

  "upload.modal.accordion.email.title": "E-Mail-Empfänger",
  "upload.modal.accordion.email.placeholder": "E-Mail-Empfänger eingeben",
  "upload.modal.accordion.email.invalid-email": "Ungültige E-Mail-Adresse",

  "upload.modal.accordion.security.title": "Sicherheitsoptionen",
  "upload.modal.accordion.security.password.label": "Passwortschutz",
  "upload.modal.accordion.security.password.placeholder": "Kein Passwort",
  "upload.modal.accordion.security.max-views.label":
    "Maximale Anzahl von Ansichten",
  "upload.modal.accordion.security.max-views.placeholder": "Keine Begrenzung",

  // showCompletedUploadModal.tsx
  "upload.modal.completed.never-expires": "Diese Freigabe verfällt nie.",
  "upload.modal.completed.expires-on":
    "Diese Freigabe läuft am {expiration} ab.",
  "upload.modal.completed.share-ready": "Ihre Freigabe ist bereit!",

  // END /upload

  // Allgemeine Übersetzungen
  "common.button.save": "Speichern",
  "common.button.create": "Erstellen",
  "common.button.delete": "Löschen",
  "common.button.cancel": "Abbrechen",
  "common.button.confirm": "Bestätigen",
  "common.button.share": "Teilen",
  "common.button.generate": "Generieren",
  "common.button.done": "Fertig",
  "common.notify.copied": "Ihr Link wurde in die Zwischenablage kopiert",
  "common.expiration.never-expires": "Diese {entity} verfällt nie.",
  "common.expiration.expires-on": "Diese {entity} läuft am {expiration} ab.",
};
