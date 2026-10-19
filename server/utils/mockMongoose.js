const fs = require('fs');
const path = require('path');

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

class MockQuery {
  constructor(data, model) {
    this._data = data;
    this._model = model;
    this._sort = null;
    this._skip = 0;
    this._limit = null;
    this._populatePaths = [];
    this._selectFields = null;
    this._isFindOne = false;
  }

  populate(pathStr) {
    if (typeof pathStr === 'string') {
      this._populatePaths.push(pathStr);
    } else if (typeof pathStr === 'object' && pathStr.path) {
      this._populatePaths.push(pathStr.path);
    }
    return this;
  }

  sort(sortOption) {
    this._sort = sortOption;
    return this;
  }

  skip(val) {
    this._skip = Number(val) || 0;
    return this;
  }

  limit(val) {
    this._limit = Number(val) || null;
    return this;
  }

  select(fields) {
    this._selectFields = fields;
    return this;
  }

  // Executing query
  then(resolve, reject) {
    try {
      let results = [...this._data];

      // Sort
      if (this._sort) {
        let field = '';
        let desc = false;
        if (typeof this._sort === 'string') {
          if (this._sort.startsWith('-')) {
            field = this._sort.substring(1);
            desc = true;
          } else {
            field = this._sort;
          }
        } else if (typeof this._sort === 'object') {
          field = Object.keys(this._sort)[0];
          desc = this._sort[field] === -1;
        }

        if (field) {
          results.sort((a, b) => {
            const valA = a[field];
            const valB = b[field];
            if (valA < valB) return desc ? 1 : -1;
            if (valA > valB) return desc ? -1 : 1;
            return 0;
          });
        }
      }

      // Skip & Limit
      if (this._skip) {
        results = results.slice(this._skip);
      }
      if (this._limit) {
        results = results.slice(0, this._limit);
      }

      // Mock populate
      if (this._populatePaths.length > 0) {
        const users = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'users.json'), 'utf8'));
        const properties = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'properties.json'), 'utf8'));

        results = results.map(item => {
          const newItem = { ...item };
          this._populatePaths.forEach(pPath => {
            if (pPath === 'seller' && newItem.seller) {
              const sellerId = newItem.seller.toString();
              const foundUser = users.find(u => u._id === sellerId);
              if (foundUser) {
                newItem.seller = {
                  _id: foundUser._id,
                  name: foundUser.name,
                  email: foundUser.email,
                  phone: foundUser.phone,
                  avatar: foundUser.avatar,
                };
              }
            } else if (pPath === 'property' && newItem.property) {
              const propId = newItem.property.toString();
              const foundProp = properties.find(p => p._id === propId);
              if (foundProp) {
                newItem.property = { ...foundProp };
                const sellerUser = users.find(u => u._id === foundProp.seller);
                if (sellerUser) {
                  newItem.property.seller = {
                    _id: sellerUser._id,
                    name: sellerUser.name,
                    email: sellerUser.email,
                    phone: sellerUser.phone,
                  };
                }
              }
            }
          });
          return newItem;
        });
      }

      // Handle Mongoose mock methods on individual objects
      results = results.map(item => {
        const doc = { ...item };
        
        // Add helper methods
        doc.matchPassword = async function(enteredPassword) {
          return enteredPassword === this.password;
        };
        doc.toObject = function() { return this; };
        doc.select = function(fields) {
          if (fields === '-password') {
            const { password, ...rest } = this;
            return rest;
          }
          return this;
        };

        return doc;
      });

      // Handle Select fields
      if (this._selectFields) {
        if (this._selectFields === '-password') {
          results = results.map(item => {
            const { password, ...rest } = item;
            return rest;
          });
        }
      }

      if (this._isFindOne) {
        resolve(results[0] || null);
      } else {
        resolve(results);
      }
    } catch (err) {
      reject(err);
    }
  }

  catch(reject) {
    return this.then(val => val, reject);
  }
}

