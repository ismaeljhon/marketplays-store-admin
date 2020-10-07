<template>
    <v-card>
        <v-card-title>
            <h3 class="mr-2"><v-icon>local_offer</v-icon> Products</h3>
            <product-form-modal ref="productFormModal" @saved="saveItem" />
            <v-spacer></v-spacer>
            <v-text-field
                v-model="search"
                append-icon="search"
                label="Search"
                single-line
                hide-details
            ></v-text-field>
        </v-card-title>
        <v-card-text>
            <product-table-list :items="tableItems.products" :search="search" @edit="edit" @delete="deleteItem"></product-table-list>
        </v-card-text>
    </v-card>
</template>
<script>
import ProductFormModal from '@/views/products/modals/Product'
import ProductTableList from '@/views/products/components/ProductTableList'
import TableMixin from '@/mixins/Table'
import _find from 'lodash/find'
import Products from '@/assets/sample-data/products'

export default {
    name: 'departments',
    mixins: [TableMixin],
    components: {
        ProductFormModal,
        ProductTableList
    },
    data() {
        return {
            search: null,
            headers: [
                { text: 'ID', align: 'start', value: 'id', width: "70px" },
                { text: 'Name', align: 'start', value: 'name', width: "200px"},
                { text: 'Short Description', align: 'start', value: 'short_description' },
                { text: 'Pricing', align: 'start', value: 'pricing', width: "120px" },
                { text: '', align: 'start', sortable: false, value: 'action', width: "100px" },
            ],
            tableItems: {
                products: Products,
            }
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
    }
}
</script>