import Base from '../Base'
import Cache from '../Cache'
import ContentBit from './Bit'

class ContentLoader extends Base {

    constructor() {
        super()
        this.cache = new Cache()
    }

    async load(path) {
        return this.cache.getOrSet(path, async () => {
            const response = await fetch(`${path}.txt`)
            if (!response.ok) {
                throw response.statusText
            }
            const markdown = await response.text()
            return new ContentBit(path, markdown)
        })
    }

}

export default new ContentLoader