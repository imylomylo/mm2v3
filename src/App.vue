<template>
  <v-app>
    <v-main>
      <v-app-bar app color="indigo" dark>

        <v-toolbar-items>
          <v-menu offset-y style="z-index: 100">

        <v-toolbar-items class="hidden-sm-and-down">
          <v-menu offset-y>

            <template v-slot:activator="{ on, attrs }">
              <v-btn icon dark v-bind="attrs" v-on="on">
                <v-icon>mdi-menu</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="gotoWithdraw()">
                <v-list-item-title>Settings</v-list-item-title>
              </v-list-item>
              <v-list-item @click="gotoWithdraw()">
                <v-list-item-title>Withdraw</v-list-item-title>
              </v-list-item>
              <v-list-item @click="gotoDeposit()">
                <v-list-item-title>Deposit</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar-items>
        <v-toolbar-title>{{ appName }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn rounded depressed dark large color="white" @click="gotoHome()">
          Dashboard
          <v-icon class="px-2">mdi-ballot</v-icon>
        </v-btn>
        <router-link to="/settings">
          <v-btn rounded depressed dark large color="white">
            <span>Markets</span>
            <v-icon class="px-2">mdi-apps</v-icon>
          </v-btn>
        </router-link>
      </v-app-bar>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>


<script>

export default {
  name: 'App',
  data: () => ({
    appName: 'OrderBook Live',
  }),
  methods: {
    gotoHome() {
      this.$router.push('/')
    },
    gotoSettings() {
      this.$router.push('/settings')
    },
    gotoWithdraw() {
      this.$router.push('/withdraw')
    },
    gotoDeposit() {
      this.$router.push('/deposit')
    },
    gotoMarkets() {
      this.$router.push('/settings')
    },
  },
}
</script>
