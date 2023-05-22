import { Test, TestingModule } from "@nestjs/testing";
import { CategoryService } from "./category.service";
import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { CategoryModule } from "./category.module";
import { ClientProxy, ClientsModule, Transport } from "@nestjs/microservices";
import { AppModule } from "../app.module";

describe("CATEGORY", () => {
  let app: INestApplication;
  let catServices: CategoryService;
  let client: ClientProxy;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
       AppModule,
        ClientsModule.register([
          { name: "CATEGORY", transport: Transport.TCP },
        ]),
      ],
    }).compile();

    // app = moduleFixture.createNestApplication();

    // await app.init();

    app = moduleFixture.createNestApplication();

    app.connectMicroservice({
      transport: Transport.TCP,
    });

    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.startAllMicroservices();
    await app.init();

    client = app.get("CATEGORY");
    await client.connect();

    //   const response = await request(app.)
    //     .post('/auth/login')
    //     .send({ email: 'test@example.com', password: 'Test@123' });
    //   jwtToken = response.body.data.access_token;
    //   email = response.body.data.email;
  });

  afterAll(async () => {
    // await request(app.getHttpServer()).get('/auth/logout').set('authorization', `${jwtToken}`);
    // await Promise.all([app.close()]);

    await app.close();
    client.close();
    console.log("afterAll");
  });

  describe("Category-Module", () => {
    describe("UserLogin", () => {
      it("Auth Login / (POST)", async () => {
        try {
          const response = await client
            .send("category_create", {
              name: "",
              parent_category_id: "",
            })
            .toPromise();

          // console.log('response', response, typeof response)
          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        } catch (err) {
          // console.log('err', err, typeof err)
          expect(err.statusCode).toBe(HttpStatus.BAD_REQUEST);
        }
      });

      it("Auth Login / (POST) with wrong credentials", async () => {
        try {
          const response = await client
            .send("category_create", {
              name: ""            
            })
            .toPromise();

          // console.log('response', response, typeof response)
          expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
        } catch (err) {
          // console.log('err', err, typeof err)
          expect(err.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
        }
      });
    });
  });
});
