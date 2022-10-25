import { errorMessages } from '../../error-messages';

export class BaseRepositoryHelper {
  static getRawColumnName(columnName: string): string {
    return columnName.replace('"', '');
  }

  static objectToString(value: any): string {
    if (Number.isInteger(value)) {
      return Number(value).toString();
    }
    if (value instanceof Date) {
      return (value as Date).toString();
    }
    if (typeof value === 'string') {
      return value;
    }
    throw new Error(errorMessages.NO_MAPPING_PROVIDED);
  }
}
