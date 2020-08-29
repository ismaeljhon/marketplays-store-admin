<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-list dense>
        <div v-for="(item, index) in navigation" :key="index">
          <v-list-item link v-if="item.key != 'divider'">
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
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>MarketPlays Store Admin</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col class="text-center">
            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <v-btn
                  :href="source"
                  icon
                  large
                  target="_blank"
                  v-on="on"
                >
                  <v-icon large>mdi-code-tags</v-icon>
                </v-btn>
              </template>
              <span>Source</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-footer
      color="indigo"
      app
    >
      <span class="white--text">&copy; {{ new Date().getFullYear() }}</span>
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
        { key: "dashboard", label: "Dashboard", icon: "dashboard" },
        { key: "orders", label: "Orders", icon: "shopping_cart" },
        { key: "departments", label: "Departments", icon: "art_track" },
        { key: "services", label: "Services", icon: "build" },
        { key: "subscriptions", label: "Subscriptions", icon: "subscriptions" },
        { key: "job-listing", label: "Job Listing", icon: "work_outline" },
        { key: "job-categories", label: "Job Categories", icon: "category" },
        { key: "divider" },
        { key: "department-requests", label: "Department Requests", icon: "announcement", icon_color: "red darken-1"},
        { key: "email-template", label: "Email Template", icon: "mail_outline" },
        { key: "payment-integration", label: "Payment Integration", icon: "credit_card" },
        { key: "currency", label: "Currency", icon: "local_atm" },
        { key: "taxes", label: "Taxes", icon: "account_balance" },
        { key: "coupons", label: "Coupons", icon: "receipt" },
      ]
    }),
  }
</script>