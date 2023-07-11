import { Test, TestingModule } from "@nestjs/testing";
import { ItemService } from "./item.service";
import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { ClientProxy, ClientsModule, Transport } from "@nestjs/microservices";
import { AppModule } from "../app.module";
import { request } from "http";
import { ITEM } from "../common/global-constants";

describe("ITEM", () => {
  let app: INestApplication;
  let catServices: ItemService;
  let client: ClientProxy;
  let trueData: boolean;
  let id: string;
  let detailed: boolean;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        ClientsModule.register([
          { name: "ITEM", transport: Transport.TCP },
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

    client = app.get("ITEM");
    await client.connect();


  });

  afterAll(async () => {
  
    await app.close();
    client.close();
    console.log("afterAll");
  });

  describe("Item-Module", () => {
    describe("item_create", () => {
      it("Item / (POST) with empty values", async () => {
        try {
          const response = await client
            .send("item_create", {
              name: "",
              item_description: "",
              image: "",
              item_code: "",

            })
            .toPromise();

          // console.log('response', response, typeof response)
          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        } catch (err) {
          // console.log('err', err, typeof err)
          expect(err.statusCode).toBe(HttpStatus.BAD_REQUEST);
        }
      });

      it("Item / (POST) with actual data ", async () => {
        try {
          const response = await client
            .send("item_create", {
              name: "Ball",
              item_description: "Cricket ball",
              image: "123.jpg",
              item_code: "123",

            })
            .toPromise();

          console.log('response 2', response, typeof response)
          expect(response.message).toBe(ITEM.CREATED);
        } catch (err) {
          console.log('err 2', err, typeof err)
          expect(err.statusCode).toBe(HttpStatus.BAD_REQUEST);
        }
      });

      it("Item / (POST) with actual data but existing name ", async () => {
        try {
          const response = await client
            .send("item_create", {
              name: "Ball",
              item_description: "Cricket ball",
              image: "123.jpg",
              item_code: "123",

            })
            .toPromise();

          console.log('response 3', response, typeof response)
          expect(response.message).toBe(ITEM.CREATED);
        } catch (err) {
          console.log('err 3', err, typeof err)
          expect(err.statusCode).toBe(HttpStatus.BAD_REQUEST);
        }
      });

      it("Item / (POST) without key", async () => {
        try {
          const response = await client.send("item_create", {}).toPromise();

          // console.log('response', response, typeof response)
          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        } catch (err) {
          // console.log('err', err, typeof err)
          expect(err.statusCode).toBe(HttpStatus.BAD_REQUEST);
        }
      });

      it("Item / (POST) with wrong value passed in name ", async () => {
        try {
          const response = await client
            .send("item_create", {
              name: 5,
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


      it("Item / (GET) find Item_search_by_Item_id", async () => {
        try {
          const response = await client
            .send("item_search_by_item_id", +1555)
            .toPromise(); 
         
          expect(response.statusCode).toBe(HttpStatus.NOT_ACCEPTABLE);
        } catch (err) {
          expect(err.statusCode).toBe(HttpStatus.NOT_ACCEPTABLE);
        }
      });

      it("Item / (GET) find Item_search_by_Item_id with blank id ", async () => {
        try {
          const response = await client
            .send("item_search_by_item_id", "")
            .toPromise();

          expect(response.statusCode).toBe(HttpStatus.NOT_ACCEPTABLE);
        } catch (err) {
          expect(err.statusCode).toBe(HttpStatus.NOT_ACCEPTABLE);
        }
      });

      it("Item / (GET) find Item_search_by_Item_id with actual item id ", async () => {
        try {
          const response = await client
            .send("item_search_by_item_id", "1")
            .toPromise();

          expect(response.statusCode).toBe(HttpStatus.NOT_ACCEPTABLE);
        } catch (err) {
          expect(err.statusCode).toBe(HttpStatus.NOT_ACCEPTABLE);
        }
      });

      it("Item / (GET) find Item_search_by_Item_id with actual but non existing item id ", async () => {
        try {
          const response = await client
            .send("item_search_by_item_id", "21")
            .toPromise();

          expect(response.message).toBe(ITEM.NOT_FOUND);
        } catch (err) {
          expect(err.statusCode).toBe(HttpStatus.NOT_ACCEPTABLE);
        }
      });

      it("Item / (GET) find all  item_search_by_name ", async () => 
      {
        try {
          const response = await client
            .send("item_search_by_name", { limit: '3', sort_column: 'item.item_id', sort_order: 'asc'})
            .toPromise();

          console.log("response 8", response);
          expect(response.message).toBe(ITEM.FETCHED);
        } catch (err) {
          console.log('err 8',err)
          expect(err.statusCode).toBe(HttpStatus.OK);
        }
      });

      it("Item / (UPDATE) item_update_item_by_id", async () => {
        try {
          const response = await client
            .send("item_update_item_by_id", { id: 1, name: "Computer Hardwer 1", item_code: 2 })
            .toPromise();

          console.log('response 9',response)
          expect(response.message).toBe(ITEM.UPDATED);
        } catch (err) {
          console.log('err 9',err)
          expect(err.statusCode).toBe(HttpStatus.BAD_REQUEST);
        }
      });

      it("Item / (Delete) item_delete_by_item_id", async () => {
        try {
          const response = await client
            .send("item_delete_by_item_id",
              1)
            .toPromise();
          console.log('response 11',response)
          expect(response.message).toBe(ITEM.DELETED);
        } catch (err) {
          console.log('err 11',err)
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
