import _filter from 'lodash/filter'
import _forEach from 'lodash/forEach'
import _assign from 'lodash/assign'
import _find from 'lodash/find'
import Currencies from '@/assets/currency'

export default {
    data() {
        return {
            infoMessage: {
                show: false,
                icon: 'check',
                color: 'success',
                message: "",
            }
        }
    },
    methods: {
        cleanCollectionItems(targetItems, items, key = "id") {
            if (Array.isArray(items)) {
                let cleanedItems = targetItems
                _forEach(targetItems, o => {
                    let itemFound = _find(items, i => { return o[key] == i[key] })

                    if (itemFound)
                        cleanedItems = _filter(cleanedItems, i => { return itemFound[key] != i[key] })
                })

                return cleanedItems
            }

            return _filter(targetItems, o => { return o[key] != items[key] })
        },
        updateCollectionItems(items, item, key = "id") {
            let itemFound = false;

            _forEach(items, o => {
                if (o[key] == item[key]) {
                    _assign(o, item)
                    itemFound = true
                }
            })

            if (!itemFound) {
                let maxId = items.length > 1 && items[0][key] ? items[0][key] : 0
                _forEach(items, o => {
                    if (o[key] > maxId)
                        maxId = o.[key]
                })
                item[key] = maxId + 1
                items.push(item)
            }

            return items;
        },
        addKeyToCollection(items, key, value) {
            _forEach(items, o => { 
                o[key] = value
            })
            return items
        },
        getCurrencies() {
            let currencies = []
            _forEach(Object.keys(Currencies), o => {
                currencies.push(Currencies[o])
            })

            return currencies
        },
        getAllowedItems(item, fields) {
            let updatedItem = {}
            _forEach(Object.keys(item), key => {
                if (fields.indexOf(key) > -1) {
                    updatedItem[key] = item[key]
                }
            })

            return updatedItem
        }
    }
}