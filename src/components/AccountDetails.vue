<template>
  <div class="container mt-4">
    <h1>Account Details</h1>
    <div v-if="account">
      <p><strong>Account Name:</strong> {{ account.name }}</p>
      <p><strong>Account Number:</strong> {{ account.account_number }}</p>
      <p><strong>Balance:</strong> {{ account.balance }} {{ account.currency }}</p>
      <p><strong>Country:</strong> {{ account.country }}</p>
      <p><strong>Status:</strong> {{ account.status }}</p>
      <p><strong>Created At:</strong> {{ new Date(account.created_at).toLocaleString() }}</p>
      <router-link to="/accounts" class="btn btn-secondary mt-3">Back to Accounts</router-link>
    </div>
    <div v-else>
      <p>Loading account details...</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AccountDetails',
  data() {
    return {
      account: null,
    };
  },
  async created() {
    const accountId = this.$route.params.id;
    const path = `${process.env.VUE_APP_ROOT_URL}/accounts/${accountId}`;
    try {
      const response = await axios.get(path);
      this.account = response.data;
    } catch (error) {
      console.error(error);
      // Optionally handle error, e.g., redirect to an error page or show a message
      this.account = { error: 'Could not load account details.' };
    }
  },
}
</script>

<style scoped>
/* Add any specific styles for this component here */
</style> 