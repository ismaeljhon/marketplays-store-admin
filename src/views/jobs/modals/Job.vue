<template>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition" persistent>
        <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark v-bind="attrs" v-on="on" small>
                <v-icon left>add</v-icon> Add Job
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
                                        <ValidationProvider v-slot="{ errors }" name="Title" :rules="'required'">
                                            <v-text-field
                                                v-model="form.title"
                                                :error-messages="errors"
                                                label="Title"
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
                                        <ValidationProvider v-slot="{ errors }" name="Job Type" :rules="'required'">
                                            <v-select
                                                :items="jobTypes"
                                                label="Job Type"
                                                :error-messages="errors"
                                                v-model="form.job_type_id"
                                                item-text="name"
                                                item-value="id"
                                            ></v-select>
                                        </ValidationProvider>
                                        <ValidationProvider v-slot="{ errors }" name="Category" :rules="'required'">
                                            <v-select
                                                :items="jobCategories"
                                                label="Category"
                                                :error-messages="errors"
                                                v-model="form.job_category_id"
                                                item-text="name"
                                                item-value="id"
                                            ></v-select>
                                        </ValidationProvider>
                                    </v-col>
                                    <v-col cols="6">
                                        <ValidationProvider v-slot="{ errors }" name="Open for Bid?" :rules="'required'">
                                            <v-select
                                                :items="canBidItems"
                                                label="Open for Bid?"
                                                :error-messages="errors"
                                                v-model="form.biddable"
                                            ></v-select>
                                        </ValidationProvider>
                                        <ValidationProvider v-slot="{ errors }" name="Currency" :rules="'required'">
                                            <v-autocomplete
                                                v-model="form.currency"
                                                :items="currencies"
                                                item-text="name"
                                                item-value="code"
                                                label="Currency"
                                                placeholder="Please Select Currency"
                                                :error-messages="errors"
                                                class="mb-6"
                                            ></v-autocomplete>
                                        </ValidationProvider> 
                                        <ValidationProvider v-slot="{ errors }" name="Opening Market Bid Value" :rules="'required|numeric|min_value:1'">
                                            <v-text-field 
                                                type="number"
                                                v-model="form.opening_market_bid" 
                                                :error-messages="errors"
                                            >
                                                <template slot="label">
                                                    Opening Market Bid <small v-if="form.currency">(in {{ form.currency }})</small>
                                                </template>
                                            </v-text-field>
                                        </ValidationProvider>
                                        <ValidationProvider v-slot="{ errors }" name="Timeframe" :rules="'required|numeric|min_value:1'">
                                            <v-text-field
                                                type="number"
                                                v-model="form.timeframe" 
                                                :error-messages="errors"
                                            >
                                                <template slot="label">
                                                    Timeframe <small>(in minutes)</small>
                                                </template>
                                            </v-text-field>
                                        </ValidationProvider>
                                    </v-col>
                                    <v-col cols="12">
                                        <ValidationProvider v-slot="{ errors }" name="Required Certificates" :rules="'required'">
                                            <v-autocomplete
                                                v-model="form.required_certificates"
                                                :items="requiredCertificates"
                                                item-text="name"
                                                item-value="code"
                                                label="Required Certificates"
                                                :error-messages="errors"
                                                chips
                                                multiple
                                            ></v-autocomplete>
                                        </ValidationProvider> 
                                        <v-textarea 
                                            v-model="form.description" 
                                            label="Description">
                                            <template slot="label">
                                                Description <small>(optional)</small>
                                            </template>
                                        </v-textarea>
                                        <p class="my-2">Instructions <small>(optional)</small></p>
                                        <vue-editor v-model="form.instructions"></vue-editor>
                                    </v-col>
                                    <v-col cols="12">
                                        <h3 class="mb-2">SEO</h3>
                                        <v-divider class="mb-5"></v-divider>
                                        <v-text-field v-model="form.seo_title">
                                            <template slot="label">
                                                SEO Title <small>(optional)</small>
                                            </template>
                                        </v-text-field>
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
                                        <v-textarea 
                                            v-model="form.seo_description"
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
import UtilsMixin from '@/mixins/Utils'
import { VueEditor } from "vue2-editor";
import RequiredCertificates from '@/assets/sample-data/required_certificates'
import JobCategories from '@/assets/sample-data/job_categories'

export default {
    name: 'department-form-modal',
    mixins: [UtilsMixin],
    components: {
        VueEditor
    },
    data() {
        return {
            dialog: false,
            isCreate: true,
            form: {
                title: null,
                slug: null,
                description: null,
                instructions: null,
                biddable: null,
                opening_market_bid: null,
                job_type_id: null,
                timeframe: null, // in minutes
                seo_title: null,
                seo_keywords: null,
                seo_description: null,
                currency: null,
                required_certificates: [],
                job_category_id: null,
            },
            users: Users,
            jobCategories: JobCategories,
            currencies: [],
            canBidItems: [
                { value: true, text: 'Yes' },
                { value: false, text: 'No' },
            ],
            requiredCertificates: RequiredCertificates,
            jobTypes: [
                { id: 1, name: "Project-Based" },
                { id: 2, name: "Hourly Rate" },
            ]
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
                    title: null,
                    slug: null,
                    description: null,
                    instructions: null,
                    biddable: null,
                    opening_market_bid: null,
                    job_type_id: null,
                    timeframe: null, // in minutes
                    seo_title: null,
                    seo_keywords: null,
                    seo_description: null,
                    currency: null,
                    required_certificates: [],
                    job_category_id: null,
                },
                isCreate: true,
                dialog: false
            })
            this.$refs.observer.reset()
        },
        submit() {
            this.$emit('saved', this.form)
            this.reset()
            swal({
                title: "Success",
                icon: "success",
                text: "Job has been successfully saved",
            })
        },
    },
    mounted() {
        this.currencies = this.getCurrencies()
    },
    computed: {
        title() {
            return this.isCreate ? "Adding New Job" : "Job"
        }
    }
}
</script>