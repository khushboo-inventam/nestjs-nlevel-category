import { Test, TestingModule } from "@nestjs/testing";

import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { ClientProxy, ClientsModule, Transport } from "@nestjs/microservices";
import { AppModule } from "../app.module";
import { request } from "http";
import { ITEM_DETAILS } from "../common/global-constants";

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
          const response = await client
            .send("item-details_create", {})
            .toPromise();

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
            .send("item-details_create", {
              value: "jhsdgf",
              dynamic_id: 111111111,
              item_id: 1,
            })
            .toPromise();

          console.log("response 3",response);  
          expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
        } catch (err) {
          console.log("err 3", err);
          expect(err.statusCode).toBe(HttpStatus.NOT_FOUND);
        }
      });

      it("Item-detail / (POST) with wrong item_id", async () => {
        try {
          const response = await client
            .send("item-details_create", {
              value: "jhsdgf",
              item_id: 111111111,
              dynamic_id: 1,
            })
            .toPromise();

          expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
          console.log("response 4",response); 
        } catch (err) {
          console.log("err 4", err);
          expect(err.statusCode).toBe(HttpStatus.NOT_FOUND);
        }
      });
      it("Item-detail / (POST) with wrong value", async () => {
        try {
          const response = await client
            .send("item-details_create", {
              value: 666,
              dynamic_id: 1,
              item_id: 1,
            })
            .toPromise();

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        } catch (err) {
          expect(err.statusCode).toBe(HttpStatus.BAD_REQUEST);
        }
      });

      it("Item-detail / (POST) with actual values", async () => {
        try {
          const response = await client
            .send("item-details_create", {
              value: "Red",
              dynamic_id: 7,
              item_id: 6,
            })
            .toPromise();

          // console.log('response', response, typeof response)
          expect(response.message).toBe(ITEM_DETAILS.CREATED);
        } catch (err) {
          // console.log('err', err, typeof err)
          expect(err.statusCode).toBe(HttpStatus.BAD_REQUEST);
        }
      });

      it("Item-detail / (POST) with actual but existing value", async () => {
        try {
          const response = await client
            .send("item-details_create", {
              value: "Red",
              dynamic_id: 7,
              item_id: 6,
            })
            .toPromise();

          // console.log('response', response, typeof response)
          expect(response.message).toBe(ITEM_DETAILS.CREATED);
        } catch (err) {
          // console.log('err', err, typeof err)
          expect(err.statusCode).toBe(HttpStatus.BAD_REQUEST);
        }
      });

      it("Item-detail / (GET) find Item_search_by_Item_id", async () => {
        try {
          const response = await client
            .send("item-details_search_by_item-details_id", "1")
            .toPromise();
          console.log("response 7", response);
          expect(response.message).toBe(ITEM_DETAILS.FETCHED);
        } catch (err) {
          console.log("err 7", err);
          expect(err.statusCode).toBe(HttpStatus.NOT_ACCEPTABLE);
        }
      });

      it("Item-detail / (GET) find all  item-details_search_by_name ", async () => {
        try {
          const response = await client
            // .send("item-details_search_by_name", { limit: '3', sort_column: 'item.item_id', sort_order: 'asc'})
            .send("item-details_search_by_name", { limit: "2" })
            .toPromise();

          console.log("response 8", response);
          expect(response.message).toBe(ITEM_DETAILS.FETCHED);
        } catch (err) {
          console.log("err 8", err);
          expect(err.statusCode).toBe(HttpStatus.OK);
        }
      });

      it("Item-detail / (UPDATE) item-details_update_item-details_by_id", async () => {
        try {
          const response = await client
            .send("item-details_update_item-details_by_id", {
              item_detail_id: 1,
              value: "Reddd",
              dynamic_id: "7",
              item_id: "6",
            })
            .toPromise();

          console.log("response 9", response);
          expect(response.message).toBe(ITEM_DETAILS.UPDATED);
        } catch (err) {
          console.log("err 9", err);
          expect(err.statusCode).toBe(HttpStatus.BAD_REQUEST);
        }
      });

      it("Item-detail / (Delete) item-details_delete_by_item-details_id", async () => {
        try {
          const response = await client
            .send("item-details_delete_by_item-details_id", 1)
            .toPromise();
          console.log("response 11", response);
          expect(response.message).toBe(ITEM_DETAILS.DELETED);
        } catch (err) {
          console.log("err 11", err);
          expect(err.statusCode).toBe(HttpStatus.BAD_REQUEST);
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
