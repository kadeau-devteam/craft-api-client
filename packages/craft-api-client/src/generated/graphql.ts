/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  QueryArgument: { input: any; output: any; }
};

export type CtaLink = {
  __typename?: 'CTALink';
  label?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type ContentBuilderBlock = ArticlesSection_Entry | Cta_Entry | HighlightTextSection_Entry;

export type Entry = {
  __typename?: 'Entry';
  contentBuilder?: Maybe<Array<ContentBuilderBlock>>;
  id: Scalars['ID']['output'];
  postDate: Scalars['String']['output'];
  sectionId: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  status?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  destinationsEntries: Array<Destination_Entry>;
  entries: Array<Entry>;
  entry?: Maybe<Entry>;
  pages: Array<Page_Entry>;
  pagesEntries: Array<Page_Entry>;
  ping: Scalars['String']['output'];
};


export type QueryEntriesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  relatedTo?: InputMaybe<Array<InputMaybe<Scalars['QueryArgument']['input']>>>;
  section?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  type?: InputMaybe<Scalars['String']['input']>;
};


export type QueryEntryArgs = {
  id: Scalars['ID']['input'];
};

export type Section = {
  __typename?: 'Section';
  handle: Scalars['String']['output'];
};

export type ArticlesSection_Entry = {
  __typename?: 'articlesSection_Entry';
  articlesType?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  tagline?: Maybe<Scalars['String']['output']>;
  text?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  typeHandle?: Maybe<Scalars['String']['output']>;
  uid?: Maybe<Scalars['String']['output']>;
};

export type Cta_Entry = {
  __typename?: 'cta_Entry';
  ctaLink?: Maybe<CtaLink>;
  id: Scalars['ID']['output'];
  image?: Maybe<Images_Asset>;
  text?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  typeHandle?: Maybe<Scalars['String']['output']>;
  uid?: Maybe<Scalars['String']['output']>;
};

export type Destination_Entry = {
  __typename?: 'destination_Entry';
  id: Scalars['ID']['output'];
  slug: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type HighlightTextSection_Entry = {
  __typename?: 'highlightTextSection_Entry';
  id: Scalars['ID']['output'];
  tagline?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  typeHandle?: Maybe<Scalars['String']['output']>;
  uid?: Maybe<Scalars['String']['output']>;
};

export type Images_Asset = {
  __typename?: 'images_Asset';
  alt?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['Int']['output']>;
  mimeType?: Maybe<Scalars['String']['output']>;
  uid?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
  width?: Maybe<Scalars['Int']['output']>;
};

export type Page_Entry = {
  __typename?: 'page_Entry';
  contentBuilder?: Maybe<Array<ContentBuilderBlock>>;
  id: Scalars['ID']['output'];
  slug: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type DestinationsQueryVariables = Exact<{ [key: string]: never; }>;


export type DestinationsQuery = { __typename?: 'Query', destinationsEntries: Array<{ __typename?: 'destination_Entry', id: string, title: string, slug: string }> };

export type CtaEntryFragment = { __typename?: 'cta_Entry', uid?: string | null, typeHandle?: string | null, title: string, text?: string | null, image?: (
    { __typename?: 'images_Asset' }
    & { ' $fragmentRefs'?: { 'CtaImageDetailsFragment': CtaImageDetailsFragment } }
  ) | null, ctaLink?: { __typename?: 'CTALink', url?: string | null, label?: string | null } | null } & { ' $fragmentName'?: 'CtaEntryFragment' };

export type ArticlesSectionEntryFragment = { __typename?: 'articlesSection_Entry', uid?: string | null, typeHandle?: string | null, tagline?: string | null, title: string, text?: string | null, articlesType?: string | null } & { ' $fragmentName'?: 'ArticlesSectionEntryFragment' };

export type HighlightTextSectionEntryFragment = { __typename?: 'highlightTextSection_Entry', uid?: string | null, typeHandle?: string | null, tagline?: string | null, title: string } & { ' $fragmentName'?: 'HighlightTextSectionEntryFragment' };

export type CtaImageDetailsFragment = { __typename?: 'images_Asset', uid?: string | null, alt?: string | null, height?: number | null, width?: number | null, src?: string | null, mimetype?: string | null } & { ' $fragmentName'?: 'CtaImageDetailsFragment' };

export type GetPagesQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPagesQueryQuery = { __typename?: 'Query', pagesEntries: Array<{ __typename?: 'page_Entry', id: string, title: string, contentBuilder?: Array<{ __typename?: 'articlesSection_Entry', id: string, title: string } | { __typename?: 'cta_Entry', id: string, title: string } | { __typename?: 'highlightTextSection_Entry', id: string, title: string }> | null }> };

export const CtaImageDetailsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CTAImageDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"images_Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","alias":{"kind":"Name","value":"src"},"name":{"kind":"Name","value":"url"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"transform"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"3840"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"2438"}}]}]},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","alias":{"kind":"Name","value":"mimetype"},"name":{"kind":"Name","value":"mimeType"}}]}}]} as unknown as DocumentNode<CtaImageDetailsFragment, unknown>;
export const CtaEntryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CTAEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"cta_Entry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"typeHandle"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CTAImageDetails"}}]}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"ctaLink"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"label"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CTAImageDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"images_Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","alias":{"kind":"Name","value":"src"},"name":{"kind":"Name","value":"url"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"transform"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"3840"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"2438"}}]}]},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","alias":{"kind":"Name","value":"mimetype"},"name":{"kind":"Name","value":"mimeType"}}]}}]} as unknown as DocumentNode<CtaEntryFragment, unknown>;
export const ArticlesSectionEntryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArticlesSectionEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"articlesSection_Entry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"typeHandle"}},{"kind":"Field","name":{"kind":"Name","value":"tagline"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"articlesType"}}]}}]} as unknown as DocumentNode<ArticlesSectionEntryFragment, unknown>;
export const HighlightTextSectionEntryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"HighlightTextSectionEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"highlightTextSection_Entry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"typeHandle"}},{"kind":"Field","name":{"kind":"Name","value":"tagline"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]} as unknown as DocumentNode<HighlightTextSectionEntryFragment, unknown>;
export const DestinationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Destinations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"destinationsEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"destination_Entry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]} as unknown as DocumentNode<DestinationsQuery, DestinationsQueryVariables>;
export const GetPagesQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getPagesQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pagesEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"page_Entry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"contentBuilder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"cta_Entry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"highlightTextSection_Entry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"articlesSection_Entry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetPagesQueryQuery, GetPagesQueryQueryVariables>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  QueryArgument: { input: any; output: any; }
};

