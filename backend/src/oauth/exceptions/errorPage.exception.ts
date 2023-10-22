export class ErrorPageException extends Error {
  /**
   * Exception for redirecting to error page (all i18n key should omit `error.msg` and `error.param` prefix)
   * @param key i18n key of message
   * @param redirect redirect url
   * @param params message params (key)
   */
  constructor(
    public readonly key: string = "default",
    public readonly redirect: string = "/",
    public readonly params?: string[],
  ) {
    super("error");
  }
}
