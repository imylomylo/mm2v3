<template>
  <div>
    <h1>App Page</h1>
    <p>Welcome to the Home page!</p>
    <v-btn to="/dashboard" text="Dashboard"></v-btn>
    <v-btn to="/wallet" text="Wallet"></v-btn>
    <router-view></router-view>
  </div>
</template>
