export const setPagination = (options) => {
  // console.log("options", options);
  let sort;
  if (options?.sort_column) {
    const sortColumn = options.sort_column;
    const order =
      options?.sort_order === "1" || options?.sort_order == "asc"
        ? "asc"
        : "desc";
    sort = { [sortColumn]: order };
  } else {
    sort = { 'created_at': "desc" };
  }
  const limit = +options?.limit ? +options.limit : 10;
  const offset =
    ((+options?.offset ? +options?.offset : 1) - 1) * (+limit ? +limit : 10);
  const pagination = {
    order: sort,
    take: limit,
    skip: offset,
  };
  // console.log("pagination", pagination);
  return pagination;
};
//         New
//         11:11
//         let pagination = setPagination(req.query);
//         const findCondition = {
//               relations: { proxy_node: true, user: true },
//               where: whereCondition,
//               ...pagination,
//             };

export const unixTimestamp = () => {
  return Math.floor(Date.now() / 1000);
};
