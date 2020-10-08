<template>
    <v-row dense>
        <v-col
            v-for="item in items"
            :key="item.id"
            cols="3"
        >
            <v-card>
                <v-img
                    :src="item.img ? item.img : require('@/assets/image-placeholder.jpg')"
                    class="white--text align-end"
                    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                    height="200px"
                >
                    <v-card-title v-text="item.name"></v-card-title>
                </v-img>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn v-bind="attrs" v-on="on" icon color="primary" @click.prevent="$emit('edit', item)">
                                <v-icon>edit</v-icon>
                            </v-btn>
                        </template>
                        <span>Edit this Product</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn v-bind="attrs" v-on="on" icon color="error" @click.prevent="$emit('delete', item)">
                                <v-icon>close</v-icon>
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
export default {
    name: 'product-grid-view',
    props: {
        items: {
            type: [Array, Object]
        }
    },
    data: () => ({
        cards: [
            { title: 'Pre-fab homes', src: 'https://cdn.vuetifyjs.com/images/cards/house.jpg', flex: 12 },
            { title: 'Favorite road trips', src: 'https://cdn.vuetifyjs.com/images/cards/road.jpg', flex: 6 },
            { title: 'Best airlines', src: 'https://cdn.vuetifyjs.com/images/cards/plane.jpg', flex: 6 },
        ],
    }),
}
</script>