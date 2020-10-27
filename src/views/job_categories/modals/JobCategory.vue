<template>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition" persistent>
        <template v-slot:activator="{ on, attrs }">
             <v-btn color="primary" tile dark v-bind="attrs" v-on="on" small>
                <v-icon left>mdi-plus</v-icon>Add Job Category
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
                                        <ValidationProvider v-slot="{ errors }" name="Name" :rules="'required'">
                                            <v-text-field
                                                v-model="jobCategory.name"
                                                :error-messages="errors"
                                                label="Name"
                                            ></v-text-field>
                                        </ValidationProvider>
                                        <ValidationProvider v-slot="{ errors }" name="Slug" :rules="'required'">
                                            <v-text-field
                                                v-model="jobCategory.slug"
                                                :error-messages="errors"
                                                label="Url"
                                                hint="This would be used for pretty url"
                                                persistent-hint
                                                class="mb-3"
                                            ></v-text-field>
                                        </ValidationProvider>
                                    </v-col>
                                    <v-col cols="6">
                                        <h3 class="mb-2">SEO</h3>
                                        <v-divider class="mb-5"></v-divider>
                                        <v-text-field v-model="jobCategory.seoTitle">
                                            <template slot="label">
                                                SEO Title <small>(optional)</small>
                                            </template>
                                        </v-text-field>
                                        <v-text-field
                                            v-model="jobCategory.seoKeywords"
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
                                            v-model="jobCategory.seoDescription"
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
                                    <v-btn color="primary" type="submit" class="float-right">Save</v-btn>
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
import gql from 'graphql-tag'

export default {
    name: 'job-category-form-modal',
    apollo: {
        jobCategory: {
            query: gql`
                query jobCategory ($id: MongoID!) {
                    jobCategory (
                        _id: $id
                    ) {
                        _id,
                        name,
                        slug,
                        seoTitle,
                        seoKeywords,
                        seoDescription,
                    }
                }
            `,
            variables() {
                return {
                    id: this.id
                }
            },
            update(data) {
                return data.jobCategory
            },
            skip () {
                return true
            }
        },
    },
    data() {
        return {
            dialog: false,
            isCreate: true,
            jobCategory: {
                name: null,
                slug: null,
                seoTitle: null,
                seoKeywords: null,
                seoDescription: null,
            },
        }
    },
    methods: {
        async show(id, isCreate = true) {
            this.id = id
            await this.$apollo.queries.jobCategory.start()

            _assign(this, {
                isCreate: isCreate,
                dialog: true
            })
        },
        reset() {
            this.$apollo.queries.jobCategory.stop()

            _assign(this, {
                jobCategory: {
                    name: null,
                    slug: null,
                    seoTitle: null,
                    seoKeywords: null,
                    seoDescription: null,
                },
                isCreate: true,
                dialog: false
            })
            this.$refs.observer.reset()
        },
        async submit() {
            let allowedFields = ["name", "slug", "seoTitle", "seoKeywords", "seoDescription"]

            let allowedItems = this.getAllowedItems(this.jobCategory, allowedFields)
            
            let result = null
            if (this.jobCategory._id) {
                result = await this.updateMutation('JobCategory', allowedItems, this.jobCategory._id)
            } else {
                result = await this.createMutation('JobCategory', allowedItems)
            }

            if (result) {
                this.$emit('saved')
                this.reset()
                swal({
                    title: "Success",
                    icon: "success",
                    text: "Job Category has been successfully saved",
                })
            }
        }
    },
    computed: {
        title() {
            return this.isCreate ? "Adding New Job Categories" : "Job Categories"
        }
    }
}
</script>