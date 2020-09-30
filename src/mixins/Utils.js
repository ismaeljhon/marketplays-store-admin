import _filter from 'lodash/filter'

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
    }
}