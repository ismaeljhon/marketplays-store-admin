<template>
    <v-card>
        <v-card-title>
            <v-row dense>
                <v-col cols="5">
                    <h3 class="mr-2"><v-icon>work_outline</v-icon> Job Listing</h3>
                </v-col>
                <v-col cols="7" class="text-right">
                    <v-btn small class="mr-2" outlined tile><v-icon left>backup</v-icon> Export Jobs</v-btn>
                    <job-form-modal ref="jobFormModal" @saved="saveItem" />
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
                :items="jobs"
                :items-per-page="5"
                v-model="tableItems.selected"
                show-select
                @input="afterSelectedEventsOnTableList"
            >
                <template slot="item.action" slot-scope="row">
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn small icon v-bind="attrs" v-on="on" color="info" class="mr-2" @click.prevent="$refs.jobFormModal.show(row.item, false)">
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
import JobFormModal from '@/views/jobs/modals/Job'
import TableMixin from '@/mixins/Table'
import _filter from 'lodash/filter'
import Jobs from '@/assets/sample-data/jobs'

export default {
    name: 'jobs',
    mixins: [TableMixin],
    components: {
        JobFormModal,
    },
    data() {
        return {
            search: null,
            headers: [
                { text: 'ID', align: 'start', value: 'id', width: "70px" },
                { text: 'Title', align: 'start', value: 'title', width: "200px" },
                { text: 'Description', align: 'start', value: 'description' },
                { text: '', align: 'start', sortable: false, value: 'action', width: "100px" },
            ],
            tableItems: {
                jobs: Jobs,
            }
        }
    },
    methods: {
        deleteItems(item) {
            swal({
                title: "Are you sure?",
                text: "You will not be able to recover this one",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    this.tableItems.jobs = this.cleanCollectionItems(this.tableItems.jobs, item)

                    swal({
                        title: "Success",
                        icon: "success",
                        text: "Job deleted",
                    })
                }
            });
        },
        saveItem(item) {
            this.tableItems.jobs = this.updateCollectionItems(this.tableItems.jobs, item)
        },
        afterSelectedEventsOnTableList(items) {
            this.tableItems.selected = items
        },
    },
    computed: {
        jobs() {
            this.tableItems.selected = _filter(this.tableItems.jobs, { is_selected: true })
            return this.tableItems.jobs
        },
    },
}
</script>