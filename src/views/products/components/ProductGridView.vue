<template>
    <v-row dense>
        <v-col cols="12" v-if="items.length <= 0">
            <v-divider></v-divider>
            <p class="text-center mt-5 d-block"><em>No Data Available</em></p>
        </v-col>
        
        <v-col
            v-for="item in items"
            :key="item.id"
            cols="3"
        >
            <v-card outlined :raised="item.is_selected">
                <v-img
                    :src="item.img ? item.img : require('@/assets/image-placeholder.jpg')"
                    class="white--text align-end"
                    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                    height="200px"
                >
                    <v-card-title v-text="item.name"></v-card-title>
                </v-img>

                <v-card-actions>
                    <!-- <v-checkbox
                        v-model="item.is_selected"
                        class="py-0"
                        color="success"
                        @click.prevent="$emit('update-item', item)"
                    ></v-checkbox> -->
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn v-bind="attrs" v-on="on" icon color="primary" @click.prevent="$emit('edit', item._id)">
                                <v-icon>mdi-square-edit-outline</v-icon>
                            </v-btn>
                        </template>
                        <span>Edit this Product</span>
                    </v-tooltip>
                    <v-spacer></v-spacer>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn v-bind="attrs" v-on="on" icon color="error" @click.prevent="$emit('delete', item)">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </template>
                        <span>Delete Product</span>
                    </v-tooltip>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</template>
<script>
import _forEach from 'lodash/forEach'
export default {
    name: 'product-grid-view',
    props: {
        items: {
            type: [Array, Object]
        },
    },
    data: () => ({
        
    }),
}
</script>