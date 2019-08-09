import { Module, CacheModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';

import { GraphqlService } from '@leaa/api/modules/graphql/graphql.service';
import { TypeormService } from '@leaa/api/modules/typeorm/typeorm.service';

import { ConfigModule } from '@leaa/api/modules/config/config.module';
import { SeedModule } from '@leaa/api/modules/seed/seed.module';
import { PlaygroundModule } from '@leaa/api/modules/playground/playground.module';
import { IndexModule } from '@leaa/api/modules/index/index.module';
//
import { AxModule } from '@leaa/api/modules/ax/ax.module';
import { UserModule } from '@leaa/api/modules/user/user.module';
import { AuthModule } from '@leaa/api/modules/auth/auth.module';
import { RoleModule } from '@leaa/api/modules/role/role.module';
import { CategoryModule } from '@leaa/api/modules/category/category.module';
import { ArticleModule } from '@leaa/api/modules/article/article.module';
import { AuthTokenModule } from '@leaa/api/modules/auth-token/auth-token.module';
import { AttachmentModule } from '@leaa/api/modules/attachment/attachment.module';
import { PermissionModule } from '@leaa/api/modules/permission/permission.module';
import { SettingModule } from '@leaa/api/modules/setting/setting.module';

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forRootAsync({
      useClass: TypeormService,
    }),
    GraphQLModule.forRootAsync({
      imports: [AuthModule],
      useClass: GraphqlService,
    }),
    ConfigModule,
    SeedModule,
    PlaygroundModule,
    IndexModule,
    //
    AuthModule,
    UserModule,
    PermissionModule,
    RoleModule,
    CategoryModule,
    ArticleModule,
    AttachmentModule,
    AxModule,
    AuthTokenModule,
    SettingModule,
  ],
  providers: [ConfigModule, AuthModule, UserModule],
  controllers: [],
})
export class AppModule {}
