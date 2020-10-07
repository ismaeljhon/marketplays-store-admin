<template>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="slide-x-reverse-transition" persistent>
        <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark v-bind="attrs" v-on="on" fab x-small>
                <v-icon>add</v-icon>
            </v-btn>
        </template>
        <v-card>
            <v-toolbar dark color="primary">
                <v-btn icon dark @click="reset">
                    <v-icon>close</v-icon>
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
                                                v-model="form.name"
                                                :error-messages="errors"
                                                label="Name"
                                            ></v-text-field>
                                        </ValidationProvider>
                                        <ValidationProvider v-slot="{ errors }" name="Slug" :rules="'required'">
                                            <v-text-field
                                                v-model="form.slug"
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
                                                v-model="form.workforce_threshold"
                                                :error-messages="errors"
                                                label="Workforce Threshold"
                                            ></v-text-field>
                                        </ValidationProvider>
                                        <v-text-field v-model="form.short_description">
                                            <template slot="label">
                                                Short Description <small>(optional)</small>
                                            </template>
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="6">
                                        <ValidationProvider v-slot="{ errors }" name="Product Manager" :rules="'required'">
                                            <v-autocomplete
                                                v-model="form.user_project_manager_id"
                                                :items="users"
                                                hide-no-data
                                                item-text="ownerName"
                                                item-value="ownerID"
                                                label="Product Manager"
                                                placeholder="Select Team Product Manager from the users"
                                                :error-messages="errors"
                                            ></v-autocomplete>
                                        </ValidationProvider>
                                        <ValidationProvider v-slot="{ errors }" name="Department" :rules="'required'">
                                            <v-autocomplete
                                                v-model="form.department_id"
                                                :items="departments"
                                                hide-no-data
                                                item-text="name"
                                                item-value="id"
                                                label="Department"
                                                placeholder="Select Department"
                                                :error-messages="errors"
                                            ></v-autocomplete>
                                        </ValidationProvider>
                                        <ValidationProvider v-slot="{ errors }" name="Pricing" :rules="'required|numeric'">
                                            <v-text-field
                                                type="number"
                                                v-model="form.pricing"
                                                :error-messages="errors"
                                                label="Pricing"
                                            ></v-text-field>
                                        </ValidationProvider>
                                        <v-autocomplete 
                                            v-model="form.tags" 
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
                                        <vue-editor v-model="form.description"></vue-editor>
                                    </v-col>

                                    <v-col cols="12" class="mt-5">
                                        <h3 class="mb-2">SEO</h3>
                                        <v-divider></v-divider>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field v-model="form.seo_title">
                                            <template slot="label">
                                                SEO Title <small>(optional)</small>
                                            </template>
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field
                                            v-model="form.seo_keywords"
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
                                            v-model="form.seo_description"
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
                                    <v-btn color="primary" type="submit" class="float-right">submit</v-btn>
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
import Departments from '@/assets/sample-data/departments'
import { VueEditor } from "vue2-editor";

export default {
    name: 'product-form-modal',
    components: {
        VueEditor
    },
    data() {
        return {
            dialog: false,
            isCreate: true,
            form: {
                name: null,
                description: null,
                short_description: null,
                pricing: null,
                tags: [],
                slug: null,
                workforce_threshold: null,
                seo_title: null,
                seo_keywords: null,
                seo_description: null,
                user_project_manager_id: null,
            },
            users: Users,
            departments: Departments,
            tags: ["seo", "web", "web development", "web design", "graphics"],
            tagDelimiter: ",",
            searchInput: null,
        }
    },
    methods: {
        show(item = {}, isCreate = true) {
            _assign(this, {
                item: item,
                form: JSON.parse(JSON.stringify(item)),
                isCreate: isCreate,
                dialog: true
            })
        },
        reset() {
            _assign(this, {
                form: {
                    name: null,
                    description: null,
                    short_description: null,
                    pricing: null,
                    tags: [],
                    slug: null,
                    workforce_threshold: null,
                    seo_title: null,
                    seo_keywords: null,
                    seo_description: null,
                    user_project_manager_id: null,
                },
                isCreate: true,
                dialog: false,
            })
            this.$refs.observer.reset()
        },
        submit() {
            this.$emit('saved', this.form)
            this.reset()
            swal({
                title: "Success",
                icon: "success",
                text: "Product has been successfully saved",
            })
        },
        processTagsInput(element) {
            let newValue = element.target.value.replaceAll(this.tagDelimiter, "")

            if (newValue != "" && element.key == this.tagDelimiter && this.form.tags.indexOf(newValue) < 0) {
                this.form.tags.push(newValue)
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
        "form.tags"() {
            this.searchInput = null
        }
    }
}
</script>