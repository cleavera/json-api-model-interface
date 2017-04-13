import {IFieldMeta} from "../interfaces/IFieldMeta.interface";
import {FieldMeta} from "./FieldMeta.service";
import {Http} from './Http.service';

export class ModelMeta {
  $resolved: boolean = false;
  $promise: Promise<any>;
  attributes: Map<string, FieldMeta>;
  headers: any;
  links: any;
  type: string;

  constructor(promise: Promise<any>) {
    this.$promise = promise.then(({headers, body}) => {
      this.$resolved = true;

      this.type = body.type;
      this.attributes = ModelMeta.parseAttributes(body.attributes);
      this.links = body.links;
      this.headers = headers;

      return this;
    });
  }

  getLabelField() {
    return Object.keys(this.attributes).filter(attribute => this.attributes[attribute].label)[0];
  }

  static get(url: string): ModelMeta {
    return new ModelMeta(Http.options(url));
  }

  private static parseAttributes(attributes: Map<string, IFieldMeta>): Map<string, FieldMeta> {
    let out = {};

    Object.keys(attributes).forEach(attribute => {
      out[attribute] = new FieldMeta(attributes[attribute]);
    });

    return <Map<string, FieldMeta>>out;
  }
}
