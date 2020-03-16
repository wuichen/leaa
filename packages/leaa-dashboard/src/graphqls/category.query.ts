import gql from 'graphql-tag';

import { CATEGORY_CHILD_FRAGMENT } from './category.fragment';

export const HASURA_GET_CATEGORIES = gql`
  query queryCategories($limit: Int!, $offset: Int!, $order_by: [product_order_by!], $where: product_bool_exp) {
    category(limit: $limit, offset: $offset, order_by: $order_by, where: $where) {
      id
      name
    }
    category_aggregate {
      aggregate {
        count
      }
    }
  }
`;

export const GET_CATEGORIES = gql`
  query(
    $page: Int
    $pageSize: Int
    $orderBy: String
    $orderSort: String
    $q: String
    $treeType: Boolean
    $listType: Boolean
    $expanded: Boolean
    $parentSlug: String
    $parentId: Int
  ) {
    categories(
      page: $page
      pageSize: $pageSize
      orderBy: $orderBy
      orderSort: $orderSort
      q: $q
      treeType: $treeType
      listType: $listType
      expanded: $expanded
      parentSlug: $parentSlug
      parentId: $parentId
    ) {
      total
      trees {
        ...CATEGORY_TREE_FRAGMENT
        children {
          ...CATEGORY_TREE_FRAGMENT
          children {
            ...CATEGORY_TREE_FRAGMENT
            children {
              ...CATEGORY_TREE_FRAGMENT
              children {
                ...CATEGORY_TREE_FRAGMENT
                children {
                  ...CATEGORY_TREE_FRAGMENT
                  children {
                    ...CATEGORY_TREE_FRAGMENT
                    children {
                      ...CATEGORY_TREE_FRAGMENT
                      children {
                        ...CATEGORY_TREE_FRAGMENT
                        children {
                          ...CATEGORY_TREE_FRAGMENT
                          children {
                            ...CATEGORY_TREE_FRAGMENT
                            children {
                              ...CATEGORY_TREE_FRAGMENT
                              children {
                                ...CATEGORY_TREE_FRAGMENT
                                children {
                                  ...CATEGORY_TREE_FRAGMENT
                                  children {
                                    ...CATEGORY_TREE_FRAGMENT
                                    children {
                                      ...CATEGORY_TREE_FRAGMENT
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      items {
        id
        name
        slug
        parent_id
        description
        created_at
        updated_at
      }
    }
  }
  ${CATEGORY_CHILD_FRAGMENT}
`;

export const GET_CATEGORY = gql`
  query($id: Int!) {
    category(id: $id) {
      id
      name
      slug
      parent_id
      description
      created_at
      updated_at
    }
  }
`;
