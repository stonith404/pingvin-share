import { Global, Module } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CacheableMemory } from "cacheable";
import { createKeyv } from "@keyv/redis";
import { Keyv } from "keyv";

@Global()
@Module({
  imports: [
    ConfigModule,
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const useRedis = configService.get<boolean>("cache.redis-enabled");
        const ttl = configService.get<number>("cache.ttl");
        const max = configService.get<number>("cache.maxItems");

        let config = {
          ttl,
          max,
          stores: [],
        };

        if (useRedis) {
          const redisUrl = configService.get<string>("cache.redis-url");
          config.stores = [
            new Keyv({ store: new CacheableMemory({ ttl, lruSize: 5000 }) }),
            createKeyv(redisUrl),
          ];
        }

        return config;
      },
    }),
  ],
  exports: [CacheModule],
})
export class AppCacheModule {}
