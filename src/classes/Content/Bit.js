import marked from 'marked'
import Base from '../Base'

export default class ContentBit extends Base {

    constructor(path, markdown) {
        super();
        this.id = window.randomString('c')
        this.path = path
        this.html = marked(markdown)
    }

}
