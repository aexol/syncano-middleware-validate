declare module '@syncano/core' {
  ///<reference types="node" />
  ///<reference types="node-fetch" />
  import { Agent } from "http";
  export interface RequestArgs  {
    // Ignore any here on purpose.
    // tslint:disable-next-line
    [s: string]: any;
  }

  export interface RequestConfig  {
    // Ignore any here on purpose.
    // tslint:disable-next-line
    [s: string]: any;
  }

  export interface RequestMetaRequest  {
    [s: string]: string;
  }

  export interface RequestYAMLParameter {
    type?: string
    description?: string
    constraints?: object
    required?: boolean
  }

  export interface RequestMetaMetadataParameters  {
    [s: string]: RequestYAMLParameter;
  }
  export interface RequestMetaMetadata  {
    description?: string;
    parameters?: RequestMetaMetadataParameters;
  }

  export interface RequestMeta  {
    socket?: string;
    request?: RequestMetaRequest;
    instance?: string;
    token?: string;
    executor?: string;
    executed_by?: string;
    api_host?: string;
    space_host?: string;
    metadata?: RequestMetaMetadataParameters;
  }

  export interface Context {
    args?: RequestArgs;
    meta?: RequestMeta;
    config?: RequestConfig;
  }

  export class Headers {
    [s: string]: string
  }

  export type HttpResponseT = object
  export interface Settings {
    token?: string;
    instanceName?: string;
    host: string;
    spaceHost: string;
    apiVersion: string;
    socket?: string;
    meta: object;
    setResponse?: (httpResponse: HttpResponseT) => void;
    HttpResponse?: HttpResponseT;
  }

  export interface Config extends Settings {
    className?: string
  }

  // TODO: Better Query/Relationship/MappedField types
  export type Query = object
  export type Relationship = object
  export type MappedField = object
  // Fetch can return pretty much anything
  // considering that it can also be called on sockets.
  // tslint:disable-next-line
  export type FetchResult = any

  export type BodyInit = ArrayBuffer |
    ArrayBufferView |
    string |
    NodeJS.ReadableStream;

  export interface FetchOptions {
    method?: string;
    body?: BodyInit;
    redirect?: RequestRedirect;

    timeout?: number;
    compress?: boolean;
    size?: number;
    agent?: Agent;
    follow?: number;
  }
  export interface QueryBuilder {
    query: Query
    queries: Query[]
    relationships: Relationship[]
    mappedFields: MappedField[]
    fetch(url: string,
      options: FetchOptions,
      headers?: Headers): Promise<FetchResult>
    nonInstanceFetch(url: string,
      options: object,
      headers?: Headers): Promise<FetchResult>
    withQuery(query: Query): QueryBuilder
    withRelationships(relationships: Relationship[]): QueryBuilder
    withMappedFields(fields: MappedField[]): QueryBuilder
  }

  export interface Event extends QueryBuilder {
    url(): string
    emit(signalString: string, payload: object): Promise<FetchResult>
  }

  export interface Endpoint extends QueryBuilder {
    post<T>(endpoint: string,
      body: object,
      options: FetchOptions): Promise<T>
    get<T>(endpoint: string,
      data: object,
      options: FetchOptions): Promise<T>
    delete<T>(endpoint: string,
      data: object,
      options: FetchOptions): Promise<T>
    put<T>(endpoint: string,
      data: object,
      options: FetchOptions): Promise<T>
  }

  export interface Channel extends QueryBuilder {
    url(): string
    publish(room: string, payload: object): Promise<FetchResult>
  }

  export interface Class extends QueryBuilder {
    url(className: string): string
    create(params: object): Promise<FetchResult>
    delete(params: object): Promise<FetchResult>
  }

  export interface Socket extends QueryBuilder {
    url(socketName: string): string
    get(socketName: string): Promise<FetchResult>
    delete(socketName: string): Promise<FetchResult>
    list(socketName: string): Promise<FetchResult>
  }

  export interface Trace extends QueryBuilder {
    url(socketName: string, endpointName: string, traceId: number): string
    get(socketName: string,
      endpointName: string,
      traceId: number): Promise<FetchResult>
    list(socketName: string,
      endpointName: string,
      traceId: number): Promise<FetchResult>
  }

  export interface Hosting extends QueryBuilder {
    url(hostingId: number): string
    urlFiles(hostingId: number, fileId: number): string
    getFiles(hostingId: number, fileId: number): Promise<FetchResult>
    listFiles(hostingId: number): Promise<FetchResult>
    get(hostingId: number): Promise<FetchResult>
    updateFile(hostingId: number,
      fileId: number,
      payload: any): Promise<FetchResult>
    uploadFile(hostingId: number,
      fileId: number,
      payload: any): Promise<FetchResult>
  }

  type headerOrResponse = (
    (content: any) => any) |
    ((key: string, value: string)=> any
  )

  export interface Response {
    (content: any, status: number, mimetype: string, headers: Headers): any
    header(key: string, value: string): any
    json(content: any, status?: number): any
    [s: string]: headerOrResponse
  }

  export interface AuthPayload {
    email: string;
    password: string;
  }

  export interface Account extends QueryBuilder {
    get(authKey: string): Promise<FetchResult>
    login(o: AuthPayload): Promise<FetchResult>
    register(o: AuthPayload): Promise<FetchResult>
  }

  export type CreateInstancePayload = object
  export interface Instance extends QueryBuilder {
    url(instanceName: string): string
    create(params: CreateInstancePayload): Promise<FetchResult>
    get(instanceName: string): Promise<FetchResult>
    list(instanceName: string): Promise<FetchResult>
    delete(instanceName: string): Promise<FetchResult>
  }

  export interface Logger {
    error(msg: string): void
    warn(msg: string): void
    info(msg: string): void
    debug(msg: string): void
  }

  export interface LoggerFactory {
    (s: string): Logger
  }

  export interface Registry extends QueryBuilder {
    url(registryEndpoint: string): string
    searchSocketsByAll(keyword: string): Promise<FetchResult>
    searchSocketsByName(name: string, version: string): Promise<FetchResult>
    publishSocket(name: string, version: string): Promise<FetchResult>
    getSocket(url: string, fileDescriptor: any): Promise<any>
    submitSocket(socketSpec: object, socketConfig: object, socketZipPath: string): Promise<FetchResult>
  }

  export interface DataClass extends QueryBuilder {
    url(id: number): string
    resolveRelatedModels<T>(result: T): Promise<T> 
    resolveIfFinished<T>(result: T): T
    loadNextPage<T>(response: object, objects: T[]): T[]
    request<T>(url: string): T[]
    list<T>(): T[]
    count(): number
    first<T>(): T
    firstOrFail<T>(): T
    firstOrCreate<T>(): T
    updateOrCreate<T>(): T
    find<T>(ids: (number|number[])): (T|T[])
    findOrFail<T>(ids: (number|number[])): (T|T[])
    take(count: number): DataClass
    orderBy(column: string, direction?: string): DataClass
    where(column: string, operator?: any, value?: any): DataClass
    orWhere(column: string, operator?: any, value?: any): DataClass
    whereNotNull(column: string): DataClass
    whereIn(column: string, arr: any[]): DataClass
    whereNotIn(column: string, arr: any[]): DataClass
    whereBetween(column: string, min: any, max: any): DataClass
    fields(fields: string[]): DataClass
    with(models: string[]): DataClass
    pluck<T>(column: string): T
    value<T>(column: string): T
    create<T>(body: object): T
    update<T>(id: (number|object), body?: object): T[]
    delete(id?: (number|number[])): Promise<FetchResult>
  }

  export interface Data {
    [s: string]: DataClass
  }

  export type User = object
  export interface LoginPayload {
    email: string;
    password: string;
  }
  export interface Users extends DataClass {
    login(o: LoginPayload): User
  }

  export default class Server {
    constructor(ctx?: Context);
    event: Event;
    endpoint: Endpoint;
    channel: Channel;
    socket: Socket;
    trace: Trace;
    hosting: Hosting;
    response: Response;
    account: Account;
    instance: Instance;
    logger: LoggerFactory;
    users: Users;
    registry: Registry;
    data: Data;
  }
}