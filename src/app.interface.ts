export interface UpdateCategory {
    name?: string,
    parent_category_id?: number
}

export interface UpdateItem {
    name?: string,
    item_description?: string,
    item_code?: string,
    image?: string
}

export interface UpdateDynamicColumn {
    name?: string,
    type?: string
}

export interface UpdateItemDetail {
    value?: string,
    item_id?: number,
    dynamic_id?: number
}
