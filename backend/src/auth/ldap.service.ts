import { Inject, Injectable, Logger } from "@nestjs/common";
import { inspect } from "node:util";
import { ConfigService } from "../config/config.service";
import { Client, Entry, InvalidCredentialsError } from "ldapts";

@Injectable()
export class LdapService {
  private readonly logger = new Logger(LdapService.name);
  constructor(
    @Inject(ConfigService)
    private readonly serviceConfig: ConfigService,
  ) { }

  private async createLdapConnection(): Promise<Client> {
    const ldapUrl = this.serviceConfig.get("ldap.url");
    if (!ldapUrl) {
      throw new Error("LDAP server URL is not defined");
    }

    const ldapClient = new Client({
      url: ldapUrl,
      timeout: 15_000,
      connectTimeout: 15_000,
    });

    const bindDn = this.serviceConfig.get("ldap.bindDn") || null;
    if (bindDn) {
      try {
        await ldapClient.bind(bindDn, this.serviceConfig.get("ldap.bindPassword"));
      } catch (error) {
        this.logger.warn(`Failed to bind to default user: ${error}`);
        throw new Error("failed to bind to default user");
      }
    }

    return ldapClient;
  }

  public async authenticateUser(
    username: string,
    password: string,
  ): Promise<Entry | null> {
    if (!username.match(/^[a-zA-Z0-9-_.@]+$/)) {
      this.logger.verbose(`Username ${username} does not match username pattern. Authentication failed.`);
      return null;
    }

    const searchBase = this.serviceConfig.get("ldap.searchBase");
    const searchQuery = this.serviceConfig
      .get("ldap.searchQuery")
      .replaceAll("%username%", username);

    const ldapClient = await this.createLdapConnection();
    try {
      const { searchEntries } = await ldapClient.search(searchBase, {
        filter: searchQuery,
        scope: "sub",

        attributes: ["*"],
        returnAttributeValues: true
      });

      if (searchEntries.length > 1) {
        /* too many users found */
        this.logger.verbose(`Authentication for username ${username} failed. Too many users found with query ${searchQuery}`);
        return null;
      } else if (searchEntries.length == 0) {
        /* user not found */
        this.logger.verbose(`Authentication for username ${username} failed. No user found with query ${searchQuery}`);
        return null;
      }

      const targetEntity = searchEntries[0];
      this.logger.verbose(`Trying to authenticate ${username} against LDAP user ${targetEntity.dn}`);
      try {
        await ldapClient.bind(targetEntity.dn, password);
        return targetEntity;
      } catch (error) {
        if (error instanceof InvalidCredentialsError) {
          this.logger.verbose(`Failed to authenticate ${username} against ${targetEntity.dn}. Invalid credentials.`);
          return null;
        }

        this.logger.warn(`User bind failure: ${inspect(error)}`);
        return null;
      }
    } catch (error) {
      this.logger.warn(`Connect error: ${inspect(error)}`);
      return null;
    }
  }
}
