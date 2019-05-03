<template>
  <ul class="nav-bar">
    <li>
      <router-link to="/">Home</router-link>
    </li>
    <li>
      <router-link to="/bus">Bus</router-link>
    </li>
    <li>
      <router-link to="/github">Github</router-link>
    </li>
    <li>
      <router-link to="/mongo">Mongo</router-link>
    </li>
    <li>
      <router-link to="/upload">Upload</router-link>
    </li>
    <li>
      <router-link to="/youpin">Youpin</router-link>
    </li>
  </ul>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.nav-bar {
  height: 48px;
  width: 100%;
  font-size: 14px;
  line-height: 2;
  background-color: #24292E;

  a {
    color: #FFF;
  }

  li {
    display: inline-block;
    position: relative;
    padding: 10px;
    transition: 0.2s all linear;
    cursor: pointer;

    &::before {
      content: "";
      position: absolute;
      bottom: 0;
      left: 100%;
      height: 1px;
      width: 0;
      border-bottom: 2px solid #FFF;
      transition: 0.2s all linear;
    }

    &:hover::before {
      left: 0;
      width: 100%;
      transition-delay: 0.1s;
    }

    &:hover ~ li::before {
      left: 0;
    }
  }
}
</style>
