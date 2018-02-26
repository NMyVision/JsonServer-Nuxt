<template lang="pug">
section.container.mt-5: .card
  .card-body
    div.text-center: img.logo(src='~assets/img/logo.png', alt='Nuxt.js Logo')
    h4 USERS
    
    pre.bg-light.p-2: code {{ JSON.stringify( user, null, 2)}}
   
    nuxt-link.btn.btn-sm.btn-outline-primary(href to="/") Back
    
</template>

<script>
import axios from "~/plugins/axios"

export default {
  name: "DetailPage",
  asyncData({ params, error }) {
    return axios
      .get("/api/users/" + params.id)
      .then(res => {
        return { user: res.data }
      })
      .catch(e => {
        error({ statusCode: 404, message: "User not found" })
      })
  },
  head() {
    return {
      title: `User: ${this.user.name}`
    }
  }
}
</script>
