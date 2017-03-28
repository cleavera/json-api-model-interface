import {$fetch, Http} from 'webworker-http';
import {$partial} from '../helpers/Partial.helper';
import {Collection} from './Collection.service';
import {ModelMeta} from "./ModelMeta.service";
import {RequestMethods} from "../constants/RequestMethods.constant";
import {$enumKeys} from "../helpers/EnumKeys.helper";
import {IHttpResponse} from "../interfaces/IHttpResponse.interface";
import {IJSONApi} from "../interfaces/IJSONApi.interface";

export class Model {
  private _apiRoot: string;
  private _meta: any;
  private _attributes: any;
  private _collection: Collection;

  $resolved: boolean = false;
  $promise: Promise<any>;
  attributes: any;
  link: any;
  id: string;
  type: string;
  description: string;
  methods: any;

  get label() {
    let isMetaResolved: boolean = this._meta && this._meta.$resolved;

    if (!isMetaResolved && (this._collection && !this._collection.getMeta().$resolved)) {
      throw new Error('Meta data needs to be fetched before you can get the label');
    }

    let meta: ModelMeta = isMetaResolved ? this._meta : this._collection.getMeta();

    return this.attributes[meta.getLabelField()];
  };

  constructor(promise: Promise<IHttpResponse>, root: string, collection?: Collection) {
    this._apiRoot = root;
    this._collection = collection;

    this.$promise = promise.then(({headers, body}: IHttpResponse) => {
      this.$resolved = true;
      this.id = body.id;
      this.type = body.type;
      this.attributes = body.attributes;
      this.link = {};
      this.description = headers.description;
      this.methods = Model.parseAllowHeaders(headers);

      this.cloneAttributes();

      if (body.links) {
        this.parseLinks(body.links);
      }

      return this;
    });
  }

  public serialise(): IJSONApi {
    return {
      id: this.id,
      attributes: this.attributes,
      type: this.type
    }
  }

  public getMeta(): ModelMeta {
    if (!this._meta) {
      this._meta = ModelMeta.get(this.link.self.url);
    }

    return this._meta;
  }

  public save(): Promise<IHttpResponse> {
    if (!(this.methods[RequestMethods.POST] || this.methods[RequestMethods.PUT])) {
      throw new Error('Model does not have the permissions to save');
    }

    let url = this.link.self.url;

    if (this.methods[RequestMethods.PUT]) {
      this.cloneAttributes();
      return Http.getHttpWorker().put(url, this.serialise());
    }

    return Http.getHttpWorker().post(url, this.serialise());
  }

  public remove(): Promise<IHttpResponse> {
    if (!this.methods[RequestMethods.DELETE]) {
      throw new Error('Model does not have the permissions to remove');
    }

    let url = this.link.self.url;

    return Http.getHttpWorker().remove(url);
  }

  public clean(): void {
    this.attributes = this._attributes;
    this.cloneAttributes();
  }

  static getRoot(url: string): Model {
    return Model.get(url, url);
  }

  static fromMeta(meta: ModelMeta, root: string): Model {
    let model = new Model(meta.$promise.then(() => {
      let response: IHttpResponse = {
        headers: meta.headers,
        body: {
          attributes: {},
          type: meta.type,
          links: meta.links
        }
      };

      Object.keys(meta.attributes).forEach(attribute => {
        if (meta.attributes[attribute].primaryKey === true) {
          return;
        }

        response.body.attributes[attribute] = null;
      });

      return response;
    }), root);

    model._meta = meta;

    return model;
  }

  private cloneAttributes() {
    this._attributes = {};

    Object.assign(this._attributes, this.attributes);
  }

  private parseLinks(links): void {
    let relationships = Object.keys(links);

    relationships.forEach(relationship => {
      if (['self', 'parent'].indexOf(relationship) > -1) {
        this.link[relationship] = $partial(Model.get, this._apiRoot + links[relationship].href, this._apiRoot);
      } else {
        this.link[relationship] = $partial(Collection.list, this._apiRoot + links[relationship].href, this._apiRoot);
      }

      this.link[relationship].url = this._apiRoot + links[relationship].href;
    });
  }

  private static get(url: string, root: string): Model {
    return new Model($fetch(url), root);
  }

  private static parseAllowHeaders({ allow = '' }) {
    let allowHeaders = allow.replace(/\s/g, '').split(','),
      out = {};

    $enumKeys(RequestMethods).forEach(method => {
      out[RequestMethods[method]] = allowHeaders.indexOf(method.toUpperCase()) > -1;
    });

    return out;
  }
}
