<template>
    <v-card>
        <v-card-title>
            <h3 class="mr-2"><v-icon>mail_outline</v-icon> Email Templates</h3>
            <email-template-form-modal ref="emailTemplateFormModal" @saved="saveItem" />
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
                :items="tableItems.emailTemplates"
                :items-per-page="5"
                class="elevation-1"
            >
                
                <template slot="item.action" slot-scope="row">
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn small icon v-bind="attrs" v-on="on" color="info" class="mr-2" @click.prevent="$refs.emailTemplateFormModal.show(row.item, false)">
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
import EmailTemplateFormModal from '@/views/email_templates/modals/EmailTemplate'
import TableMixin from '@/mixins/Table'
import _assign from 'lodash/assign'
import _find from 'lodash/find'
import EmailTemplates from '@/assets/sample-data/email_templates'

export default {
    name: 'email-templates',
    mixins: [TableMixin],
    components: {
        EmailTemplateFormModal,
    },
    data() {
        return {
            search: null,
            headers: [
                { text: 'ID', align: 'start', value: 'id', width: "70px" },
                { text: 'Template Name', align: 'start', value: 'name', },
                { text: 'Content', align: 'start', value: 'content', },
                { text: '', align: 'start', sortable: false, value: 'action', width: "100px" },
            ],
            tableItems: {
                emailTemplates: EmailTemplates,
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
                    this.tableItems.emailTemplates = this.cleanCollectionItems(this.tableItems.emailTemplates, item)

                    swal({
                        title: "Success",
                        icon: "success",
                        text: "Email Template has been successfully deleted",
                    })
                }
            });
        },
        saveItem(item) {
            this.tableItems.emailTemplates = this.updateCollectionItems(this.tableItems.emailTemplates, item)
        },
    }
}
</script>