class MockModel {
  constructor(name, defaultData = []) {
    this.name = name;
    const plural = name.toLowerCase() === 'property' ? 'properties' : `${name.toLowerCase()}s`;
    this.filePath = path.join(__dirname, '..', 'data', `${plural}.json`);
    
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify(defaultData, null, 2));
    }
  }

  _read() {
    try {
      return JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
    } catch {
      return [];
    }
  }

  _write(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }

  find(filter = {}) {
    const data = this._read();
    let filtered = [...data];

    const getNestedValue = (obj, pathStr) => {
      if (!obj || !pathStr) return undefined;
      const parts = pathStr.split('.');
      let current = obj;
      for (const part of parts) {
        if (current === null || current === undefined) return undefined;
        current = current[part];
      }
      return current;
    };

    Object.keys(filter).forEach(key => {
      const filterVal = filter[key];
      if (filterVal === undefined) return;

      if (key === '$text') {
        const searchStr = filterVal.$search?.toLowerCase() || '';
        filtered = filtered.filter(item => 
          item.title?.toLowerCase().includes(searchStr) || 
          item.description?.toLowerCase().includes(searchStr) ||
          item.location?.city?.toLowerCase().includes(searchStr)
        );
        return;
      }

      filtered = filtered.filter(item => {
        const itemVal = getNestedValue(item, key);

        if (filterVal instanceof RegExp) {
          return itemVal != null && filterVal.test(String(itemVal));
        }

        if (filterVal && typeof filterVal === 'object' && !Array.isArray(filterVal)) {
          let match = true;
          if (filterVal.$gte !== undefined) {
            match = match && (itemVal >= filterVal.$gte);
          }
          if (filterVal.$lte !== undefined) {
            match = match && (itemVal <= filterVal.$lte);
          }
          if (filterVal.$ne !== undefined) {
            match = match && (itemVal?.toString() !== filterVal.$ne?.toString());
          }
          if (filterVal.$in !== undefined && Array.isArray(filterVal.$in)) {
            match = match && filterVal.$in.some(val => val?.toString() === itemVal?.toString());
          }
          return match;
        }

        if (itemVal === undefined || itemVal === null) {
          return filterVal === null || filterVal === undefined;
        }

        if (typeof itemVal === 'string' && typeof filterVal === 'string') {
          return itemVal.toLowerCase() === filterVal.toLowerCase();
        }

        return itemVal.toString() === filterVal.toString();
      });
    });

    return new MockQuery(filtered, this);
  }

  findOne(filter = {}) {
    const query = this.find(filter);
    query._isFindOne = true;
    return query;
  }

  findById(id) {
    if (!id) {
      // Return empty query
      return new MockQuery([], this);
    }
    const query = this.find({ _id: id.toString() });
    query._isFindOne = true;
    return query;
  }

  async create(obj) {
    const data = this._read();
    
    const newDoc = {
      _id: generateId(),
      ...obj,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    data.push(newDoc);
    this._write(data);

    return {
      ...newDoc,
      matchPassword: async function(enteredPassword) {
        return enteredPassword === this.password;
      },
      toObject: function() { return this; }
    };
  }

  async findByIdAndUpdate(id, updateData, options = {}) {
    const data = this._read();
    const idx = data.findIndex(item => item._id === id.toString());
    if (idx === -1) return null;

    data[idx] = {
      ...data[idx],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    this._write(data);
    return data[idx];
  }

  async findByIdAndDelete(id) {
    const data = this._read();
    const found = data.find(item => item._id === id.toString());
    if (!found) return null;

    const filtered = data.filter(item => item._id !== id.toString());
    this._write(filtered);
    return found;
  }

  async countDocuments(filter = {}) {
    const query = this.find(filter);
    // Resolve query immediately
    const res = await query;
    return res.length;
  }
}

module.exports = MockModel;
