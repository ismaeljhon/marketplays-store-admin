<template>
    <v-card>
        <v-card-title>
            <v-row dense>
                <v-col cols="5">
                    <h3 class="mr-2"><v-icon left>mdi-domain</v-icon> Departments</h3>
                </v-col>
                <v-col cols="7" class="text-right">
                    <download-csv class="mr-2 v-btn v-btn--depressed v-btn--flat v-btn--outlined v-btn--tile theme--light v-size--small" :data="departments" style="cursor: pointer">
                        <v-icon left>mdi-download</v-icon>Export Departments
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
                :items="departments"
                :items-per-page="tableParams.options.itemsPerPage"
                v-model="tableItems.selected"
                show-select
                @input="afterSelectedEventsOnTableList"
                item-key="_id"
                loading-text="Loading please wait..."
                :loading="loading"
                :options.sync="tableParams.options"
                :server-items-length="itemsCount"
                
            >
                <template slot="item.pricing" slot-scope="row">
                    {{ row.item.pricing | currency }}
                </template>
                <template slot="item.teamLead" slot-scope="row">
                    {{ row.item.teamLead ? row.item.teamLead.fullName : "-" }}
                </template>
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
import DepartmentFormModal from '@/views/departments/modals/Department'
import TableMixin from '@/mixins/Table'
import _assign from 'lodash/assign'
import _find from 'lodash/find'
import _filter from 'lodash/filter'
import _forEach from 'lodash/forEach'

import gql from 'graphql-tag'

export default {
    name: 'departments',
    mixins: [TableMixin],
    components: {
        DepartmentFormModal,
    },
    data: () => ({
        search: null,
        headers: [
            { text: 'Code', align: 'start', value: 'code', width: "100px" },
            { text: 'Name', align: 'start', value: 'name', },
            { text: 'Pricing', align: 'start', value: 'pricing' },
            { text: 'Team Lead', align: 'start', value: 'teamLead' },
            { text: '', align: 'start', sortable: false, value: 'action', width: "100px" },
        ],
        tableParams: {
            model: 'departments',
            query: gql `{
                _id,
                name,
                code,
                pricing,
                teamLead {
                    _id,
                    fullName
                }
            }`,
            options: {
                itemsPerPage: 2,
            }
        },
        departments: [],
    }),
    methods: {
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

                    const result = await this.deleteMutation("Department", items._id)

                    if (result) {
                        swal({
                            title: "Success",
                            icon: "success",
                            text: "Department(s) has been successfully deleted",
                        })
                        this.getItems()
                        this.itemsCount--
                    }
                }
            });
        },
        get_team_lead_name(userId) {
            let user = _find(Users, o => { return o.ownerID == userId })
            return user ? user.ownerName : ""
        },
        afterSelectedEventsOnTableList(items) {
            this.tableItems.selected = items
        },
    },
    mounted() {
        this.getItems()
    },
    beforeDestroy() {
        this.clearGetItems()
    }
}
</script>