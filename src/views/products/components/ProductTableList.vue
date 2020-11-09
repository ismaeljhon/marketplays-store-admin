<template>
    <div>
        <v-data-table
            :search="search"
            :headers="headers"
            :items.sync="items"
            v-model="selected"
            @input="$emit('selected', selectedItems)"
            @dblclick:row="emitEdit"
            item-key="_id"
            :options.sync="customOptions"
            :server-items-length="itemsCount"
            @update:page="$emit('refresh', customOptions)"
            @update:items-per-page="$emit('refresh', customOptions)"
        >
            <template slot="item.pricing" slot-scope="row">
                {{ row.item.pricing | currency }}
            </template>
            
            <template slot="item.action" slot-scope="row">
                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn small icon v-bind="attrs" v-on="on" color="primary" @click.prevent="$emit('edit', row.item._id)">
                            <v-icon>mdi-square-edit-outline</v-icon>
                        </v-btn>
                    </template>
                    <span>Edit this item</span>
                </v-tooltip>
                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn small icon v-bind="attrs" v-on="on" color="error" @click.prevent="$emit('delete', row.item)">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </template>
                    <span>Delete this item</span>
                </v-tooltip>
            </template>
        </v-data-table>
    </div>
</template>
<script>
import ProductFormModal from '@/views/products/modals/Product'
import _forEach from 'lodash/forEach'
import _assign from 'lodash/assign'
import UtilsMixin from '@/mixins/Utils'


export default {
    name: 'product-table-list',
    mixins: [UtilsMixin],
    props: {
        items: {
            type: [Object, Array],
            default: []
        },
        search: {
            type: String
        },
        options: {
            type: [Object, Array]
        },
        itemsCount: {
            type: Number
        }
    },
    data() {
        return {
            headers: [
                { text: 'Name', align: 'start', value: 'name', width: "200px"},
                { text: 'Pricing', align: 'start', value: 'pricing', width: "120px" },
                { text: '', align: 'start', sortable: false, value: 'action', width: "100px" },
            ],
            selected: [],
            customOptions: {
                page: 1,
                itemsPerPage: 1,
            }
        }
    },
    methods: {
        emitEdit(e, row) {
            this.$emit('edit', row.item)
        }
    },
    computed: {
        selectedItems() {
            _forEach(this.selected, o => { o.is_selected = true })
            return this.selected
        },
    },
    mounted() {
        _assign(this.customOptions, this.options)
    },
}
</script>