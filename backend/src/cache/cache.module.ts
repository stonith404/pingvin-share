import { Module } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { CacheableMemory } from "cacheable";
import { createKeyv } from "@keyv/redis";
import { Keyv } from "keyv";
import { ConfigModule } from "src/config/config.module";
import { ConfigService } from "src/config/config.service";

@Module({
  imports: [
    ConfigModule,
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const useRedis = configService.get("cache.redis-enabled");
        const ttl = configService.get("cache.ttl");
        const max = configService.get("cache.maxItems");

        let config = {
          ttl,
          max,
          stores: [],
        };

        if (useRedis) {
          const redisUrl = configService.get("cache.redis-url");
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
