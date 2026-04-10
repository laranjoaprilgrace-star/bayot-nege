<script setup>
import { ref } from 'vue';
import { state } from '../store';

const password = ref('');
const error = ref(false);
const shaking = ref(false);

const ADMIN_PASSWORD = 'cityAdmin123';

const login = () => {
  if (password.value === ADMIN_PASSWORD) {
    state.adminAuthenticated = true;
    error.value = false;
  } else {
    error.value = true;
    shaking.value = true;
    password.value = '';
    setTimeout(() => { shaking.value = false; }, 500);
  }
};
</script>

<template>
  <div class="alog-wrap">
    <div class="alog-card" :class="{ shake: shaking }">

      <div class="alog-icon">⚙️</div>
      <h2 class="alog-title">Admin Portal</h2>
      <p class="alog-sub">Enter your password to continue.</p>

      <form @submit.prevent="login" class="alog-form">
        <input
          type="password"
          v-model="password"
          placeholder="Password"
          class="alog-input"
          :class="{ error: error }"
          autofocus
        />
        <p v-if="error" class="alog-error">Incorrect password. Try again.</p>
        <button type="submit" class="alog-btn">Unlock Dashboard →</button>
      </form>

      <button class="alog-back" @click="state.isAdminMode = false">
        ← Back to Booking
      </button>
    </div>
  </div>
</template>

<style scoped>
.alog-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.alog-card {
  background: white;
  border-radius: 24px;
  padding: 60px 52px;
  width: 100%;
  max-width: 420px;
  text-align: center;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.12);
  transition: transform 0.1s ease;
}

.alog-card.shake {
  animation: shake 0.4s cubic-bezier(.36,.07,.19,.97);
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-8px); }
  40%       { transform: translateX(8px); }
  60%       { transform: translateX(-6px); }
  80%       { transform: translateX(6px); }
}

.alog-icon {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.alog-title {
  font-size: 1.75rem;
  font-weight: 300;
  letter-spacing: -0.02em;
  color: #000;
  margin-bottom: 8px;
}

.alog-sub {
  font-size: 0.85rem;
  color: #718096;
  font-weight: 300;
  margin-bottom: 36px;
}

.alog-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.alog-input {
  background: #f7f7f7;
  border: 1px solid transparent;
  border-radius: 12px;
  padding: 16px 20px;
  font-family: inherit;
  font-size: 1rem;
  text-align: center;
  letter-spacing: 0.2em;
  transition: all 0.2s ease;
  width: 100%;
}

.alog-input:focus {
  outline: none;
  background: white;
  border-color: #000;
  box-shadow: 0 0 0 4px rgba(0,0,0,0.05);
}

.alog-input.error {
  border-color: #e53e3e;
  background: #fff5f5;
}

.alog-error {
  font-size: 0.78rem;
  color: #e53e3e;
  font-weight: 500;
}

.alog-btn {
  background: #000;
  color: white;
  border: none;
  border-radius: 100px;
  padding: 16px;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.25s ease;
  margin-top: 4px;
}

.alog-btn:hover {
  background: #222;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.alog-back {
  background: transparent;
  border: none;
  font-size: 0.78rem;
  color: #a0aec0;
  cursor: pointer;
  font-family: inherit;
  transition: color 0.2s ease;
  padding: 0;
}

.alog-back:hover {
  color: #000;
  transform: none;
  background: transparent;
}
</style>
