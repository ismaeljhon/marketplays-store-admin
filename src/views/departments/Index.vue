<template>
    <v-card>
        <v-card-title>
            <v-row dense>
                <v-col cols="5">
                    <h3 class="mr-2"><v-icon>business</v-icon> Departments</h3>
                </v-col>
                <v-col cols="7" class="text-right">
                    <v-btn small class="mr-2" outlined tile><v-icon left>backup</v-icon> Export Departments</v-btn>
                    <department-form-modal ref="deparmentFormModal" @saved="saveItem" />
                </v-col>
                <v-col cols="12">
                    <v-divider class="my-2"></v-divider>
                </v-col>
                <v-col cols="6">
                    <v-btn v-if="hasSelectedItems" outlined small tile color="error" @click.prevent="deleteItems(tableItems.selected)">
                        <v-icon left>close</v-icon> Delete Selected
                    </v-btn>
                    <v-spacer v-else></v-spacer>
                </v-col>
                <v-col cols="6">
                    <v-text-field dense filled single-line hide-details v-model="search" append-icon="search" label="Search"></v-text-field>
                </v-col>
                    
            </v-row>
            
        </v-card-title>
        <v-card-text>
            <v-data-table
                :search="search"
                :headers="headers"
                :items="departments"
                :items-per-page="5"
                class="elevation-1"
                v-model="tableItems.selected"
                show-select
                @input="afterSelectedEventsOnTableList"
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
                            <v-btn small icon v-bind="attrs" v-on="on" color="info" class="mr-2" @click.prevent="$refs.deparmentFormModal.show(row.item, false)">
                                <v-icon>edit</v-icon>
                            </v-btn>
                        </template>
                        <span>Edit this item</span>
                    </v-tooltip>
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn small icon v-bind="attrs" v-on="on" color="error" @click.prevent="deleteItems(row.item)">
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
import _filter from 'lodash/filter'
import Users from '@/assets/sample-data/users'
import Departments from '@/assets/sample-data/departments'

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
                { text: '', align: 'start', sortable: false, value: 'action', width: "100px" },
            ],
            tableItems: {
                departments: Departments,
                selected: []
            }
        }
    },
    methods: {
        deleteItems(items) {
            swal({
                title: "Are you sure?",
                text: "You will not be able to recover this one",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    this.tableItems.departments = this.cleanCollectionItems(this.tableItems.departments, items)

                    swal({
                        title: "Success",
                        icon: "success",
                        text: "Department(s) has been successfully deleted",
                    })
                }
            });
        },
        saveItem(item) {
            this.tableItems.departments = this.updateCollectionItems(this.tableItems.departments, item)
        },
        get_team_lead_name(userId) {
            let user = _find(Users, o => { return o.ownerID == userId })
            return user ? user.ownerName : ""
        },
        afterSelectedEventsOnTableList(items) {
            this.tableItems.selected = items
        },
    },
    computed: {
        departments() {
            this.tableItems.selected = _filter(this.tableItems.departments, { is_selected: true })
            return this.tableItems.departments
        },
    },
}
</script>