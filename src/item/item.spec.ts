import { Test, TestingModule } from "@nestjs/testing";
import { ItemService } from "./item.service";
import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { ClientProxy, ClientsModule, Transport } from "@nestjs/microservices";
import { AppModule } from "../app.module";
import { request } from "http";

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
      it("Item / (POST)", async () => {
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

      it("Item / (POST) with wrong parent_Item_id", async () => {
        try {
          const response = await client
            .send("Item_create", {
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
