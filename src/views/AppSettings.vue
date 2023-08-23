<template>
  <v-app>
    <div style="margin-top: 100px;">
      <h2>{{ appName }}</h2>

      <v-btn
        :loading="loading5"
        :disabled="loading5"
        color="blue-grey"
        class="ma-2 white--text"
        fab
        @click="loader = 'loading5'"
      >
        <v-icon dark>cloud_upload</v-icon>
        Upload
      </v-btn>

      <div>
        <v-data-table :headers="headers" :items="configService">
          <template #item.bidmargin="{ item }">
            <v-edit-dialog
              :return-value.sync="item.bidmargin"
              large
              persistent
              @save="save"
              @cancel="cancel"
              @open="open"
              @close="close"
            >
              {{ item.bidmargin }}
              <template #input>
                <v-text-field
                  v-model="item.bidmargin"
                  :rules="[max25chars]"
                  label="Edit"
                  single-line
                  counter
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
          <template #item.askmargin="{ item }">
            <v-edit-dialog
              :return-value.sync="item.askmargin"
              large
              persistent
              @save="save"
              @cancel="cancel"
              @open="open"
              @close="close"
            >
              <div>{{ item.askmargin }}</div>
              <template #input>
                <v-text-field
                  v-model="item.askmargin"
                  :rules="[max25chars]"
                  label="Edit"
                  single-line
                  counter
                  autofocus
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
        </v-data-table>

        <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
          {{ snackText }}
          <v-btn text @click="snack = false">Close</v-btn>
        </v-snackbar>
      </div>
    </div>
  </v-app>
</template>

<script>
import axios from "axios";
import { ref } from "vue";
import { VDataTable} from 'vuetify';

export default {
  name: "AppSettings",
  components: {
    VDataTable,
  },
  data() {
    return {
      appName: "Settings",
      loading5: ref(false),
      loader: null,
      configService: [],
      supportedCoins: "",
      customerrors: [],
      snack: ref(false),
      snackColor: "",
      snackText: "",
      max25chars: v => v.length <= 25 || "Input too long!",
      pagination: {},
      headers: [
        // Your header definitions here...
      ],
    };
  },
  methods: {
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
        .get("http://" + process.env.VITE_VUE_APP_WEBHOST)
        .then(response => {
          if (response.data !== undefined) {
            this.configService = response.data;
            console.log(this.configService);
          }
        })
        .catch(e => {
          this.customerrors.push(e);
        });
    },
  },
  created() {
    console.log("AppSettings Created");
    this.getServiceConfig();
    console.log("AppSettings Finished Created");
  },
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
