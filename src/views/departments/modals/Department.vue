<template>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
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
                                        <ValidationProvider v-slot="{ errors }" name="Team Lead" :rules="'required'">
                                            <v-autocomplete
                                                v-model="form.user_team_lead_id"
                                                :items="users"
                                                hide-no-data
                                                item-text="ownerName"
                                                item-value="ownerID"
                                                label="Team Lead"
                                                placeholder="Select Team Lead from the users"
                                                :error-messages="errors"
                                            ></v-autocomplete>
                                        </ValidationProvider>
                                        <ValidationProvider v-slot="{ errors }" name="Code" :rules="'required'">
                                            <v-text-field
                                                v-model="form.code"
                                                :error-messages="errors"
                                                label="Code"
                                            ></v-text-field>
                                        </ValidationProvider>
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
                                        <ValidationProvider v-slot="{ errors }" name="Pricing" :rules="'required|numeric'">
                                            <v-text-field
                                                type="number"
                                                v-model="form.pricing"
                                                :error-messages="errors"
                                                label="Pricing"
                                            ></v-text-field>
                                        </ValidationProvider>
                                        <v-textarea 
                                            v-model="form.description" 
                                            label="Description">
                                            <template slot="label">
                                                Description <small>(optional)</small>
                                            </template>
                                        </v-textarea>
                                    </v-col>
                                    <v-col cols="6">
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

export default {
    name: 'department-form-modal',
    data() {
        return {
            dialog: false,
            isCreate: true,
            form: {
                name: null,
                code: null,
                description: null,
                slug: null,
                pricing: null,
                seo_title: null,
                seo_keywords: null,
                seo_description: null,
                user_team_lead_id: null,
            },
            users: Users,
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
                    code: null,
                    description: null,
                    slug: null,
                    pricing: null,
                    seo_title: null,
                    seo_keywords: null,
                    seo_description: null,
                    user_team_lead_id: null,
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
                text: "Department has been successfully saved",
            })
        }
    },
    computed: {
        title() {
            return this.isCreate ? "Adding New Department" : "Department"
        }
    }
}
</script>