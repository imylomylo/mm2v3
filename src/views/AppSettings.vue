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
    </v-btn>

    <div>
      <v-data-table :headers="headers" :items="configService">
        <template v-slot:item.bidmargin="props">
          <v-edit-dialog
            :return-value.sync="props.item.bidmargin"
            large
            persistent
            @save="save"
            @cancel="cancel"
            @open="open"
            @close="close"
          >
            {{ props.item.bidmargin }}
            <template v-slot:input>
              <v-text-field
                v-model="props.item.bidmargin"
                :rules="[max25chars]"
                label="Edit"
                single-line
                counter
              ></v-text-field>
            </template>
          </v-edit-dialog>
        </template>
        <template v-slot:item.askmargin="props">
          <v-edit-dialog
            :return-value.sync="props.item.askmargin"
            large
            persistent
            @save="save"
            @cancel="cancel"
            @open="open"
            @close="close"
          >
            <div>{{ props.item.askmargin }}</div>
            <template v-slot:input>
              <div class="mt-4 title">Update askmargin</div>
            </template>
            <template v-slot2:input>
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
import { VDataTable } from 'vuetify/labs/VDataTable';
import { ref } from "vue";

export default {
  name: "AppSettings",
  components: {
    VDataTable,
  },
  data: function() {
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
    getServiceConfig: function() {
      axios
        .get( "http://" + process.env.VITE_VUE_APP_WEBHOST )//+ ":7780/config2")
        .then(response => {
          // console.log(response.data);
          // JSON responses are automatically parsed.
          if (response.data !== undefined) {
            // console.log(response.data.result)
            this.configService = response.data;
            console.log(this.configService);
          }
        })
        .catch(e => {
          this.customerrors.push(e);
        });
    }
  },
  created: function() {
    console.log("AppSettings Created");
    this.getServiceConfig();
    console.log("AppSettings Finished Created");
  },
  computed: {
    niceSettings: function() {
      for (var key in validation_messages) {
        // skip loop if the property is from prototype
        if (!validation_messages.hasOwnProperty(key)) continue;

        var obj = validation_messages[key];
        for (var prop in obj) {
          // skip loop if the property is from prototype
          if (!obj.hasOwnProperty(prop)) continue;

          // your code
          alert(prop + " = " + obj[prop]);
        }
      }
    }
  },
  watch: {
    loader() {
      const l = this.loader;
      this[l] = !this[l];

      setTimeout(() => (this[l] = false), 3000);

      this.loader = null;
    }
  }
};
</script>

<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
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