import * as crypto from "crypto";

const configVariables = [
  {
    key: "setupFinished",
    description: "Whether the setup has been finished",
    type: "boolean",
    value: "false",
    secret: false,
    locked: true,
  },
  {
    key: "appUrl",
    description: "On which URL Pingvin Share is available",
    type: "string",
    value: "http://localhost:3000",
    secret: false,
  },
  {
    key: "showHomePage",
    description: "Whether to show the home page",
    type: "boolean",
    value: "true",
    secret: false,
  },
  {
    key: "allowRegistration",
    description: "Whether registration is allowed",
    type: "boolean",
    value: "true",
    secret: false,
  },
  {
    key: "allowUnauthenticatedShares",
    description: "Whether unauthorized users can create shares",
    type: "boolean",
    value: "false",
    secret: false,
  },
  {
    key: "maxFileSize",
    description: "Maximum file size in bytes",
    type: "number",
    value: "1000000000",
    secret: false,
  },
  {
    key: "jwtSecret",
    description: "Long random string used to sign JWT tokens",
    type: "string",
    value: crypto.randomBytes(256).toString("base64"),
    locked: true,
  },
  {
    key: "emailRecipientsEnabled",
    description:
      "Whether to send emails to recipients. Only set this to true if you entered the host, port, email and password of your SMTP server.",
    type: "boolean",
    value: "false",
    secret: false,
  },
  {
    key: "smtpHost",
    description: "Host of the SMTP server",
    type: "string",
    value: "",
  },
  {
    key: "smtpPort",
    description: "Port of the SMTP server",
    type: "number",
    value: "",
  },
  {
    key: "smtpEmail",
    description: "Email address of the SMTP server",
    type: "string",
    value: "",
  },
  {
    key: "smtpPassword",
    description: "Password of the SMTP server",
    type: "string",
    value: "",
  },
];

export default configVariables;
