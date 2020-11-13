<template>
    <v-card>
        <v-card-title>
            <v-row dense>
                <v-col cols="5">
                    <h3 class="mr-2"><v-icon left>mdi-cart-outline</v-icon> Orders</h3>
                </v-col>
                <v-col cols="7" class="text-right">
                    <download-csv class="mr-2 v-btn v-btn--depressed v-btn--flat v-btn--outlined v-btn--tile theme--light v-size--small" :data="orders" style="cursor: pointer">
                        <v-icon left>mdi-download</v-icon>Export Orders
                    </download-csv>
                    
                    <department-form-modal ref="deparmentFormModal" @saved="refetch()" />
                </v-col>
                <v-col cols="12">
                    <v-divider class="my-2"></v-divider>
                </v-col>
                <v-col cols="6">
                    <v-btn v-if="hasSelectedItems" outlined small tile color="error" @click.prevent="deleteItems(tableItems.selected)">
                        <v-icon left>mdi-close</v-icon> Delete Selected
                    </v-btn>
                    <v-spacer v-else></v-spacer>
                </v-col>
                <v-col cols="6">
                    <v-text-field dense filled single-line hide-details v-model="search" append-icon="mdi-magnify" label="Search"></v-text-field>
                </v-col>
            </v-row>
        </v-card-title>
        <v-card-text>
            <v-data-table
                :search="search"
                :headers="headers"
                :items="orders"
                v-model="tableItems.selected"
                @input="afterSelectedEventsOnTableList"
                item-key="_id"
                loading-text="Loading please wait..."
                :loading="loading"
                :options.sync="tableParams.options"
                :server-items-length="10"
            >
                <template slot="item.action" slot-scope="row">
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn small icon v-bind="attrs" v-on="on" color="primary" @click.prevent="$refs.deparmentFormModal.show(row.item._id, false)">
                                <v-icon>mdi-square-edit-outline</v-icon>
                            </v-btn>
                        </template>
                        <span>Edit this item</span>
                    </v-tooltip>
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn small icon v-bind="attrs" v-on="on" color="error" @click.prevent="deleteItems(row.item)">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </template>
                        <span>Delete this item</span>
                    </v-tooltip>
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>
</template>
<script>
import DepartmentFormModal from '@/views/orders/modals/Order'
import TableMixin from '@/mixins/Table'
import _assign from 'lodash/assign'
import _find from 'lodash/find'
import _filter from 'lodash/filter'
import _forEach from 'lodash/forEach'

import gql from 'graphql-tag'

export default {
    name: 'orders',
    mixins: [TableMixin],
    components: {
        DepartmentFormModal,
    },
    data: () => ({
        search: null,
        headers: [
            { text: 'Order #', align: 'start', value: 'orderNumber', width: "150px" },
            { text: 'Customer', align: 'start', value: 'customer' },
            { text: 'Amount', align: 'start', value: 'customer' },
            { text: '', align: 'start', sortable: false, value: 'action', width: "100px" },
        ],
        orders: []
    }),
    methods: {
        afterSelectedEventsOnTableList(items) {
            this.tableItems.selected = items
        },
    },
    mounted() {
        // this.getItems()
    },
    beforeDestroy() {
        // this.clearGetItems()
    }
}
</script>