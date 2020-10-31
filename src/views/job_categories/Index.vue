<template>
    <v-card>
        <v-card-title>
            <v-row dense>
                <v-col cols="5">
                    <h3 class="mr-2"><v-icon left>mdi-shape-outline</v-icon> Job Categories</h3>
                </v-col>
                <v-col cols="7" class="text-right">
                    <download-csv class="mr-2 v-btn v-btn--depressed v-btn--flat v-btn--outlined v-btn--tile theme--light v-size--small" :data="jobCategories" style="cursor: pointer">
                        <v-icon left>mdi-download</v-icon>Export Job Categories
                    </download-csv>
                    <job-category-form-modal ref="jobCategoryFormModal" @saved="$apollo.queries.jobCategories.refetch()" />
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
                :items="jobCategories"
                v-model="tableItems.selected"
                show-select
                @input="afterSelectedEventsOnTableList"
                :loading="loading"
                loading-text="Loading please wait..."
                :options.sync="tableParams.options"
                :server-items-length="itemsCount"
            >
                <template slot="item.action" slot-scope="row">
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn small icon v-bind="attrs" v-on="on" color="info" @click.prevent="$refs.jobCategoryFormModal.show(row.item._id, false)">
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
import JobCategoryFormModal from '@/views/job_categories/modals/JobCategory'
import TableMixin from '@/mixins/Table'
import _filter from 'lodash/filter'
import _forEach from 'lodash/forEach'
import gql from 'graphql-tag'

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
                { text: 'Category Name', align: 'start', value: 'name', },
                { text: '', align: 'start', sortable: false, value: 'action', width: "100px" },
            ],
            tableParams: {
                model: 'jobCategories',
                query: gql `{
                    _id,
                    name,
                }`,
            },
            tableItems: {
                selected: []
            },
            jobCategories: [],
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
                    const result = await this.deleteMutation("JobCategory", items._id)

                    if (result) {
                        swal({
                            title: "Success",
                            icon: "success",
                            text: "Job Category(s) has been successfully deleted",
                        })
                        this.getItems()
                        this.itemsCount--
                    } else {

                    }
                }
            });
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