export type CtaLink = {
  __typename?: 'CTALink';
  label?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type ContentBuilderBlock = ArticlesSection_Entry | Cta_Entry | HighlightTextSection_Entry;

export type Entry = {
  __typename?: 'Entry';
  contentBuilder?: Maybe<Array<ContentBuilderBlock>>;
  id: Scalars['ID']['output'];
  postDate: Scalars['String']['output'];
  sectionId: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  status?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  destinationsEntries: Array<Destination_Entry>;
  entries: Array<Entry>;
  entry?: Maybe<Entry>;
  pages: Array<Page_Entry>;
  pagesEntries: Array<Page_Entry>;
  ping: Scalars['String']['output'];
};


export type QueryEntriesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  relatedTo?: InputMaybe<Array<InputMaybe<Scalars['QueryArgument']['input']>>>;
  section?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  type?: InputMaybe<Scalars['String']['input']>;
};


export type QueryEntryArgs = {
  id: Scalars['ID']['input'];
};

export type Section = {
  __typename?: 'Section';
  handle: Scalars['String']['output'];
};

export type ArticlesSection_Entry = {
  __typename?: 'articlesSection_Entry';
  articlesType?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  tagline?: Maybe<Scalars['String']['output']>;
  text?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  typeHandle?: Maybe<Scalars['String']['output']>;
  uid?: Maybe<Scalars['String']['output']>;
};

export type Cta_Entry = {
  __typename?: 'cta_Entry';
  ctaLink?: Maybe<CtaLink>;
  id: Scalars['ID']['output'];
  image?: Maybe<Images_Asset>;
  text?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  typeHandle?: Maybe<Scalars['String']['output']>;
  uid?: Maybe<Scalars['String']['output']>;
};

