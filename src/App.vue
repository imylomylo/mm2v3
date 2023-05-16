<template>
  <v-app>
    <v-main>
      <v-app-bar app color="indigo" dark>
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
    gotoMarket: function() {
      // console.log("Going to new market..." + base + "/")// + rel)
      console.log(this.componentKey)
      this.componentKey += 1
      this.dialog = !this.dialog
      // this.$router.push("#")
      // this.$router.push("/traderview?base=" + base + "&rel=KMD")// + rel);

// window.location.href = "#/" + command.toLowerCase().replace(/ /g, "");
    },
    doAction: function(command) {
      window.location.href = "/#/" + command.toLowerCase().replace(/ /g, "");
    }
  },
}
</script>
