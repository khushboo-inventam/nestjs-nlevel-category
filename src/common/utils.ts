/* eslint-disable no-unsafe-optional-chaining */
export const convertBytesToMB = (value) => {
  return value ? value / (1024 * 1024) : 0;
};

export const convertMBToBytes = (value) => {
  return value ? value * (1024 * 1024) : 0;
};

export const stringCreate = (length) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const addMonths = (date, months) => {
  const d = date.getDate();
  date.setMonth(date.getMonth() + +months);
  if (date.getDate() !== d) {
    date.setDate(0);
  }
  return date;
};

export const convertGBToMB = (value) => {
  return value ? value * 1024 : 0;
};

export const setPagination = (options) => {
  let sort;
  if (options?.sort_column) {
    const sortColumn = options.sort_column;
    const order =
      options?.sort_order === '1' || options?.sort_order === 'asc'
        ? 'asc'
        : 'desc';
    sort = { [sortColumn]: order };
  } else {
    sort = { created_at: 'desc' };
  }
  let pagination;
  if (options?.is_paginated) {
    const limit = +options?.limit ? +options.limit : 10;
    const offset =
      ((+options?.offset ? +options?.offset : 1) - 1) * (+limit ? +limit : 10);
    pagination = {
      order: sort,
      take: limit,
      skip: offset,
    };
  } else {
    pagination = {
      order: sort,
    };
  }
  return pagination;
};

export const unixTimestamp = () => {
  return Math.floor(Date.now() / 1000);
};
