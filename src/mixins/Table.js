/*
*   Reusable table with pagination, sorting, and filter functions
* */
import _debounce from 'lodash/debounce'
import _forEach from 'lodash/forEach'
import _capitalize from 'lodash/capitalize'
import _startCase from 'lodash/startCase'
import gql from 'graphql-tag'

let TableMixin = {
    created() {
        // this.debounceGetItems()
    },
    data: function () {
        return {
            tableItemsRoute: process.env.VUE_APP_GRAPHQL_URL, /* Route in for getting items from the api */
            tableParams: {
                model: null,
                query: null,
                options: {
                    page: 1,
                    itemsPerPage: 10,
                }
            },
            tableItems: {
                selected: [],
            },
            loading: false,
            itemsCount: 0
        }
    },
    methods: {
        countItems(model = null) {
            if (model)
                this.tableParams.model = model

            if (!this.tableParams.model) {
                this.loading = false
                return console.error("No MODEL to count")
            }

            const countModelName = "count" + this.tableParams.model[0].toUpperCase() + (this.tableParams.model.substr(1))

            this.$apollo.addSmartQuery(countModelName, {
                query: gql`
                    query {
                        ${countModelName}
                    },
                `,
                update(data) {
                    this.itemsCount = data[countModelName]
                },
                fetchPolicy: 'no-cache'
            })
            this.$apollo.queries[countModelName].start()
        },
        getItems: function (model = null, queryString = null) {
            this.loading = true;
            if (model)
                this.tableParams.model = model

            if (queryString)
                this.tableParams.queryString = queryString

            if (!this.tableParams.model) {
                this.loading = false
                return console.error("No MODEL to fetch")
            }

            if (!this.tableParams.query) {
                this.loading = false
                return console.error("No QUERY initialized")
            }

            if (!this.itemsCount)
                this.countItems()

            this.$apollo.addSmartQuery(this.tableParams.model, {
                query: gql`
                    query {
                        ${this.tableParams.model} (skip: ${this.tableItemsSkip}, limit: ${this.tableParams.options.itemsPerPage}) ${this.tableParams.query}
                    }
                `,
                result ({ loading }) {
                    this.loading = loading
                },
                update(data) {
                    return data[this.tableParams.model]
                },
                fetchPolicy: 'no-cache'
            })

            this.$apollo.queries[this.tableParams.model].start()
        },
        refetch(model = null) {
            if (model) {
                this.tableParams.model = model
            }

            if (!this.tableParams.model) {
                console.error("NO MODEL to refetch")
            }

            this.$apollo.queries[this.tableParams.model].refetch()
        },
        clearGetItems() {
            if (this.$apollo.queries[this.tableParams.model])
                this.$apollo.queries[this.tableParams.model].stop()
        },
    },
    computed: {
        hasSelectedItems() {
            return this.tableItems.selected.length > 0
        },
        tableItemsSkip() {
            return (this.tableParams.options.page - 1) * this.tableParams.options.itemsPerPage
        },
    },
    watch: {
        "tableParams.options.page"() {
            this.getItems()
        },
        "tableParams.options.itemsPerPage"() {
            this.tableParams.options.page = 1
            this.getItems()
        }
    }
}

export default TableMixin;