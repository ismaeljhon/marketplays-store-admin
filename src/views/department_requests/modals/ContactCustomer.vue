<template>
    <v-dialog 
        v-model="dialog" 
        max-width="700"
        :persistent="isCallStarted"
    >
        <v-card>
            <v-card-title>Contact Customer</v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="12">
                        <v-row>
                            <v-col cols="12">
                                    <p class="my-1">Select Device:</p>
                                    <v-btn-toggle 
                                        v-model="form.contactType"
                                        tile
                                        background-color="#fff"
                                        mandatory
                                    >
                                        <v-btn x-large value="phone">
                                            <v-icon left>mdi-phone</v-icon>phone
                                        </v-btn>

                                        <v-btn x-large value="mobile">
                                            <v-icon left>mdi-cellphone</v-icon>mobile
                                        </v-btn>
                                    </v-btn-toggle>
                            </v-col>
                            <v-col cols="12">
                                <p class="my-2">Notes <small>(optional)</small></p>
                                <vue-editor v-model="form.notes"></vue-editor>
                            </v-col>
                        </v-row>
                        
                        <div class="mt-2">
                            <v-btn @click.prevent="reset">cancel</v-btn>
                            <v-btn 
                                v-if="!isCallStarted"
                                color="primary" 
                                class="float-right" 
                                @click.prevent="isCallStarted = true"
                            >
                                start a call
                            </v-btn>
                            <v-btn
                                v-else
                                color="success" 
                                class="float-right"
                                @click.prevent="submit"
                            >
                                Finish &amp; Save Notes
                            </v-btn>
                        </div>
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
    name: 'contact-customer-modal',
    components: {
        VueEditor
    },
    data: () => ({
        dialog: false,
        form: {
            departmentRequestId: null,
            notes: null,
            contactType: null,
        },
        isCallStarted: false,
    }),
    methods: {
        async show(departmentRequestId) {
            _assign(this, {
                dialog: true
            })
            this.form.departmentRequestId = departmentRequestId
        },
        reset() {
            _assign(this, {
                dialog: false,
                form: {
                    departmentRequestId: null,
                    notes: null,
                    contactType: null,
                },
                isCallStarted: false,
            })
        },
        async submit() {
            console.log(this.form)
        }
    },
}
</script>