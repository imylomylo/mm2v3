<template>
  <v-app>
    <div style="margin-top: 100px;">
    <v-card>
    <div>
      <h2>{{ appName }}</h2>
      <v-text-field
      v-model="url"
      label="Enter URL"
      :rules="rules"
      hide-details="auto"
    ></v-text-field>
    <v-btn @click="submitForm"> Submit </v-btn>
    <v-snackbar v-model="snackbar1"> URL submitted Successfully</v-snackbar>
      <v-btn
        :loading="loading5"
        :disabled="loading5"
        class="ma-2 white--text"
        fab
        @click="loader = 'loading5'"
      >
        <v-icon dark>mdi-cloud-upload</v-icon>
      </v-btn>

      <div>
        <v-data-table :headers="headers" :items="configService">
          <template #item.bidmargin="{ props }">
            <v-edit-dialog
              v-model="props.item.bidmargin"
              large
              persistent
              @save="save"
              @cancel="cancel"
              @open="open"
              @close="close"
            >
              <template #input>
                <v-text-field
                  v-model="props.item.bidmargin"
                  :rules="[max25chars]"
                  label="Edit"
                  single-line
                  counter
                ></v-text-field>
              </template>
            </v-edit-dialog>
            {{ props.item.bidmargin }}
          </template>
          <template #item.askmargin="{ props }">
            <v-edit-dialog
              v-model="props.item.askmargin"
              large
              persistent
              @save="save"
              @cancel="cancel"
              @open="open"
              @close="close"
            >
              <template #input>
                <v-text-field
                  v-model="props.item.askmargin"
                  :rules="[max25chars]"
                  label="Edit"
                  single-line
                  counter
                  autofocus
                ></v-text-field>
              </template>
            </v-edit-dialog>
            <div>{{ props.item.askmargin }}</div>
          </template>
        </v-data-table>

        <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
          {{ snackText }}
          <v-btn text @click="snack = false">Close</v-btn>
        </v-snackbar>
      </div>
    </div>
    </v-card>
    </div>
  </v-app>
</template>

<script>
import axios from "axios";
import { ref } from "vue";
import {VDataTable} from "vuetify/labs/VDataTable";

export default {
  name: "AppSettings",
  components:{
    VDataTable,
  },
  data() {
    return {
      appName: "Settings",
      rules: [
        value => !!value || 'Required.',
        value => (value && value.length >= 3) || 'Min 3 characters',
      ],
      url: '',
      loading5: ref(false),
      loader: ref(null),
      snackbar1: ref(false),
      configService: ref([]),
      supportedCoins: "",
      customerrors: ref([]),
      snack: ref(false),
      snackColor: "",
      snackText: "",
      max25chars: v => v.length <= 25 || "Input too long!",
      pagination: {},
      headers: [
        {
          title: "Coin",
          align: "left",
          sortable: false,
          key: "ticker"
        },
        { title: "CMCID", key: "cmcid" },
        { title: "Binance", key: "ticker" },
        { title: "CEX Price", key: "cexprice" },
        { title: "Paprika", key: "papid" },
        { title: "Pap Price", key: "papprice" },
        { title: "Bid Margin", key: "bidmargin" },
        { title: "Ask Margin", key: "askmargin" },
        { title: "Quantity", key: "quantity" }
      ]
    };
  },
  methods: {
    submitForm() {
      this.url = '';
      this.snackbar1 = true;
    },
    save() {
      this.snack = ref(true);
      this.snackColor = "success";
      this.snackText = "Data saved";
    },
    cancel() {
      this.snack = ref(true);
      this.snackColor = "error";
      this.snackText = "Canceled";
    },
    open() {
      this.snack = ref(true);
      this.snackColor = "info";
      this.snackText = "Dialog opened";
    },
    close() {
      console.log("Dialog closed");
    },
    getServiceConfig() {
      axios
        .get("http://" + import.meta.env.VITE_VUE_APP_WEBHOST)
        .then(response => {
          if (response.data !== undefined) {
            this.configService = response.data;
            console.log(this.configService);
          }
        })
        .catch(e => {
          this.customerrors.push(e);
        });
    }
  },
  created() {
    console.log("AppSettings Created");
    this.getServiceConfig();
    console.log("AppSettings Finished Created");
  }
};
</script>

<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
