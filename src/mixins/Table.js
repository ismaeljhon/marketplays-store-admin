/*
*   Reusable table with pagination, sorting, and filter functions
* */
import _debounce from 'lodash/debounce'

let TableMixin = {
    created() {
        // this.debounceGetItems()
    },
    data: function () {
        return {
            tableItemsRoute: process.env.VUE_APP_URL, /* Route in for getting items from the api */
            tableParams: {},
            tableCurrentPage: 1,
            tableItems: {
                selected: []
            },

            loading: false
        }
    },
    methods: {
        getItems: function () {
            this.loading = true;

            return this.$http.get( this.tableItemsRoute + '?' + this.getQueryString())
                .then( (response)=>{
                    this.tableItems = response.data;
                    this.getItemsCallback(response)

                    this.loading = false;
                })
                .catch( (error)=>{
                    this.loading = false;
                })
        },
        getItemsCallback(response){
            /* Can be overwritten */
        },
        debounceGetItems : _debounce(function(){
            return this.getItems()
        }, 350),
        pageChange(page) {
            this.tableCurrentPage = page
        },
        getQueryString() {
            this.tableParams.page = this.tableCurrentPage

            return Object.keys(this.tableParams).map(key => key + '=' + this.tableParams[key]).join('&');
        },
        sortingChanged(ctx) {
            if(ctx.sortBy){
                this.tableParams.sortBy = ctx.sortBy
                this.tableParams.sortDesc = ctx.sortDesc
            } else {
                delete this.tableParams.sortBy
                delete this.tableParams.sortDesc
            }

            this.getItems()
        }
    },
    computed: {
        hasSelectedItems() {
            return this.tableItems.selected.length > 0
        }
    },
    watch: {
        tableCurrentPage: {
            handler: 'getItems',
        },
    }
}

export default TableMixin;