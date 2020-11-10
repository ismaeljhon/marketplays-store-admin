<template>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition" persistent>
        <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" tile dark v-bind="attrs" v-on="on" small>
                <v-icon left>mdi-plus</v-icon>Add Department
            </v-btn>
        </template>
        <v-card>
            <v-toolbar dark color="primary">
                <v-btn icon dark @click="reset">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <v-toolbar-title>{{ title }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn dark text @click="$refs.observer.handleSubmit(submit)">Save</v-btn>
                </v-toolbar-items>
            </v-toolbar>
            
            <v-card-text>
                <v-row>
                    <v-col cols="12">
                        <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
                            <form @submit.prevent="handleSubmit(submit)">
                                <v-row>
                                    <v-col cols="6">
                                        <h3 class="mb-2">General Information</h3>
                                        <v-divider class="mb-5"></v-divider>
                                        <v-autocomplete
                                            v-model="department.teamLead"
                                            :items="users"
                                            hide-no-data
                                            item-text="fullName"
                                            item-value="_id"
                                            placeholder="Select Team Lead from the users"
                                        >
                                            <template slot="label">
                                                Team Lead <small>(optional)</small>
                                            </template>
                                        </v-autocomplete>
                                        <ValidationProvider v-slot="{ errors }" name="Code" :rules="'required'">
                                            <v-text-field
                                                v-model="department.code"
                                                :error-messages="errors"
                                                label="Code"
                                            ></v-text-field>
                                        </ValidationProvider>
                                        <ValidationProvider v-slot="{ errors }" name="Name" :rules="'required'">
                                            <v-text-field
                                                v-model="department.name"
                                                :error-messages="errors"
                                                label="Name"
                                            ></v-text-field>
                                        </ValidationProvider>
                                        <ValidationProvider v-slot="{ errors }" name="Slug" :rules="'required'">
                                            <v-text-field
                                                v-model="department.slug"
                                                :error-messages="errors"
                                                label="Url"
                                                hint="This would be used for pretty url"
                                                persistent-hint
                                                class="mb-3"
                                            ></v-text-field>
                                        </ValidationProvider>
                                        <ValidationProvider v-slot="{ errors }" name="Pricing" :rules="'required|numeric'">
                                            <v-text-field
                                                type="number"
                                                v-model="department.pricing"
                                                :error-messages="errors"
                                                label="Pricing"
                                            ></v-text-field>
                                        </ValidationProvider>
                                        <v-textarea 
                                            v-model="department.description" 
                                            label="Description">
                                            <template slot="label">
                                                Description <small>(optional)</small>
                                            </template>
                                        </v-textarea>
                                    </v-col>
                                    <v-col cols="6">
                                        <h3 class="mb-2">SEO</h3>
                                        <v-divider class="mb-5"></v-divider>
                                        <v-text-field v-model="department.seoTitle">
                                            <template slot="label">
                                                SEO Title <small>(optional)</small>
                                            </template>
                                        </v-text-field>
                                        <v-text-field
                                            v-model="department.seoKeywords"
                                            label="SEO Keywords"
                                            hint="Enter keywords related to your product."
                                            persistent-hint
                                            class="mb-3"
                                        >
                                            <template slot="label">
                                                SEO Keywords <small>(optional)</small>
                                            </template>
                                        </v-text-field>
                                        <v-textarea 
                                            v-model="department.seoDescription"
                                            hint="Type a description that summarizes your product.."
                                            persistent-hint
                                        >
                                            <template slot="label">
                                                SEO Description <small>(optional)</small>
                                            </template>
                                        </v-textarea>
                                    </v-col>
                                </v-row>
                                
                                <div class="mt-2">
                                    <v-btn @click.prevent="reset">cancel</v-btn>
                                    <v-btn color="primary" type="submit" class="float-right">save</v-btn>
                                </div>
                            </form>
                        </ValidationObserver>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
<script>
import _assign from 'lodash/assign'
import Users from '@/assets/sample-data/users'
import gql from 'graphql-tag'

export default {
    name: 'department-form-modal',
    apollo: {
        department: {
            query: gql`
                query department ($id: MongoID!) {
                    department(
                        _id: $id
                    ) {
                        _id,
                        name,
                        code,
                        slug,
                        description,
                        pricing,
                        seoTitle,
                        seoDescription,
                        seoKeywords,
                        teamLead {
                            _id
                        }
                    }
                }
            `,
            variables() {
                return {
                    id: this.id
                }
            },
            update(data) {
                if (data.department.teamLead) {
                    data.department.teamLead = data.department.teamLead._id
                }
                return data.department
            },
            skip () {
                return true
            }
        },
        users: {
            query: gql`
                query {
                    users {
                        _id
                        fullName
                    }
                }
            `,
            update(data) {
                return data.users
            },
        }
    },
    data() {
        return {
            dialog: false,
            isCreate: true,
            id: null,
            department: {
                name: null,
                code: null,
                description: null,
                slug: null,
                pricing: null,
                seoTitle: null,
                seoKeywords: null,
                seoDescription: null,
                teamLead: {
                    _id: null
                },
            },
        } 
    },
    methods: {
        async show(id, isCreate = true) {
            this.id = id
            await this.$apollo.queries.department.start()

            _assign(this, {
                isCreate: isCreate,
                dialog: true
            })
        },
        reset() {
            this.$apollo.queries.department.stop()
            
            _assign(this, {
                id: null,
                department: {
                    name: null,
                    code: null,
                    description: null,
                    slug: null,
                    pricing: null,
                    seoTitle: null,
                    seoKeywords: null,
                    seoDescription: null,
                    teamLead: {
                        _id: null,
                        fullName: null,
                        email: null
                    },
                },
                isCreate: true,
                dialog: false,
                item: {
                    id: null
                },
            })
            this.$refs.observer.reset()
        },
        async submit() {
            let allowedFields = ["name", "code", "description", "slug", "pricing", "seoTitle", "seoKeywords", "seoDescription", "teamLead"]
            this.department.pricing = parseFloat(this.department.pricing)

            let allowedItems = this.getAllowedItems(this.department, allowedFields)
            
            let result = null
            if (this.department._id) {
                result = await this.updateMutation('Department', allowedItems, this.department._id)
            } else {
                result = await this.createMutation('Department', allowedItems)
            }

            if (result) {
                this.$emit('saved')
                this.reset()
                swal({
                    title: "Success",
                    icon: "success",
                    text: "Department has been successfully saved",
                })
            }
        }
    },
    computed: {
        title() {
            return this.isCreate ? "Adding New Department" : "Department"
        },
    }
}
</script>