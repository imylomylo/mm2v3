<script>
export default {
  name: 'App',
  data: () => ({
    appName: 'OrderBook Live',
    dialog: false,
  }),
  methods: {
    gotoMarket() {
      this.$router.push('/traderview')
    },
    gotoHome(){
      this.$router.push('/')
    },
  },
}
</script>
<template>
  <v-app>
    <v-app-bar app color="indigo" dark>
      <v-toolbar-title>{{ appName }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn rounded depressed dark large color="white" @click="gotoHome()">
        Dashboard
        <v-icon class="px-2">mdi-ballot</v-icon>
      </v-btn>
      <v-btn rounded depressed dark large color="white" @click="gotoMarket()">
        <span>Markets</span>
        <v-icon class="px-2">mdi-apps</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <router-view></router-view>
    </v-main>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="indigo">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Markets</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn dark text @click="dialog = false">back</v-btn>
        </v-toolbar>
        <v-list>
          <v-list-item v-for="(market, index) in markets" :key="index" link>
            <v-list-item-content>
              <v-list-item-title>{{ market }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
  </v-app>
</template>