export type Destination_Entry = {
  __typename?: 'destination_Entry';
  id: Scalars['ID']['output'];
  slug: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type HighlightTextSection_Entry = {
  __typename?: 'highlightTextSection_Entry';
  id: Scalars['ID']['output'];
  tagline?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  typeHandle?: Maybe<Scalars['String']['output']>;
  uid?: Maybe<Scalars['String']['output']>;
};

export type Images_Asset = {
  __typename?: 'images_Asset';
  alt?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['Int']['output']>;
  mimeType?: Maybe<Scalars['String']['output']>;
  uid?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
  width?: Maybe<Scalars['Int']['output']>;
};

export type Page_Entry = {
  __typename?: 'page_Entry';
  contentBuilder?: Maybe<Array<ContentBuilderBlock>>;
  id: Scalars['ID']['output'];
  slug: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type DestinationsQueryVariables = Exact<{ [key: string]: never; }>;


export type DestinationsQuery = { __typename?: 'Query', destinationsEntries: Array<{ __typename?: 'destination_Entry', id: string, title: string, slug: string }> };

export type CtaEntryFragment = { __typename?: 'cta_Entry', uid?: string | null, typeHandle?: string | null, title: string, text?: string | null, image?: (
    { __typename?: 'images_Asset' }
    & { ' $fragmentRefs'?: { 'CtaImageDetailsFragment': CtaImageDetailsFragment } }
  ) | null, ctaLink?: { __typename?: 'CTALink', url?: string | null, label?: string | null } | null } & { ' $fragmentName'?: 'CtaEntryFragment' };

export type ArticlesSectionEntryFragment = { __typename?: 'articlesSection_Entry', uid?: string | null, typeHandle?: string | null, tagline?: string | null, title: string, text?: string | null, articlesType?: string | null } & { ' $fragmentName'?: 'ArticlesSectionEntryFragment' };

export type HighlightTextSectionEntryFragment = { __typename?: 'highlightTextSection_Entry', uid?: string | null, typeHandle?: string | null, tagline?: string | null, title: string } & { ' $fragmentName'?: 'HighlightTextSectionEntryFragment' };

export type CtaImageDetailsFragment = { __typename?: 'images_Asset', uid?: string | null, alt?: string | null, height?: number | null, width?: number | null, src?: string | null, mimetype?: string | null } & { ' $fragmentName'?: 'CtaImageDetailsFragment' };

export type GetPagesQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPagesQueryQuery = { __typename?: 'Query', pagesEntries: Array<{ __typename?: 'page_Entry', id: string, title: string, contentBuilder?: Array<{ __typename?: 'articlesSection_Entry', id: string, title: string } | { __typename?: 'cta_Entry', id: string, title: string } | { __typename?: 'highlightTextSection_Entry', id: string, title: string }> | null }> };

export const CtaImageDetailsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CTAImageDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"images_Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","alias":{"kind":"Name","value":"src"},"name":{"kind":"Name","value":"url"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"transform"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"3840"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"2438"}}]}]},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","alias":{"kind":"Name","value":"mimetype"},"name":{"kind":"Name","value":"mimeType"}}]}}]} as unknown as DocumentNode<CtaImageDetailsFragment, unknown>;
export const CtaEntryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CTAEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"cta_Entry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"typeHandle"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CTAImageDetails"}}]}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"ctaLink"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"label"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CTAImageDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"images_Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","alias":{"kind":"Name","value":"src"},"name":{"kind":"Name","value":"url"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"transform"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"IntValue","value":"3840"}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"IntValue","value":"2438"}}]}]},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","alias":{"kind":"Name","value":"mimetype"},"name":{"kind":"Name","value":"mimeType"}}]}}]} as unknown as DocumentNode<CtaEntryFragment, unknown>;
export const ArticlesSectionEntryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArticlesSectionEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"articlesSection_Entry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"typeHandle"}},{"kind":"Field","name":{"kind":"Name","value":"tagline"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"articlesType"}}]}}]} as unknown as DocumentNode<ArticlesSectionEntryFragment, unknown>;
export const HighlightTextSectionEntryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"HighlightTextSectionEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"highlightTextSection_Entry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"typeHandle"}},{"kind":"Field","name":{"kind":"Name","value":"tagline"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]} as unknown as DocumentNode<HighlightTextSectionEntryFragment, unknown>;
export const DestinationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Destinations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"destinationsEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"destination_Entry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]} as unknown as DocumentNode<DestinationsQuery, DestinationsQueryVariables>;
export const GetPagesQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getPagesQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pagesEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"page_Entry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"contentBuilder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"cta_Entry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"highlightTextSection_Entry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"articlesSection_Entry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetPagesQueryQuery, GetPagesQueryQueryVariables>;