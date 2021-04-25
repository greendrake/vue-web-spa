import Base from './Base'

export default class Cache extends Base {

  constructor() {
    super()
    this.cache = new Map()
  }

  // ttl in milliseconds
  set(key, value, ttl) {
    if (ttl) {
      const now = new Date()
      ttl = now.getTime() + ttl
    }
    this.cache.set(key, {
      value,
      expiry: ttl,
    });
  }

  remove(key) {
    this.cache.delete(key)
  }

  get(key) {
    const item = this.cache.get(key)
    if (item === undefined) {
      return item
    }
    if (! item.expiry) {
      return item.value
    }
    const now = new Date()
    if (now.getTime() > item.expiry) {
      this.remove(key)
      return undefined
    }
    return item.value
  }

  async getOrSet(key, obtainValue, ttl) {
    let value = this.get(key)
    if (value === undefined) {
      value = await obtainValue()
      this.set(key, value, ttl)
    }
    return value
  }

}
