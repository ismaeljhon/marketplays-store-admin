<template>
    <v-card>
        <v-card-title>
            <v-row dense>
                <v-col cols="5">
                    <h3 class="mr-2"><v-icon left>mdi-cogs</v-icon> Products</h3>
                </v-col>
                <v-col cols="7" class="text-right">
                    <download-csv class="mr-2 v-btn v-btn--depressed v-btn--flat v-btn--outlined v-btn--tile theme--light v-size--small" :data="products" style="cursor: pointer">
                        <v-icon left>mdi-download</v-icon>  Export Products
                    </download-csv>
                    <product-form-modal ref="productFormModal" @saved="$apollo.queries.products.refetch()" />
                </v-col>
                <v-col cols="12">
                    <v-divider class="my-2"></v-divider>
                </v-col>
                <v-col cols="6">
                    <v-menu offset-y>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn v-bind="attrs" v-on="on" tile icon small class="mr-2" color="primary">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon v-bind="attrs" v-on="on" >mdi-{{ gridOn ? 'view-grid' : 'view-list' }}</v-icon>
                                    </template>
                                    <span>View</span>
                                </v-tooltip>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item @click.prevent="gridOn = true" :class="gridOn ? 'v-list-item--active' : ''">
                                <v-list-item-title>Grid View</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click.prevent="gridOn = false" :class="!gridOn ? 'v-list-item--active' : ''">
                                <v-list-item-title>List View</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                    
                    <v-tooltip bottom v-if="gridOn">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn v-bind="attrs" v-on="on" icon small tile class="mr-2" :color="hasSelectedItems ? 'primary' : ''" @click.prevent="selectAll = !selectAll">
                                <v-icon>mdi-playlist-check</v-icon>
                            </v-btn>
                        </template>
                        <span>Select All</span>
                    </v-tooltip>
                    <v-btn v-if="hasSelectedItems" outlined small tile color="error" @click.prevent="deleteItems(tableItems.selected)"><v-icon left>close</v-icon> Delete Selected</v-btn>
                </v-col>
                <v-col cols="6">
                    <v-text-field dense filled v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                </v-col>
            </v-row>
        </v-card-title>
        <v-card-text>
            <product-grid-view v-if="gridOn" :items="products" :select-all="selectAll" @edit="edit" @delete="deleteItems" @update-item="updateItem" />
            <product-table-list v-else ref="productTableList" :items="products" :search="search" @edit="edit" @delete="deleteItems" @selected="afterSelectedEventsOnTableList" />
        </v-card-text>
    </v-card>
</template>
<script>
import ProductFormModal from '@/views/products/modals/Product'
import ProductTableList from '@/views/products/components/ProductTableList'
import ProductGridView from '@/views/products/components/ProductGridView'
import TableMixin from '@/mixins/Table'
import _forEach from 'lodash/forEach'
import _filter from 'lodash/filter'
import _map from 'lodash/map'
import Products from '@/assets/sample-data/products'
import gql from 'graphql-tag'

export default {
    name: 'products',
    mixins: [TableMixin],
    apollo: {
        products: {
            query: gql`
                query {
                    services {
                        _id,
                        name,
                        pricing,
                    }
                }
            `,
            update(data) {
                _forEach(data.services, o => { o.is_selected = false })
                return data.services
            }
        }
    },
    components: {
        ProductFormModal,
        ProductTableList,
        ProductGridView
    },
    data() {
        return {
            gridOn: true,
            selectAll: false,
            search: null,
            tableItems: {
                selected: []
            },
            selectedItems: [],
            products: [],
        }
    },
    methods: {
        edit(item) {
            this.$refs.productFormModal.show(item, false)
        },
        deleteItems(items) {
            swal({
                title: "Are you sure?",
                text: "You will not be able to recover this one",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then(async (willDelete) => {
                if (willDelete) {

                    const result = await this.deleteMutation("Service", items._id)

                    if (result) {
                        swal({
                            title: "Success",
                            icon: "success",
                            text: "Service(s) has been successfully deleted",
                        })
                        this.$apollo.queries.products.refetch()
                    } else {

                    }
                }
            });
        },
        afterSelectedEventsOnTableList(items) {
            this.tableItems.selected = items
        },
        updateItem(item) {
            this.tableItems.products = JSON.parse(JSON.stringify(this.updateCollectionItems(this.tableItems.products, item)))
        }
    },
    watch: {
        hasSelectedItems(newValue) {
            if (!newValue) 
                this.selectAll = false
        },
        selectAll(newValue) {
            this.products = _map(this.products, o => { 
                o.is_selected = newValue
                return o 
            });
        },
        gridOn() {
            this.products = _map(this.products, o => { 
                o.is_selected = false
                return o 
            });
        }
    },
}
</script>