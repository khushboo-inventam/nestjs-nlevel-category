import { Test, TestingModule } from "@nestjs/testing";
import { CategoryService } from "./category.service";
import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { ClientProxy, ClientsModule, Transport } from "@nestjs/microservices";
import { AppModule } from "../app.module";

describe("CATEGORY", () => {
  let app: INestApplication;
  let catServices: CategoryService;
  let client: ClientProxy;
  let trueData: boolean;
  let id: string;
  let detailed: boolean;

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
      it("Category / (POST)", async () => {
        try {
          const response = await client
            .send("category_create", {
              name: "",
              parent_category_id: ""
            })
            .toPromise();

          // console.log('response', response, typeof response)
          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        } catch (err) {
          // console.log('err', err, typeof err)
          expect(err.statusCode).toBe(HttpStatus.BAD_REQUEST);
        }
      });

      it("Category / (POST) without key", async () => {
        try {
          const response = await client.send("category_create", {}).toPromise();

          // console.log('response', response, typeof response)
          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        } catch (err) {
          // console.log('err', err, typeof err)
          expect(err.statusCode).toBe(HttpStatus.BAD_REQUEST);
        }
      });

      it("Category / (POST) with wrong parent_category_id", async () => {
        try {
          const response = await client
            .send("category_create", {
              name: "WER",
              parent_category_id: "15",
            })
            .toPromise();

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        } catch (err) {
          expect(err.statusCode).toBe(HttpStatus.BAD_REQUEST);
        }
      });

      it("Category / (POST) with blank data ", async () => {
        try {
          const response = await client
            .send("category_create", {

              parent_category_id: "555555555515",
            })
            .toPromise();

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        } catch (err) {
          expect(err.statusCode).toBe(HttpStatus.BAD_REQUEST);
        }
      });
      // it("Category / (GET) find category_search_by_category_id", async () => {
      //   try {
      //     const response = await client
      //       .send("category_search_by_category_id", +1)
      //       .toPromise();
      //     console.log('response.....***************.get  ', response.statusCode)
      //     expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
      //   } catch (err) {
      //     expect(err.statusCode).toBe(HttpStatus.NOT_FOUND);
      //   }
      // });
    });
  });

  //   describe('Get category', () => {
  //           it('/category (GET)', async () => {
  //             await request(app.getHttpServer()).get(`/category/${id}/`).expect(HttpStatus.UNAUTHORIZED);
  //           });
  //           it('/category (GET)', async () => {
  //             await request(app.getHttpServer())
  //               .get(`/category/${trueData}/`)
  //               .expect(HttpStatus.INTERNAL_SERVER_ERROR);
  //           });
  //           it('/category (GET)', async () => {
  //             detailed = false;
  //             await request(app.getHttpServer())
  //               .get(`/category/?${detailed}/`)

  //               .expect(HttpStatus.OK);
  //           });
  //         });
});
