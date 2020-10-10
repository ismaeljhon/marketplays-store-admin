<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
    >
      <v-list dense>
        <div v-for="(item, index) in navigation" :key="index">
          <v-list-item link v-if="item.key != 'divider'" :to="item.link" :disabled="item.disabled">
            <v-list-item-action>
              <v-icon :color="item.icon_color || ''">{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ item.label }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider v-else></v-divider>
        </div>
        
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="indigo"
      dark
      clipped-left
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>MarketPlays E-Commerce</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="white"
            v-bind="attrs"
            v-on="on"
            text
          >
            Howdy, John Doe <v-icon>arrow_drop_down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click.prevent="logout">
            <v-list-item-title><v-icon class="mr-2">exit_to_app</v-icon>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-row>
          <v-col>
              <router-view></router-view>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-footer
      color="indigo"
      app
    >
      <span class="white--text">Copyright &copy; {{ new Date().getFullYear() }} All Rights Reserved | Bickert Management Inc.</span>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    props: {
      source: String,
    },
    data: () => ({
      drawer: null,
      navigation: [
        { key: "dashboard", label: "Dashboard", icon: "dashboard", disabled: true },
        { key: "orders", label: "Orders", icon: "shopping_cart", disabled: true },
        { key: "departments", label: "Departments", icon: "business", link: '/departments' },
        { key: "services", label: "Products & Services", icon: "local_offer", link: '/products' },
        { key: "subscriptions", label: "Subscriptions", icon: "subscriptions", disabled: true },
        { key: "job-categories", label: "Job Categories", icon: "device_hub", link: '/job-categories' },
        { key: "job-listing", label: "Job Listing", icon: "work_outline", link: '/jobs' },
        { key: "divider" },
        { key: "email-template", label: "Email Template", icon: "mail_outline", link: '/email-templates' },
        { key: "payment-integration", label: "Payment Integration", icon: "credit_card", disabled: true },
        { key: "currency", label: "Currency", icon: "attach_money", disabled: true },
        { key: "taxes", label: "Taxes", icon: "account_balance", disabled: true },
        { key: "coupons", label: "Coupons", icon: "local_atm", disabled: true },
        { key: "department-requests", label: "Department Requests", icon: "announcement", icon_color: "orange darken-1", disabled: true },
      ]
    }),
    methods: {
      logout() {
      }
    }
  }
</script>