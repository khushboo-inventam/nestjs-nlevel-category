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

 
  });

  afterAll(async () => {
     

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

              parent_category_id: "55",
            })
            .toPromise();

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        } catch (err) {
          expect(err.statusCode).toBe(HttpStatus.BAD_REQUEST);
        }
      });
      it("Category / (GET) find category_search_by_category_id", async () => {
        try {
          const response = await client
            .send("category_search_by_category_id", +1555)
            .toPromise(); 
         
          expect(response.statusCode).toBe(HttpStatus.NOT_ACCEPTABLE);
        } catch (err) {
          expect(err.statusCode).toBe(HttpStatus.NOT_ACCEPTABLE);
        }
      });

      it("Category / (GET) find category_search_by_category_id with blank id ", async () => {
        try {
          const response = await client
            .send("category_search_by_category_id", "")
            .toPromise();

          expect(response.statusCode).toBe(HttpStatus.NOT_ACCEPTABLE);
        } catch (err) {
          expect(err.statusCode).toBe(HttpStatus.NOT_ACCEPTABLE);
        }
      });


      it("Category / (GET) find all  category_search_by_name ", async () => {
        try {
          const response = await client
            .send("category_search_by_name", { limit: '10' })
            .toPromise();

          expect(response.statusCode).toBe(HttpStatus.OK);
        } catch (err) {
          expect(err.statusCode).toBe(HttpStatus.OK);
        }
      });


      it("Category / (UPDATE) category_update_category_by_id with wrong value  ", async () => {
        try {
          const response = await client
            .send("category_update_category_by_id", { id: 1, name: "Computer Hardwer 1", parent_category_id: "0" })
            .toPromise();

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        } catch (err) {
          expect(err.statusCode).toBe(HttpStatus.BAD_REQUEST);
        }
      });
      it("Category / (UPDATE) category_update_category_by_id  with correct value", async () => {
        id = "1"
        const data = { name: "Computer Hardwer 1" }
        try {
          const response = await client
            .send("category_update_category_by_id",
              [{ id: "1" }, data])
            .toPromise();
          console.log('response',response)
          expect(response.statusCode).toBe(HttpStatus.OK);
        } catch (err) {
          expect(err.statusCode).toBe(HttpStatus.OK);
        }
      });
    });

  });
});


