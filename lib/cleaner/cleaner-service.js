import queryDadata from './dadata';
import { getRandomQuery, saveQuery } from './storage';

export class CleanerService {
  static async performQuery(query) {
    if (typeof query !== 'string') {
      throw new TypeError('query expected to be a string');
    }
    if (query === '') {
      return [];
    }
    const result = await queryDadata(query);
    await saveQuery(query);
    return result;
  }

  static async performRandomQuery() {
    const query = await getRandomQuery();
    if (!query) {
      return null;
    }
    const data = await queryDadata(query);
    return {
      data,
      query
    };
  }
}
