<template>
    <v-card>
        <v-card-title>
            <h3 class="mr-2">Departments</h3>
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
                :items="tableItems.departments"
                :items-per-page="5"
                class="elevation-1"
            >
                <template slot="item.pricing" slot-scope="row">
                    {{ row.item.pricing | currency }}
                </template>
                <template slot="item.user_team_lead_id" slot-scope="row">
                    {{ get_team_lead_name(row.item.user_team_lead_id) }}
                </template>
                <template slot="item.action" slot-scope="row">
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn small tile outlined v-bind="attrs" v-on="on" color="info" class="mr-2" @click.prevent="$refs.deparmentFormModal.show(row.item, false)">
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
import _find from 'lodash/find'
import Users from '@/assets/sample-data/users'

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
                { text: 'Team Lead', align: 'start', value: 'user_team_lead_id' },
                { text: '', align: 'start', sortable: false, value: 'action', width: "140px" },
            ],
            tableItems: {
                departments: [
                    { id: 1, name: "Systems/IT", code: "SYS", pricing: "1000", team_lead: "Eugenio Nadela", user_team_lead_id: "488783000000146001" },
                    { id: 2, name: "Marketing", code: "MKG", pricing: "900", team_lead: "Adnan Fasih", user_team_lead_id: "488783000001385005" },
                    { id: 3, name: "Wellth", code: "WTH", pricing: "1500", team_lead: "Jason Bickert", user_team_lead_id: "488783000000328001" },
                    { id: 4, name: "Customer Service", code: "CS", pricing: "1500", team_lead: "Michael Bickert", user_team_lead_id: "488783000000135005" },
                    { id: 5, name: "Administration", code: "ADM", pricing: "1000", team_lead: "Michael Bickert", user_team_lead_id: "488783000000135005" },
                    { id: 6, name: "Accounting", code: "ACT", pricing: "1000", team_lead: "Rolando Valdrez", user_team_lead_id: "488783000000383001" },
                    { id: 7, name: "Human Resources", code: "HR", pricing: "1000", team_lead: "Michael Bickert", user_team_lead_id: "488783000000135005" },
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
        },
        saveItem(item) {
            this.tableItems.departments = this.updateCollectionItems(this.tableItems.departments, item)
        },
        get_team_lead_name(userId) {
            let user = _find(Users, o => { return o.ownerID == userId })

            console.log(user)

            return user ? user.ownerName : ""
        }
    }
}
</script>