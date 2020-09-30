<template>
    <v-card>
        <v-card-title>
            <h3 class="mr-2">Departments</h3>
            <department-form-modal />
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
                :items="tableItems.departments"
                :items-per-page="5"
                class="elevation-1"
            >
                <template slot="item.action" slot-scope="row">
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn small tile outlined v-bind="attrs" v-on="on" color="info" class="mr-2">
                                <v-icon small>edit</v-icon>
                            </v-btn>
                        </template>
                        <span>Edit this item</span>
                    </v-tooltip>
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn small tile outlined v-bind="attrs" v-on="on" color="error" @click.prevent="deleteItem(row.item)">
                                <v-icon small>delete</v-icon>
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
                { text: 'Code', align: 'start', value: 'code', width: "100px" },
                { text: 'Name', align: 'start', value: 'name', },
                { text: 'Pricing', align: 'start', value: 'pricing' },
                { text: 'Team Lead', align: 'start', value: 'team_lead' },
                { text: '', align: 'start', sortable: false, value: 'action', width: "140px" },
            ],
            tableItems: {
                departments: [
                    { id: 1, name: "Systems/IT", code: "SYS", pricing: "$1000 CAD", team_lead: "Eugenio Nadela"},
                    { id: 2, name: "Marketing", code: "MKG", pricing: "$900 CAD", team_lead: "Adnan Fasih"},
                    { id: 3, name: "Wellth", code: "WTH", pricing: "$1500 CAD", team_lead: "Jason Bickert"},
                    { id: 4, name: "Customer Service", code: "CS", pricing: "$1500 CAD", team_lead: "Michael Bickert"},
                    { id: 5, name: "Administration", code: "ADM", pricing: "$1000 CAD", team_lead: "Michael Bickert"},
                    { id: 6, name: "Accounting", code: "ACT", pricing: "$1000 CAD", team_lead: "Rolando Valdrez"},
                    { id: 7, name: "Human Resources", code: "HR", pricing: "$1000 CAD", team_lead: "Michael Bickert"},
                ],
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
                    this.tableItems.departments = this.cleanCollectionItems(this.tableItems.departments, item)

                    swal({
                        title: "Success",
                        icon: "success",
                        text: "Department has been successfully deleted",
                    })
                }
            });
        }
    }
}
</script>