<template>
    <v-card>
        <v-card-title>
            <v-row dense>
                <v-col cols="5">
                    <h3 class="mr-2"><v-icon left>mdi-format-list-bulleted-type</v-icon>Job Listing</h3>
                </v-col>
                <v-col cols="7" class="text-right">
                    <download-csv class="mr-2 v-btn v-btn--depressed v-btn--flat v-btn--outlined v-btn--tile theme--light v-size--small" :data="jobs" style="cursor: pointer">
                        <v-icon left>mdi-download</v-icon>Export Jobs
                    </download-csv>
                    <job-form-modal ref="jobFormModal" @saved="$apollo.queries.jobs.refetch()" />
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
                :items="jobs"
                :items-per-page="5"
                v-model="tableItems.selected"
                show-select
                @input="afterSelectedEventsOnTableList"
                :loading="$apollo.queries.jobs.loading"
                loading-text="Loading please wait..."
            >
                <template slot="item.action" slot-scope="row">
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn small icon v-bind="attrs" v-on="on" color="primary" @click.prevent="$refs.jobFormModal.show(row.item._id, false)">
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
import JobFormModal from '@/views/jobs/modals/Job'
import TableMixin from '@/mixins/Table'
import _filter from 'lodash/filter'
import gql from 'graphql-tag'
import _forEach from 'lodash/forEach'

export default {
    name: 'jobs',
    apollo: {
        jobs: {
            query: gql`
                query {
                    jobs {
                        _id,
                        title,
                        description,
                    }
                }
            `,
            update(data) {
                _forEach(data.jobs, o => { o.is_selected = false })
                return data.jobs
            },
        }
    },
    mixins: [TableMixin],
    components: {
        JobFormModal,
    },
    data() {
        return {
            search: null,
            headers: [
                { text: 'Title', align: 'start', value: 'title', width: "200px" },
                { text: 'Description', align: 'start', value: 'description' },
                { text: '', align: 'start', sortable: false, value: 'action', width: "100px" },
            ],
            tableItems: {
                selected: [],
            },
            jobs: []
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
            .then(async (willDelete) => {
                if (willDelete) {
                    const result = await this.deleteMutation("Job", items._id)

                    if (result) {
                        swal({
                            title: "Success",
                            icon: "success",
                            text: "Job(s) has been successfully deleted",
                        })
                        this.$apollo.queries.jobs.refetch()
                    } else {

                    }
                }
            });
        },
        afterSelectedEventsOnTableList(items) {
            this.tableItems.selected = items
        },
    },
    watch: {
        "tableItems.jobs"() {
            console.log("triggered")
        }
    }
}
</script>