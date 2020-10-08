<template>
    <v-card>
        <v-card-title>
            <v-row dense>
                <v-col cols="5">
                    <h3 class="mr-2"><v-icon left>local_offer</v-icon> Products</h3>
                </v-col>
                <v-col cols="7" class="text-right">
                    <v-btn small class="mr-2" outlined tile><v-icon left>backup</v-icon> Export Products</v-btn>
                    <product-form-modal ref="productFormModal" @saved="saveItem" />
                </v-col>
                <v-col cols="12">
                    <v-divider class="mb-3"></v-divider>
                </v-col>
                <v-col cols="6">
                    <v-btn outlined tile small :color="!gridOn ? 'grey': 'success'" class="mr-2" @click.prevent="gridOn = !gridOn">
                        <v-icon left>grid_on</v-icon> Grid View
                    </v-btn>
                    <v-btn v-if="hasSelectedItems" outlined small tile color="error" ><v-icon left>close</v-icon> Delete Selected</v-btn>
                </v-col>
                <v-col cols="6">
                    <v-text-field dense filled v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
                </v-col>
            </v-row>
        </v-card-title>
        <v-card-text>
            <product-grid-view v-if="gridOn" :items="tableItems.products" />
            <product-table-list v-else ref="productTableList" :items="tableItems.products" :search="search" @edit="edit" @delete="deleteItem" @selected="afterSelectedEvents" />
        </v-card-text>
    </v-card>
</template>
<script>
import ProductFormModal from '@/views/products/modals/Product'
import ProductTableList from '@/views/products/components/ProductTableList'
import ProductGridView from '@/views/products/components/ProductGridView'
import TableMixin from '@/mixins/Table'
import _find from 'lodash/find'
import Products from '@/assets/sample-data/products'

export default {
    name: 'products',
    mixins: [TableMixin],
    components: {
        ProductFormModal,
        ProductTableList,
        ProductGridView
    },
    data() {
        return {
            gridOn: true,
            search: null,
            tableItems: {
                products: Products,
            },
            hasSelectedItems: false
        }
    },
    methods: {
        edit(item) {
            this.$refs.productFormModal.show(item, false)
        },
        deleteItem(item) {
            swal({
                title: "Are you sure?",
                text: "You will not be able to recover this one",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    this.tableItems.products = this.cleanCollectionItems(this.tableItems.products, item)

                    swal({
                        title: "Success",
                        icon: "success",
                        text: "Product has been successfully deleted",
                    })
                }
            });
        },
        saveItem(item) {
            this.tableItems.products = this.updateCollectionItems(this.tableItems.products, item)
        },
        afterSelectedEvents(items) {
            this.hasSelectedItems = items.length ? true : false
        }
    },
}
</script>