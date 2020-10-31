<template>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="slide-x-reverse-transition" persistent>
        <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" tile dark v-bind="attrs" v-on="on" small>
                <v-icon left>mdi-plus</v-icon>Add Product
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
                                    <v-col cols="12">
                                        <h3 class="mb-2">General Information</h3>
                                        <v-divider></v-divider>
                                    </v-col>
                                    <v-col cols="6">
                                        <ValidationProvider v-slot="{ errors }" name="Name" :rules="'required'">
                                            <v-text-field
                                                v-model="product.name"
                                                :error-messages="errors"
                                                label="Name"
                                            ></v-text-field>
                                        </ValidationProvider>
                                        <ValidationProvider v-slot="{ errors }" name="Slug" :rules="'required'">
                                            <v-text-field
                                                v-model="product.slug"
                                                :error-messages="errors"
                                                label="Url"
                                                hint="This would be used for pretty url"
                                                persistent-hint
                                                class="mb-3"
                                            ></v-text-field>
                                        </ValidationProvider>
                                        <ValidationProvider v-slot="{ errors }" name="Workforce Threshold" :rules="'required|numeric'">
                                            <v-text-field
                                                type="number"
                                                v-model="product.workforceThreshold"
                                                :error-messages="errors"
                                                label="Workforce Threshold"
                                            ></v-text-field>
                                        </ValidationProvider>
                                        <v-text-field v-model="product.shortDescription">
                                            <template slot="label">
                                                Short Description <small>(optional)</small>
                                            </template>
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-autocomplete
                                            v-model="product.department"
                                            :items="departments"
                                            hide-no-data
                                            item-text="name"
                                            item-value="_id"
                                            label="Department"
                                            placeholder="Select Department"
                                        ></v-autocomplete>
                                        <ValidationProvider v-slot="{ errors }" name="Product Manager" :rules="'required'">
                                            <v-autocomplete
                                                v-model="product.projectManager"
                                                :items="users"
                                                hide-no-data
                                                item-text="fullName"
                                                item-value="_id"
                                                label="Product Manager"
                                                placeholder="Select Team Product Manager from the users"
                                                :error-messages="errors"
                                            ></v-autocomplete>
                                        </ValidationProvider>
                                        <ValidationProvider v-slot="{ errors }" name="Pricing" :rules="'required|numeric'">
                                            <v-text-field
                                                type="number"
                                                v-model="product.pricing"
                                                :error-messages="errors"
                                                label="Pricing"
                                            ></v-text-field>
                                        </ValidationProvider>
                                        <v-autocomplete 
                                            v-model="product.tags" 
                                            :items="tags" 
                                            @keydown="processTagsInput"
                                            multiple
                                            chips
                                            deletable-chips
                                            hide-selected
                                            persistent-hint
                                            hide-no-data
                                            hint="Type then press comma (,) to add"
                                            :search-input.sync="searchInput"
                                        >
                                            <template slot="label">
                                                Tags <small>(optional)</small>
                                            </template>
                                        </v-autocomplete>
                                    </v-col>
                                    <v-col cols="12">
                                        <p class="my-2">Description <small>(optional)</small></p>
                                        <vue-editor v-model="product.description"></vue-editor>
                                    </v-col>

                                    <v-col cols="12" class="mt-5">
                                        <h3 class="mb-2">SEO</h3>
                                        <v-divider></v-divider>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field v-model="product.seoTitle">
                                            <template slot="label">
                                                SEO Title <small>(optional)</small>
                                            </template>
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field
                                            v-model="product.seoKeywords"
                                            label="SEO Keywords"
                                            hint="Enter keywords related to your product."
                                            persistent-hint
                                            class="mb-3"
                                        >
                                            <template slot="label">
                                                SEO Keywords <small>(optional)</small>
                                            </template>
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-textarea 
                                            v-model="product.seoDescription"
                                            hint="Type a description that summarizes your product.."
                                            persistent-hint
                                            class="mb-5"
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
import { VueEditor } from "vue2-editor";
import gql from 'graphql-tag'

export default {
    name: 'product-form-modal',
    components: {
        VueEditor
    },
    apollo: {
        product: {
            query: gql`
                query product ($id: MongoID!) {
                    service (
                        _id: $id
                    ) {
                        _id,
                        name,
                        description,
                        shortDescription,
                        pricing,
                        tags,
                        slug,
                        workforceThreshold,
                        seoTitle,
                        seoKeywords,
                        seoDescription,
                        projectManager,
                    }
                }
            `,
            variables() {
                return {
                    id: this.id
                }
            },
            update(data) {
                return data.service
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
        },
        departments: {
            query: gql`
                query {
                    departments {
                        _id,
                        name,
                    }
                }
            `,
            update(data) {
                return data.departments
            }
        }
    },
    data() {
        return {
            id: null,
            dialog: false,
            isCreate: true,
            product: {
                name: null,
                description: null,
                shortDescription: null,
                pricing: null,
                tags: [],
                slug: null,
                workforceThreshold: null,
                seoTitle: null,
                seoKeywords: null,
                seoDescription: null,
                projectManager: null,
                department: null,
            },
            tags: ["seo", "web", "web development", "web design", "graphics"],
            tagDelimiter: ",",
            searchInput: null,
        }
    },
    methods: {
        async show(id, isCreate = true) {
            this.id = id
            await this.$apollo.queries.product.start()

            _assign(this, {
                isCreate: isCreate,
                dialog: true
            })
        },
        reset() {
            this.$apollo.queries.product.stop()

            _assign(this, {
                product: {
                    name: null,
                    description: null,
                    shortDescription: null,
                    pricing: null,
                    tags: [],
                    slug: null,
                    workforceThreshold: null,
                    seoTitle: null,
                    seoKeywords: null,
                    seoDescription: null,
                    projectManager: null,
                    department: null,
                },
                isCreate: true,
                dialog: false,
            })
            this.$refs.observer.reset()
        },
        async submit() {
            let allowedFields = ["name", "description", "shortDescription", "pricing", "tags", "slug", "workforceThreshold", "seoTitle", "seoKeywords", "seoDescription", "projectManager", "department"]
            this.product.pricing = parseFloat(this.product.pricing)
            this.product.workforceThreshold = parseFloat(this.product.workforceThreshold)

            let allowedItems = this.getAllowedItems(this.product, allowedFields)
            
            let result = null
            if (this.product._id) {
                result = await this.updateMutation('Service', allowedItems, this.product._id)
            } else {
                result = await this.createMutation('Service', allowedItems)
            }

            if (result) {
                this.$emit('saved')
                this.reset()
                swal({
                    title: "Success",
                    icon: "success",
                    text: "Product/Service has been successfully saved",
                })
            }
        },
        processTagsInput(element) {
            let newValue = element.target.value.replaceAll(this.tagDelimiter, "")

            if (newValue != "" && element.key == this.tagDelimiter && this.product.tags.indexOf(newValue) < 0) {
                this.product.tags.push(newValue)
                this.tags.push(newValue)
            }

            if (element.target.value == this.tagDelimiter) {
                this.searchInput = null
            }
        }
    },
    computed: {
        title() {
            return this.isCreate ? "Adding New Product" : "Product"
        }
    },
    watch: {
        "product.tags"() {
            this.searchInput = null
        }
    }
}
</script>