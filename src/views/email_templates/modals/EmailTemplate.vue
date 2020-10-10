<template>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition" persistent>
        <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" tile dark v-bind="attrs" v-on="on" small>
                <v-icon left>add</v-icon>Add Email Template
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
                                    <v-col>
                                        <ValidationProvider v-slot="{ errors }" name="Template Name" :rules="'required'">
                                            <v-text-field
                                                v-model="form.name"
                                                :error-messages="errors"
                                                label="Name"
                                            ></v-text-field>
                                        </ValidationProvider>
                                        <ValidationProvider v-slot="{ errors }" name="Email content" :rules="'required'">
                                            <p class="my-2">Content</p>
                                            <vue-editor v-model="form.content"></vue-editor>
                                            <small class="red--text" v-if="errors.length">{{ errors | first_of_array }}</small>
                                        </ValidationProvider>
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
import { VueEditor } from "vue2-editor";

export default {
    name: 'email-template-form-modal',
    components: {
        VueEditor
    },
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
                text: "Email Template has been successfully saved",
            })
        }
    },
    computed: {
        title() {
            return this.isCreate ? "New Email Template" : "Email Template"
        }
    }
}
</script>