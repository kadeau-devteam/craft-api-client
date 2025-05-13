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

export type PingQueryVariables = Exact<{ [key: string]: never; }>;


export type PingQuery = { __typename?: 'Query', ping: string };


export const PingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ping"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ping"}}]}}]} as unknown as DocumentNode<PingQuery, PingQueryVariables>;
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

export type PingQueryVariables = Exact<{ [key: string]: never; }>;


export type PingQuery = { __typename?: 'Query', ping: string };


export const PingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ping"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ping"}}]}}]} as unknown as DocumentNode<PingQuery, PingQueryVariables>;