import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  /*===========================================#
  |  Coisas para que o LiveReload funcione bem |
  #===========================================*/

  async onModuleInit() {
    // força conexão com banco de dados
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    // quando perder conexão com banco de dados ele fecha a conexão
    this.$on('beforeExit' as never, async () => {
      await app.close();
    });
  }
}
