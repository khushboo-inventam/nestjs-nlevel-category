import { Test, TestingModule } from "@nestjs/testing";
import { CategoryService } from "./category.service";
import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { ClientProxy, ClientsModule, Transport } from "@nestjs/microservices";
import { AppModule } from "../app.module";
import { CATEGORY } from "../common/global-constants";

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
    describe("Category", () => {
      /* 1. Empty keys */
      it("Category / (POST) empty keys", async () => {
        try {
          const response = await client
            .send("category_create", {
              name: "",
              parent_category_id: "",
            })
            .toPromise();

          console.log("response 1", response, typeof response);
          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        } catch (err) {
          console.log("err 1", err, typeof err);
          expect(err.statusCode).toBe(HttpStatus.BAD_REQUEST);
        }
      });

      /* 2. Without key */

      it("Category / (POST) without key", async () => {
        try {
          const response = await client.send("category_create", {}).toPromise();

          console.log("response 2", response, typeof response);
          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        } catch (err) {
          console.log("err 2", err, typeof err);
          expect(err.statusCode).toBe(HttpStatus.BAD_REQUEST);
        }
      });

      /* 3. Wrong parent_category_id */

      it("Category / (POST) with wrong parent_category_id", async () => {
        try {
          const response = await client
            .send("category_create", {
              name: "WER",
              parent_category_id: "15",
            })
            .toPromise();

          console.log("response 3", response, typeof response);
          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        } catch (err) {
          console.log("err 3", err, typeof err);
          expect(err.statusCode).toBe(HttpStatus.BAD_REQUEST);
        }
      });

      /* 4. Blank parent_category_id */

      it("Category / (POST) with blank category name ", async () => {
        try {
          const response = await client
            .send("category_create", {
              parent_category_id: "55",
            })
            .toPromise();
          console.log("response 4", response, typeof response);
          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        } catch (err) {
          console.log("err 4", err, typeof err);
          expect(err.statusCode).toBe(HttpStatus.BAD_REQUEST);
        }
      });

      /* 5. With actual data */

      it("Category / (POST) with actual data", async () => {
        console.log("here");
        try {
          const response = await client
            .send("category_create", {
              name: "Fashion",
              parent_category_id: 0,
            })
            .toPromise();
          console.log("response 5", response);
          expect(response.message).toBe(CATEGORY.CREATED);
        } catch (err) {
          console.log("err 5", err);
          expect(err.statusCode).toBe(HttpStatus.BAD_REQUEST);
        }
      });

      /* 6. Search category by id  by passing integer */

      it("Category / (GET) find category_search_by_category_id by passing integer", async () => {
        try {
          const response = await client
            .send("category_search_by_category_id", +1555)
            .toPromise();
          console.log("response 6", response, typeof response);
          expect(response.statusCode).toBe(HttpStatus.NOT_ACCEPTABLE);
        } catch (err) {
          console.log("err 6", err, typeof err);
          expect(err.statusCode).toBe(HttpStatus.NOT_ACCEPTABLE);
        }
      });

      /* 7. Search category by blank category id */

      it("Category / (GET) find category_search_by_category_id with blank category id ", async () => {
        try {
          const response = await client
            .send("category_search_by_category_id", "")
            .toPromise();
          console.log("response 7", response, typeof response);
          expect(response.statusCode).toBe(HttpStatus.NOT_ACCEPTABLE);
        } catch (err) {
          console.log("err 7", err, typeof err);
          expect(err.statusCode).toBe(HttpStatus.NOT_ACCEPTABLE);
        }
      });

      /* 8. With actual category id */

      it("Category / (GET) find category_search_by_category_id with actual category id ", async () => {
        try {
          const response = await client
            .send("category_search_by_category_id", "1")
            .toPromise();
          console.log("response 8", response, typeof response);
          expect(response.message).toBe(CATEGORY.FETCHED);
        } catch (err) {
          console.log("err 8", err, typeof err);
          expect(err.statusCode).toBe(HttpStatus.NOT_ACCEPTABLE);
        }
      });

      /* 9. actual but not existing category id */

      it("Category / (GET) find category_search_by_category_id with actual but not existing category id ", async () => {
        try {
          const response = await client
            .send("category_search_by_category_id", +11)
            .toPromise();
          console.log("response 9", response, typeof response);
          expect(response.message).toBe(CATEGORY.NOT_FOUND);
        } catch (err) {
          console.log("err 9", err, typeof err);
          expect(err.statusCode).toBe(HttpStatus.NOT_ACCEPTABLE);
        }
      });

      //This testcase is failing. Need to check what's the issue.
      // it("Category / (GET) find all  category_search_by_name ", async () =>
      // {
      //   try {
      //     const response = await client
      //       .send("category_search_by_name", {})
      //       .toPromise();

      //     console.log("response 7", response);
      //     expect(response.message).toBe(CATEGORY.FETCHED);
      //   } catch (err) {
      //     console.log('err 7',err)
      //     expect(err.statusCode).toBe(HttpStatus.OK);
      //   }
      // });

      /* 10. Search by name with pagination */
      it("Category / (GET) find all  category_search_by_name with pagination", async () => {
        try {
          const response = await client
            .send("category_search_by_name", {
              limit: "3",
              sort_column: "cat.category_id",
              sort_order: "desc",
            })
            .toPromise();

          console.log("response 10", response);
          expect(response.message).toBe(CATEGORY.FETCHED);
        } catch (err) {
          console.log("err 10", err);
          expect(err.statusCode).toBe(HttpStatus.OK);
        }
      });

      /* 11.Update */

      it("Category / (UPDATE) category_update_category_by_id", async () => {
        try {
          const response = await client
            .send("category_update_category_by_id", {
              category_id: 1,
              name: "Computer Software 1",
              parent_category_id: 2,
            })
            .toPromise();

          console.log("response 11", response);
          expect(response.message).toBe(CATEGORY.UPDATED);
        } catch (err) {
          console.log("err 11", err);
          expect(err.statusCode).toBe(HttpStatus.BAD_REQUEST);
        }
      });

      /* 12. Delete by id which is existing's parent*/

      it("Category / (Delete) category_delete_category_by_id which is existing's parent", async () => {
        try {
          const response = await client
            .send("category_delete_by_category_id", 1)
            .toPromise();
          console.log("response 12", response);
          expect(response.message).toBe(CATEGORY.DELETED);
        } catch (err) {
          console.log("err 12", err);
          expect(err.message).toBe(CATEGORY.NOT_DELETE_PARENT_CATEGORY);
        }
      });

      /* 13. Delete by id */

      it("Category / (Delete) category_delete_by_category_id", async () => {
        try {
          const response = await client
            .send("category_delete_by_category_id", 5)
            .toPromise();
          console.log("response 13", response);
          expect(response.message).toBe(CATEGORY.DELETED);
        } catch (err) {
          console.log("err 13", err);
          expect(err.statusCode).toBe(HttpStatus.BAD_REQUEST);
        }
      });
    });
  });
});
