import { ValueObject } from '../../value-objects/value-object-base';

export class BaseRepositoryHelper {
  static getRawColumnName(columnName: string): string {
    return columnName.replace('"', '');
  }

  static valueToString(value: any): string {
    if (Number.isInteger(value)) {
      return Number(value).toString();
    }
    if (value instanceof Date) {
      return (value as Date).toString();
    }
    if (typeof value === 'string') {
      return value;
    }
    if (value instanceof ValueObject) {
      return value.toString();
    }

    return JSON.stringify(value);
  }
}
