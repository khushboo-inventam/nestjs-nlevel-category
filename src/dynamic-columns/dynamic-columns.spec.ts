import { Test, TestingModule } from "@nestjs/testing";

import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { ClientProxy, ClientsModule, Transport } from "@nestjs/microservices";
import { AppModule } from "../app.module";
import { unixTimestamp } from "../common/pagination";

describe("DYNAMIC-COL", () => {
  let app: INestApplication;

  let client: ClientProxy;
  let trueData: boolean;
  let id: string;
  let detailed: boolean;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        ClientsModule.register([
          { name: "DYNAMIC-COL", transport: Transport.TCP },
        ]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.connectMicroservice({
      transport: Transport.TCP,
    });

    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.startAllMicroservices();
    await app.init();

    client = app.get("DYNAMIC-COL");
    await client.connect();


  });

  afterAll(async () => {

    await app.close();
    client.close();
    console.log("afterAll");
  });

  describe("dynamic-col-Module", () => {
    describe("dynamic_col_create", () => {
      it("Dynamic-col / (POST)", async () => {
        try {
          const response = await client
            .send("dynamic_col_create", {
              name: "",
              type: ""
            })
            .toPromise();

          // console.log('response', response, typeof response)
          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        } catch (err) {
          // console.log('err', err, typeof err)
          expect(err.statusCode).toBe(HttpStatus.BAD_REQUEST);
        }
      });

      it("Dynamic-col / (POST) without key", async () => {
        try {
          const response = await client.send("dynamic_col_create", {}).toPromise()
          console.log('response', response, typeof response)
          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        } catch (err) {
          console.log('err', err, typeof err)
          expect(err.statusCode).toBe(HttpStatus.BAD_REQUEST);
        }
      });

      it("Dynamic-col / (POST) with wrong value passed in name", async () => {
        try {
          const response = await client
            .send("dynamic_col_create", {
              name: 5,
              created_at: unixTimestamp().toString(),
            })
            .toPromise();

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        } catch (err) {
          expect(err.statusCode).toBe(HttpStatus.BAD_REQUEST);
        }
      });

      // it("Item / (GET) find Item_search_by_Item_id", async () => {
      //   try {
      //     const response = await client
      //       .send("item_search_by_item_id", +1)
      //       .toPromise();
      //     console.log('response.....***************.get  ', response.statusCode)
      //     expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
      //   } catch (err) {
      //     expect(err.statusCode).toBe(HttpStatus.NOT_FOUND);
      //   }
      // });
    });
  });

  //   describe('Get Item', () => {
  //           it('/Item (GET)', async () => {
  //             await request(app.getHttpServer()).get(`/Item/${id}/`).expect(HttpStatus.UNAUTHORIZED);
  //           });
  //           it('/Item (GET)', async () => {
  //             await request(app.getHttpServer())
  //               .get(`/Item/${trueData}/`)
  //               .expect(HttpStatus.INTERNAL_SERVER_ERROR);
  //           });
  //           it('/Item (GET)', async () => {
  //             detailed = false;
  //             await request(app.getHttpServer())
  //               .get(`/Item/?${detailed}/`)

  //               .expect(HttpStatus.OK);
  //           });
  //         });
});
