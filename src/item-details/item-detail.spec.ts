import { Test, TestingModule } from "@nestjs/testing";

import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { ClientProxy, ClientsModule, Transport } from "@nestjs/microservices"; 
import { AppModule } from "../app.module";
import { request } from "http";

describe("ITEM-DETAILS", () => {
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
          { name: "ITEM-DETAILS", transport: Transport.TCP },
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

    client = app.get("ITEM-DETAILS");
    await client.connect();


  });

  afterAll(async () => {
  
    await app.close();
    client.close();
    console.log("afterAll");
  });

  describe("Item-detail-Module", () => {
    describe("item_create", () => {
      it("Item-detail / (POST)", async () => {
        try {
          const response = await client
            .send("item-details_create", {
              value: "",
              dynamic_id: "",
              item_id: "",
              
            })
            .toPromise();

          // console.log('response', response, typeof response)
          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        } catch (err) {
          // console.log('err', err, typeof err)
          expect(err.statusCode).toBe(HttpStatus.BAD_REQUEST);
        }
      });

      it("Item-detail / (POST) without key", async () => {
        try {
          const response = await client.send("item_create", {}).toPromise();

          // console.log('response', response, typeof response)
          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        } catch (err) {
          // console.log('err', err, typeof err)
          expect(err.statusCode).toBe(HttpStatus.BAD_REQUEST);
        }
      });

      it("Item-detail / (POST) with wrong dynamic_id", async () => {
        try {
          const response = await client
            .send("Item_create", {
              value: "jhsdgf",
              dynamic_id: 111111111,
              item_id: 1
            })
            .toPromise();

          expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
        } catch (err) {
          expect(err.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
        }
      });

      it("Item-detail / (POST) with wrong item_id", async () => {
        try {
          const response = await client
            .send("Item_create", {
              value: "jhsdgf",
              item_id: 111111111,
              dynamic_id: 1,
            })
            .toPromise();

          expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
        } catch (err) {
          expect(err.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
        }
      });
      it("Item-detail / (POST) with wrong value", async () => {
        try {
          const response = await client
            .send("Item_create", {
              value: 666,
              dynamic_id:1,
              item_id:1
            })
            .toPromise();

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        } catch (err) {
          expect(err.statusCode).toBe(HttpStatus.BAD_REQUEST);
        }
      });

      it("Item / (GET) find Item_search_by_Item_id", async () => {
        try {
          const response = await client
            .send("item_search_by_item_id", +1)
            .toPromise();
          console.log('response.....***************.get  ', response.statusCode)
          expect(response.statusCode).toBe(HttpStatus.OK);
        } catch (err) {
          expect(err.statusCode).toBe(HttpStatus.OK);
        }
      });
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
