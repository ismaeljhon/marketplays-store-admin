<template>
    <v-card>
        <v-card-title>
            <h3 class="mr-2">Job Categories</h3>
            <job-category-form-modal ref="jobCategoryFormModal" @saved="saveItem" />
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
                :items="tableItems.jobCategories"
                :items-per-page="5"
                class="elevation-1"
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
import JobCategoryFormModal from '@/views/job_categories/modals/JobCategory'
import TableMixin from '@/mixins/Table'
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
            },
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
    }
}
</script>