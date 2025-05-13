/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "query Destinations {\n  destinationsEntries {\n    ... on destination_Entry {\n      id\n      title\n      slug\n    }\n  }\n}": typeof types.DestinationsDocument,
    "fragment CTAEntry on cta_Entry {\n  uid\n  typeHandle\n  image {\n    ...CTAImageDetails\n  }\n  title\n  text\n  ctaLink {\n    url\n    label\n  }\n}\n\nfragment ArticlesSectionEntry on articlesSection_Entry {\n  uid\n  typeHandle\n  tagline\n  title\n  text\n  articlesType\n}\n\nfragment HighlightTextSectionEntry on highlightTextSection_Entry {\n  uid\n  typeHandle\n  tagline\n  title\n}\n\nfragment ImageWithTextEntry on imageWithText_Entry {\n  uid\n  typeHandle\n  image {\n    uid\n    alt\n    height\n    width\n    mimetype: mimeType\n  }\n  imageSide\n  fullWidthImage\n  showTagline\n  tagline\n  showTitle\n  fTitle\n  titleHeadingLevel\n  showText\n  text\n  showLink\n  fLink {\n    label\n    link\n  }\n  showItems\n  itemsStyle\n  items {\n    ... on items_Entry {\n      showTitle\n      title\n      fTitle\n      text\n    }\n  }\n}\n\nfragment StepsSectionEntry on stepsSection_Entry {\n  uid\n  typeHandle\n  tagline\n  title\n  showText\n  text\n  steps {\n    ... on step_Entry {\n      uid\n      image {\n        uid\n        alt\n        height\n        width\n        mimetype: mimeType\n      }\n      tagline\n      title\n      text\n    }\n  }\n}": typeof types.CtaEntryFragmentDoc,
    "fragment CTAImageDetails on images_Asset {\n  uid\n  src: url @transform(width: 3840, height: 2438)\n  alt\n  height\n  width\n  mimetype: mimeType\n}": typeof types.CtaImageDetailsFragmentDoc,
    "query getPagesQuery {\n  pagesEntries {\n    ... on page_Entry {\n      uid\n      typeHandle\n      contentBuilder {\n        __typename\n        ...CTAEntry\n        ...ArticlesSectionEntry\n        ...HighlightTextSectionEntry\n        ...ImageWithTextEntry\n        ...StepsSectionEntry\n      }\n    }\n  }\n}": typeof types.GetPagesQueryDocument,
};
const documents: Documents = {
    "query Destinations {\n  destinationsEntries {\n    ... on destination_Entry {\n      id\n      title\n      slug\n    }\n  }\n}": types.DestinationsDocument,
    "fragment CTAEntry on cta_Entry {\n  uid\n  typeHandle\n  image {\n    ...CTAImageDetails\n  }\n  title\n  text\n  ctaLink {\n    url\n    label\n  }\n}\n\nfragment ArticlesSectionEntry on articlesSection_Entry {\n  uid\n  typeHandle\n  tagline\n  title\n  text\n  articlesType\n}\n\nfragment HighlightTextSectionEntry on highlightTextSection_Entry {\n  uid\n  typeHandle\n  tagline\n  title\n}\n\nfragment ImageWithTextEntry on imageWithText_Entry {\n  uid\n  typeHandle\n  image {\n    uid\n    alt\n    height\n    width\n    mimetype: mimeType\n  }\n  imageSide\n  fullWidthImage\n  showTagline\n  tagline\n  showTitle\n  fTitle\n  titleHeadingLevel\n  showText\n  text\n  showLink\n  fLink {\n    label\n    link\n  }\n  showItems\n  itemsStyle\n  items {\n    ... on items_Entry {\n      showTitle\n      title\n      fTitle\n      text\n    }\n  }\n}\n\nfragment StepsSectionEntry on stepsSection_Entry {\n  uid\n  typeHandle\n  tagline\n  title\n  showText\n  text\n  steps {\n    ... on step_Entry {\n      uid\n      image {\n        uid\n        alt\n        height\n        width\n        mimetype: mimeType\n      }\n      tagline\n      title\n      text\n    }\n  }\n}": types.CtaEntryFragmentDoc,
    "fragment CTAImageDetails on images_Asset {\n  uid\n  src: url @transform(width: 3840, height: 2438)\n  alt\n  height\n  width\n  mimetype: mimeType\n}": types.CtaImageDetailsFragmentDoc,
    "query getPagesQuery {\n  pagesEntries {\n    ... on page_Entry {\n      uid\n      typeHandle\n      contentBuilder {\n        __typename\n        ...CTAEntry\n        ...ArticlesSectionEntry\n        ...HighlightTextSectionEntry\n        ...ImageWithTextEntry\n        ...StepsSectionEntry\n      }\n    }\n  }\n}": types.GetPagesQueryDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Destinations {\n  destinationsEntries {\n    ... on destination_Entry {\n      id\n      title\n      slug\n    }\n  }\n}"): (typeof documents)["query Destinations {\n  destinationsEntries {\n    ... on destination_Entry {\n      id\n      title\n      slug\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment CTAEntry on cta_Entry {\n  uid\n  typeHandle\n  image {\n    ...CTAImageDetails\n  }\n  title\n  text\n  ctaLink {\n    url\n    label\n  }\n}\n\nfragment ArticlesSectionEntry on articlesSection_Entry {\n  uid\n  typeHandle\n  tagline\n  title\n  text\n  articlesType\n}\n\nfragment HighlightTextSectionEntry on highlightTextSection_Entry {\n  uid\n  typeHandle\n  tagline\n  title\n}\n\nfragment ImageWithTextEntry on imageWithText_Entry {\n  uid\n  typeHandle\n  image {\n    uid\n    alt\n    height\n    width\n    mimetype: mimeType\n  }\n  imageSide\n  fullWidthImage\n  showTagline\n  tagline\n  showTitle\n  fTitle\n  titleHeadingLevel\n  showText\n  text\n  showLink\n  fLink {\n    label\n    link\n  }\n  showItems\n  itemsStyle\n  items {\n    ... on items_Entry {\n      showTitle\n      title\n      fTitle\n      text\n    }\n  }\n}\n\nfragment StepsSectionEntry on stepsSection_Entry {\n  uid\n  typeHandle\n  tagline\n  title\n  showText\n  text\n  steps {\n    ... on step_Entry {\n      uid\n      image {\n        uid\n        alt\n        height\n        width\n        mimetype: mimeType\n      }\n      tagline\n      title\n      text\n    }\n  }\n}"): (typeof documents)["fragment CTAEntry on cta_Entry {\n  uid\n  typeHandle\n  image {\n    ...CTAImageDetails\n  }\n  title\n  text\n  ctaLink {\n    url\n    label\n  }\n}\n\nfragment ArticlesSectionEntry on articlesSection_Entry {\n  uid\n  typeHandle\n  tagline\n  title\n  text\n  articlesType\n}\n\nfragment HighlightTextSectionEntry on highlightTextSection_Entry {\n  uid\n  typeHandle\n  tagline\n  title\n}\n\nfragment ImageWithTextEntry on imageWithText_Entry {\n  uid\n  typeHandle\n  image {\n    uid\n    alt\n    height\n    width\n    mimetype: mimeType\n  }\n  imageSide\n  fullWidthImage\n  showTagline\n  tagline\n  showTitle\n  fTitle\n  titleHeadingLevel\n  showText\n  text\n  showLink\n  fLink {\n    label\n    link\n  }\n  showItems\n  itemsStyle\n  items {\n    ... on items_Entry {\n      showTitle\n      title\n      fTitle\n      text\n    }\n  }\n}\n\nfragment StepsSectionEntry on stepsSection_Entry {\n  uid\n  typeHandle\n  tagline\n  title\n  showText\n  text\n  steps {\n    ... on step_Entry {\n      uid\n      image {\n        uid\n        alt\n        height\n        width\n        mimetype: mimeType\n      }\n      tagline\n      title\n      text\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment CTAImageDetails on images_Asset {\n  uid\n  src: url @transform(width: 3840, height: 2438)\n  alt\n  height\n  width\n  mimetype: mimeType\n}"): (typeof documents)["fragment CTAImageDetails on images_Asset {\n  uid\n  src: url @transform(width: 3840, height: 2438)\n  alt\n  height\n  width\n  mimetype: mimeType\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query getPagesQuery {\n  pagesEntries {\n    ... on page_Entry {\n      uid\n      typeHandle\n      contentBuilder {\n        __typename\n        ...CTAEntry\n        ...ArticlesSectionEntry\n        ...HighlightTextSectionEntry\n        ...ImageWithTextEntry\n        ...StepsSectionEntry\n      }\n    }\n  }\n}"): (typeof documents)["query getPagesQuery {\n  pagesEntries {\n    ... on page_Entry {\n      uid\n      typeHandle\n      contentBuilder {\n        __typename\n        ...CTAEntry\n        ...ArticlesSectionEntry\n        ...HighlightTextSectionEntry\n        ...ImageWithTextEntry\n        ...StepsSectionEntry\n      }\n    }\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;