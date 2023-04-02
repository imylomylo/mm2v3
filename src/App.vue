<template>
  <div>
    <h1>App Page</h1>
    <p>Welcome to the Home page!</p>
    <router-link to="/dashboard" tag="button" >Dashboard</router-link>
    <router-link to="/wallet" tag="button" >Wallet</router-link>
    <router-view></router-view>
  </div>
</template>
