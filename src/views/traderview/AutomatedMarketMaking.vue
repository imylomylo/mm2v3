<template>
  <v-card outlined>
    <v-row justify="center">
      <!-- <v-btn color="success" class="mt-12" @click="overlay = !overlay">Show Overlay</v-btn> -->

      <v-overlay :absolute="true" :model-value="overlay" contained persistent class="align-center justify-center">
        <v-btn color="success" @click="setOverlay(true)">Enable Automation</v-btn>
      </v-overlay>
    </v-row>
    <div>
      <v-toolbar flat dense>
        <v-toolbar-title>
          <span class="subheading">Automated Market Making</span>
        </v-toolbar-title>
        <div class="flex-grow-1"></div>
      </v-toolbar>

      <v-divider class="mx-4"></v-divider>
      <CurrentStrategies />

      <v-card-text>
        <v-row class="mb-4" justify="space-between">
          <v-col class="text-left">
            <span class="display-3 font-weight-light" v-text="spread / 100"></span>
            <span class="subheading font-weight-light mr-1">%</span>
            <v-fade-transition>
              <v-avatar
                v-if="isPlaying"
                :color="mmcolor"
                :style="{
                animationDuration: animationDuration
              }"
                class="mb-1 v-avatar--metronome"
                size="12"
              ></v-avatar>
            </v-fade-transition>
          </v-col>
          <v-col class="text-right">
            <v-btn icon color="indigo" @click="toggle()">
              <v-icon>mdi-play</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-slider
          label="Set Spread"
          v-model="spread"
          :color="mmcolor"
          track-color="grey"
          always-dirty
          min="40"
          max="250"
        ></v-slider>
        <v-slider
          label="Order Size"
          thumb-label="always"
          v-model="ordersize"
          :color="mmcolor"
          track-color="grey"
          always-dirty
          min="5"
          max="100"
        ></v-slider>
        <div class="text-center">
          <v-chip class="ma-2" color="success" @click="onlybuyrel(114)">
            <v-icon left>mdi-server-plus</v-icon>Only buy rel
          </v-chip>
          <v-chip class="ma-2" color="red" dark @click="onlybuyrel(115)">
            <v-icon left>mdi-server-plus</v-icon>Only sell rel
          </v-chip>
          <v-chip class="ma-2" color="indigo" dark @click="onlybuyrel(116)">
            <v-icon left>mdi-server-plus</v-icon>Trade both ways
          </v-chip>
        </div>
      </v-card-text>
    </div>
  </v-card>
</template>
<script>
import CurrentStrategies from "./CurrentStrategies.vue";
import { ref } from 'vue';

export default {
  components: {
    CurrentStrategies
  },
  setup() {
    const spread = ref(50);
    const ordersize = ref(10);
    const overlay = ref(true);
    const isPlaying = ref(false);

    return {
      spread,
      ordersize,
      overlay,
      isPlaying,
      mmcolor: "indigo"
    };
  },
  computed: {
    mmcolor() {
      if (this.spread / 100 + this.ordersize < 50) return "indigo";
      if (this.spread / 100 + this.ordersize < 80 || this.spread < 170) return "deep-orange";
      return "purple";
    },
    animationDuration() {
      return `${30 / this.spread}s`;
    }
  },
  methods: {
    setOverlay(v) {
      this.overlay = v;
    },
    enable(change) {
      this.overlay = change;
      this.$emit("toggleAMM", change);
    },
    toggle() {
      this.isPlaying = !this.isPlaying;
    },
    onlybuyrel(rel) {
      console.log("Only buy rel: " + rel);
    }
  },
  computed: {
    isEnabled() {
      return this.overlay;
    }
  }
};
</script>

<style scoped>
@keyframes metronome-example {
  from {
    transform: scale(0.5);
  }

  to {
    transform: scale(1);
  }
}

.v-avatar--metronome {
  animation-name: metronome-example;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}

</style>
