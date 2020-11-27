import queryDadata from "./dadata";
import {getRandomQuery, saveQuery} from "./storage";

export class CleanerService {

    async performQuery(query) {
        if(typeof query !== "string") {
            throw new TypeError('query expected to be a string')
        }
        if(query === '') {
            return []
        }
        const result = await queryDadata(query)
        await saveQuery(query)
        return result
    }

    async performRandomQuery() {
        const query = await getRandomQuery()
        console.log({query})
        if(!query) {
            return null
        }
        const data = await queryDadata(query)
        return {
            data,
            query
        }
    }

}