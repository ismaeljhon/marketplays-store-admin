<template>
    <div>
        <v-data-table
            :search="search"
            :headers="headers"
            :items="items"
            :items-per-page="5"
            class="elevation-1"
            v-model="selected"
            show-select
            @input="$emit('selected', selected)"
            @dblclick:row="emitEdit"
        >
            <template slot="item.pricing" slot-scope="row">
                {{ row.item.pricing | currency }}
            </template>
            
            <template slot="item.action" slot-scope="row">
                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn small icon v-bind="attrs" v-on="on" color="info" class="mr-2" @click.prevent="$emit('edit', row.item)">
                            <v-icon>edit</v-icon>
                        </v-btn>
                    </template>
                    <span>Edit this item</span>
                </v-tooltip>
                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn small icon v-bind="attrs" v-on="on" color="error" @click.prevent="$emit('delete', row.item)">
                            <v-icon>close</v-icon>
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
    },
    data() {
        return {
            headers: [
                { text: 'ID', align: 'start', value: 'id', width: "70px" },
                { text: 'Name', align: 'start', value: 'name', width: "200px"},
                { text: 'Short Description', align: 'start', value: 'short_description' },
                { text: 'Pricing', align: 'start', value: 'pricing', width: "120px" },
                { text: '', align: 'start', sortable: false, value: 'action', width: "100px" },
            ],
            selected: []
        }
    },
    methods: {
        emitEdit(e, row) {
            this.$emit('edit', row.item)
        }
    }
}
</script>