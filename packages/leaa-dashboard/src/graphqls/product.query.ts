import gql from 'graphql-tag';

export const HASURA_GET_PRODUCTS = gql`
  query queryProducts($limit: Int!, $offset: Int!, $order_by: [product_order_by!], $where: product_bool_exp) {
    product(limit: $limit, offset: $offset, order_by: $order_by, where: $where) {
      id
      name
    }
    product_aggregate {
      aggregate {
        count
      }
    }
  }
`;
export const GET_PRODUCTS = gql`
  query(
    $page: Int
    $pageSize: Int
    $orderBy: String
    $orderSort: String
    $q: String
    $tagName: String
    $brandName: String
    $brandId: Int
    $styleName: String
    $styleId: Int
  ) {
    products(
      page: $page
      pageSize: $pageSize
      orderBy: $orderBy
      orderSort: $orderSort
      q: $q
      tagName: $tagName
      brandName: $brandName
      brandId: $brandId
      styleName: $styleName
      styleId: $styleId
    ) {
      total
      page
      nextPage
      pageSize
      items {
        id
        name
        fullname
        price
        cost_price
        market_price
        description
        content
        sort
        serial
        stock
        tags {
          id
          name
          description
        }
        styles {
          id
          name
        }
        brands {
          id
          name
        }
        attachments {
          bannerMbList {
            url
          }
        }
        status
        created_at
        updated_at
      }
    }
  }
`;

export const GET_PRODUCT = gql`
  query($id: Int!) {
    product(id: $id) {
      id
      name
      fullname
      price
      cost_price
      market_price
      description
      content
      serial
      stock
      sort
      tags {
        id
        name
        description
      }
      styles {
        id
        name
      }
      brands {
        id
        name
      }
      status
      created_at
      updated_at
    }
  }
`;
