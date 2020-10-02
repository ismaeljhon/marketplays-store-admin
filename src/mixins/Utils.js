import _filter from 'lodash/filter'
import _forEach from 'lodash/forEach'
import _assign from 'lodash/assign'
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
        cleanCollectionItems(items, item, key = "id") {
            return _filter(items, o => { return o[key] != item[key] })
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
                let maxId = items[0].id
                _forEach(items, o => {
                    if (o.id > maxId)
                        maxId = o.id
                })
                item.id = maxId + 1
                items.push(item)
            }

            return items;
        },
        getCurrencies() {
            let currencies = []
            _forEach(Object.keys(Currencies), o => {
                currencies.push(Currencies[o])
            })

            return currencies
        }
    }
}