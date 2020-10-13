<template>
    <v-card>
        <v-card-title>
            <v-row dense>
                <v-col cols="5">
                    <h3 class="mr-2"><v-icon>device_hub</v-icon> Job Categories</h3>
                </v-col>
                <v-col cols="7" class="text-right">
                    <download-csv class="mr-2 v-btn v-btn--depressed v-btn--flat v-btn--outlined v-btn--tile theme--light v-size--small" :data="jobCategories" style="cursor: pointer">
                        <v-icon left>backup</v-icon>  Export Job Categories
                    </download-csv>
                    <job-category-form-modal ref="jobCategoryFormModal" @saved="saveItem" />
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
                :items="jobCategories"
                :items-per-page="5"
                v-model="tableItems.selected"
                show-select
                @input="afterSelectedEventsOnTableList"
            >
                <template slot="item.action" slot-scope="row">
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn small icon v-bind="attrs" v-on="on" color="info" class="mr-2" @click.prevent="$refs.jobCategoryFormModal.show(row.item, false)">
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
import JobCategoryFormModal from '@/views/job_categories/modals/JobCategory'
import TableMixin from '@/mixins/Table'
import _filter from 'lodash/filter'
import JobCategories from '@/assets/sample-data/job_categories'

export default {
    name: 'job-categories',
    mixins: [TableMixin],
    components: {
        JobCategoryFormModal,
    },
    data() {
        return {
            search: null,
            headers: [
                { text: 'ID', align: 'start', value: 'id', width: "70px" },
                { text: 'Name', align: 'start', value: 'name', },
                { text: '', align: 'start', sortable: false, value: 'action', width: "100px" },
            ],
            tableItems: {
                jobCategories: JobCategories,
                selected: []
            },
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
                    this.tableItems.jobCategories = this.cleanCollectionItems(this.tableItems.jobCategories, item)

                    swal({
                        title: "Success",
                        icon: "success",
                        text: "Job category deleted",
                    })
                }
            });
        },
        saveItem(item) {
            this.tableItems.jobCategories = this.updateCollectionItems(this.tableItems.jobCategories, item)
        },
        afterSelectedEventsOnTableList(items) {
            this.tableItems.selected = items
        },
    },
    computed: {
        jobCategories() {
            this.tableItems.selected = _filter(this.tableItems.jobCategories, { is_selected: true })
            return this.tableItems.jobCategories
        },
    },
}
</script>