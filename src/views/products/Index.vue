<template>
    <v-card>
        <v-card-title>
            <h3 class="mr-2">Products</h3>
            <department-form-modal ref="deparmentFormModal" @saved="saveItem" />
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
            <v-data-table
                :search="search"
                :headers="headers"
                :items="tableItems.products"
                :items-per-page="5"
                class="elevation-1"
            >
                <template slot="item.pricing" slot-scope="row">
                    {{ row.item.pricing | currency }}
                </template>
                <template slot="item.action" slot-scope="row">
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn small icon v-bind="attrs" v-on="on" color="info" class="mr-2" @click.prevent="$refs.deparmentFormModal.show(row.item, false)">
                                <v-icon>edit</v-icon>
                            </v-btn>
                        </template>
                        <span>Edit this item</span>
                    </v-tooltip>
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn small icon v-bind="attrs" v-on="on" color="error" @click.prevent="deleteItem(row.item)">
                                <v-icon>close</v-icon>
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
import DepartmentFormModal from '@/views/departments/modals/Department'
import TableMixin from '@/mixins/Table'
import _assign from 'lodash/assign'
import _find from 'lodash/find'
import Users from '@/assets/sample-data/users'
import Products from '@/assets/sample-data/products'

export default {
    name: 'departments',
    mixins: [TableMixin],
    components: {
        DepartmentFormModal,
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
        get_manager_name(userId) {
            let user = _find(Users, o => { return o.ownerID == userId })
            return user ? user.ownerName : ""
        }
    }
}
</script>