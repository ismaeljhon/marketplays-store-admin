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
                                                v-model="job.title"
                                                :error-messages="errors"
                                                label="Title"
                                            ></v-text-field>
                                        </ValidationProvider>
                                        <ValidationProvider v-slot="{ errors }" name="Slug" :rules="'required'">
                                            <v-text-field
                                                v-model="job.slug"
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
                                                v-model="job.type"
                                            ></v-select>
                                        </ValidationProvider>
                                        <ValidationProvider v-slot="{ errors }" name="Category" :rules="'required'">
                                            <v-select
                                                :items="jobCategories"
                                                label="Category"
                                                :error-messages="errors"
                                                v-model="job.category"
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
                                                v-model="job.biddable"
                                            ></v-select>
                                        </ValidationProvider>
                                        <ValidationProvider v-slot="{ errors }" name="Currency" :rules="'required'">
                                            <v-autocomplete
                                                v-model="job.currency"
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
                                                v-model="job.openingMarketBid" 
                                                :error-messages="errors"
                                            >
                                                <template slot="label">
                                                    Opening Market Bid <small v-if="job.currency">(in {{ job.currency }})</small>
                                                </template>
                                            </v-text-field>
                                        </ValidationProvider>
                                        <ValidationProvider v-slot="{ errors }" name="Timeframe" :rules="'required|numeric|min_value:1'">
                                            <v-text-field
                                                type="number"
                                                v-model="job.timeframe" 
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
                                                v-model="job.requiredCertificates"
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
                                            v-model="job.description" 
                                            label="Description">
                                            <template slot="label">
                                                Description <small>(optional)</small>
                                            </template>
                                        </v-textarea>
                                        <p class="my-2">Instructions <small>(optional)</small></p>
                                        <vue-editor v-model="job.instructions"></vue-editor>
                                    </v-col>
                                    <v-col cols="12">
                                        <h3 class="mb-2">SEO</h3>
                                        <v-divider class="mb-5"></v-divider>
                                        <v-text-field v-model="job.seoTitle">
                                            <template slot="label">
                                                SEO Title <small>(optional)</small>
                                            </template>
                                        </v-text-field>
                                        <v-text-field
                                            v-model="job.seoKeywords"
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
                                            v-model="job.seoDescription"
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
import gql from 'graphql-tag'

export default {
    name: 'job-form-modal',
    mixins: [UtilsMixin],
    apollo: {
        jobCategories: {
            query: gql`
                query {
                    jobCategories {
                        _id,
                        name
                    }
                }
            `,
            update(data) {
                return data.jobCategories
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
        job: {
            query: gql`
                query jobCategory ($id: MongoID!) {
                    job (
                        _id: $id
                    ) {
                        _id,
                        title,
                        slug,
                        description,
                        instructions,
                        biddable,
                        openingMarketBid,
                        type,
                        timeframe,
                        seoTitle,
                        seoKeywords,
                        seoDescription,
                        currency,
                        requiredCertificates,
                        category,
                    }
                }
            `,
            variables() {
                return {
                    id: this.id
                }
            },
            update(data) {
                return data.job
            },
            skip () {
                return true
            }
        },
    },
    components: {
        VueEditor
    },
    data() {
        return {
            id: null,
            dialog: false,
            isCreate: true,
            job: {
                title: null,
                slug: null,
                description: null,
                instructions: null,
                biddable: null,
                openingMarketBid: null,
                type: null,
                timeframe: null, // in minutes
                seoTitle: null,
                seoKeywords: null,
                seoDescription: null,
                currency: null,
                requiredCertificates: [],
                category: null,
            },
            currencies: [],
            canBidItems: [
                { value: true, text: 'Yes' },
                { value: false, text: 'No' },
            ],
            requiredCertificates: RequiredCertificates,
            jobTypes: ["Project-Based", "Hourly Rate"]
        }
    },
    methods: {
        show(id, isCreate = true) {
            this.id = id

            this.$apollo.queries.job.start()
            _assign(this, {
                isCreate: isCreate,
                dialog: true
            })
        },
        reset() {
            this.$apollo.queries.job.stop()
            _assign(this, {
                job: {
                    title: null,
                    slug: null,
                    description: null,
                    instructions: null,
                    biddable: null,
                    openingMarketBid: null,
                    type: null,
                    timeframe: null, // in minutes
                    seoTitle: null,
                    seoKeywords: null,
                    seoDescription: null,
                    currency: null,
                    requiredCertificates: [],
                    category: null,
                },
                isCreate: true,
                dialog: false
            })
            this.$refs.observer.reset()
        },
        async submit() {
            let allowedFields = ["title", "slug", "description", "instructions", "biddable", "openingMarketBid", "type", "timeframe", "seoTitle", "seoKeywords", "seo_description", "currency", "requiredCertificates", "category"]

            this.job.openingMarketBid = parseFloat(this.job.openingMarketBid)
            this.job.timeframe = parseFloat(this.job.timeframe)

            let allowedItems = this.getAllowedItems(this.job, allowedFields)
            
            let result = null
            if (this.job._id) {
                result = await this.updateMutation('Job', allowedItems, this.job._id)
            } else {
                result = await this.createMutation('Job', allowedItems)
            }

            if (result) {
                this.$emit('saved')
                this.reset()
                swal({
                    title: "Success",
                    icon: "success",
                    text: "Job has been successfully saved",
                })
            }
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