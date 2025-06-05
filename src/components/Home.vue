<template>
  <div class="home">
    <h1>Welcome to IE Bank</h1>
    <p>Your trusted partner for financial services.</p>
    
    <router-link to="/accounts" class="btn btn-primary mt-3">View All Accounts</router-link>
    
    <!-- Add more content or links here later -->
  </div>
</template>

<script>
export default {
  name: 'Home',
}
</script>

<style scoped>
.home {
  text-align: center;
  margin-top: 50px;
}
</style> 