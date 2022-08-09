export type ArrayType<T> = T extends Array<infer U> ? U : T;

export type Schema<V, T extends { [k: string]: string }> = { version: V, item: T };

/**
 * Helps avoid big string by transforming basic Object structure to flat string
 */
export class BasicStructConvertor<T extends Schema<any, any>[]> {
  public readonly templates: T;
  public readonly sep: string;

  constructor(templates: T, seperator: string = ">") {
    this.templates = templates;
    this.sep = seperator;
  }

  /**
   * 
   * @param s The Schema we need the keys from
   * @returns 
   */
  protected keysForTemplate(s: Schema<any, any>) {
    const keys = Object.keys(s.item)
    // sort to always have the keys in the same order
    keys.sort();
    return keys;
  }

  protected getTemplate(item: string): Schema<any, any>;
  protected getTemplate(item: ArrayType<T>): Schema<any, any>;

  protected getTemplate(item: string | ArrayType<T>): Schema<any, any> {
    if (typeof item !== "string") {
      return this.getTemplate(item.version);
    }
    this.validateString(item);
    const template = this.templates.find(e => e.version === item);
    // ensure we found a valid template
    if (template) {
      return template;
    }
    throw new Error('missing template');
  }

  /**
   * Ensures the string does not contain invalid characters
   * @param s string to check
   * @returns 
   */
  protected validateString(s: string) {
    if (s.includes(this.sep)) {
      throw new Error("can't contain same character as separator, try another separator");
    }
    return s;
  }

  from(s: string): ArrayType<T> {
    const splited = s.split(this.sep);
    const versionStr = splited[0];
    const template = this.getTemplate(versionStr);
    const res = { ...template } as ArrayType<T>;
    const r = splited.slice(1);
    this.keysForTemplate(res).forEach((k, i) => {
      res.item[k] = this.validateString(r[i]);
    });
    return res;
  }

  to(item: ArrayType<T>): string {
    let parts = [item.version];
    const template = this.getTemplate(item);
    this.keysForTemplate(template).forEach(k => {
      parts.push(this.validateString(item.item[k]));
    });
    return parts.join(this.sep);
  }
}


/**
 * 
 * @returns a createSchma function which helps with typescript types
 */
export function makeSchemaBuilder<Version>() {
  function createSchema<V extends Version, T extends { [k: string]: string }>(schema: Schema<V, T>) {
    const r = {
      version: schema.version as typeof schema.version,
      item: schema.item
    }
    return r;
  }
  return createSchema;
}







