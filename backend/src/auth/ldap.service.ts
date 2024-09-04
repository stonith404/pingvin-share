import { Inject, Injectable, Logger } from "@nestjs/common";
import * as ldap from "ldapjs";
import {
  AttributeJson,
  InvalidCredentialsError,
  SearchCallbackResponse,
  SearchOptions,
} from "ldapjs";
import { inspect } from "node:util";
import { ConfigService } from "../config/config.service";

type LdapSearchEntry = {
  objectName: string;
  attributes: AttributeJson[];
};

async function ldapExecuteSearch(
  client: ldap.Client,
  base: string,
  options: SearchOptions,
): Promise<LdapSearchEntry[]> {
  const searchResponse = await new Promise<SearchCallbackResponse>(
    (resolve, reject) => {
      client.search(base, options, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    },
  );

  return await new Promise<any[]>((resolve, reject) => {
    const entries: LdapSearchEntry[] = [];
    searchResponse.on("searchEntry", (entry) =>
      entries.push({
        attributes: entry.pojo.attributes,
        objectName: entry.pojo.objectName,
      }),
    );
    searchResponse.once("error", reject);
    searchResponse.once("end", () => resolve(entries));
  });
}

async function ldapBindUser(
  client: ldap.Client,
  dn: string,
  password: string,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    client.bind(dn, password, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

async function ldapCreateConnection(
  logger: Logger,
  url: string,
): Promise<ldap.Client> {
  const ldapClient = ldap.createClient({
    url: url.split(","),
    connectTimeout: 10_000,
    timeout: 10_000,
  });

  await new Promise((resolve, reject) => {
    ldapClient.once("error", reject);
    ldapClient.on("setupError", reject);
    ldapClient.on("socketTimeout", reject);
    ldapClient.on("connectRefused", () =>
      reject(new Error("connection has been refused")),
    );
    ldapClient.on("connectTimeout", () =>
      reject(new Error("connect timed out")),
    );
    ldapClient.on("connectError", reject);

    ldapClient.on("connect", resolve);
  }).catch((error) => {
    logger.error(`Connect error: ${inspect(error)}`);
    ldapClient.destroy();
    throw error;
  });

  return ldapClient;
}

export type LdapAuthenticateResult = {
  userDn: string;
  attributes: Record<string, string[]>;
};

@Injectable()
export class LdapService {
  private readonly logger = new Logger(LdapService.name);
  constructor(
    @Inject(ConfigService)
    private readonly serviceConfig: ConfigService,
  ) {}

  private async createLdapConnection(): Promise<ldap.Client> {
    const ldapUrl = this.serviceConfig.get("ldap.url");
    if (!ldapUrl) {
      throw new Error("LDAP server URL is not defined");
    }

    const ldapClient = await ldapCreateConnection(this.logger, ldapUrl);
    try {
      const bindDn = this.serviceConfig.get("ldap.bindDn") || null;
      if (bindDn) {
        try {
          await ldapBindUser(
            ldapClient,
            bindDn,
            this.serviceConfig.get("ldap.bindPassword"),
          );
        } catch (error) {
          this.logger.warn(`Failed to bind to default user: ${error}`);
          throw new Error("failed to bind to default user");
        }
      }

      return ldapClient;
    } catch (error) {
      ldapClient.destroy();
      throw error;
    }
  }

  public async authenticateUser(
    username: string,
    password: string,
  ): Promise<LdapAuthenticateResult | null> {
    if (!username.match(/^[a-zA-Z0-0]+$/)) {
      return null;
    }

    const searchBase = this.serviceConfig.get("ldap.searchBase");
    const searchQuery = this.serviceConfig
      .get("ldap.searchQuery")
      .replaceAll("%username%", username);

    const ldapClient = await this.createLdapConnection();
    try {
      const [result] = await ldapExecuteSearch(ldapClient, searchBase, {
        filter: searchQuery,
        scope: "sub",
      });

      if (!result) {
        /* user not found */
        return null;
      }

      try {
        await ldapBindUser(ldapClient, result.objectName, password);

        /*
         * In theory we could query the user attributes now,
         * but as we must query the user attributes for validation anyways
         * we'll create a second ldap server connection.
         */
        return {
          userDn: result.objectName,
          attributes: Object.fromEntries(
            result.attributes.map((attribute) => [
              attribute.type,
              attribute.values,
            ]),
          ),
        };
      } catch (error) {
        if (error instanceof InvalidCredentialsError) {
          return null;
        }

        this.logger.warn(`LDAP user bind failure: ${inspect(error)}`);
        return null;
      } finally {
        ldapClient.destroy();
      }
    } catch (error) {
      this.logger.warn(`LDAP connect error: ${inspect(error)}`);
      return null;
    }
  }
}
